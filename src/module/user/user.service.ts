import { Injectable } from '@nestjs/common';
import { Importer, ImporterHandler } from 'datainout/importers';
import { User } from 'src/entities/user.entity';
import { UserImporterHandler } from 'src/importer-handlers/user.importer-handler';
import { Repository } from 'typeorm';
import {
  ExcelTemplateImport,
  ExcelTemplateReport,
} from 'datainout/template-generators';
import { InjectRepository } from '@nestjs/typeorm';
import { Reporter } from 'datainout/reporters';
import { UserPartial } from './partial-user';
import { Writable } from 'stream';
import { fakeUser } from 'src/fake-data/fakeUser';
import { createGzip } from 'zlib';
@Injectable()
export class UserService {
  importTemplatePath = 'user-template-import';
  reportTemplatePath = 'user-template-report';
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createImportTemplate(buffer: Buffer, templatePath: string) {
    await new ExcelTemplateImport(templatePath).generate(buffer);
    return { msg: 'ok' };
  }

  async import(buffer: Buffer) {
    console.log('start', new Date());
    console.time('counting time');
    const importer = new Importer(this.importTemplatePath);
    importer.ExcelTemplate.add([
      {
        keyName: 'createdBy',
        section: 'table',
        type: 'virtual',
        setValue: () => ({ name: 'AAA', createdAt: new Date() }),
      },
    ]);
    await importer.load(buffer, new UserImporterHandler(), {
      ignoreErrors: false,
      chunkSize: 10000,
    });
    console.log('end', new Date());
    console.timeEnd('counting time');

    return { msg: 'Ok' };
  }

  async createReportTemplate(buffer: Buffer, templatePath: string) {
    await new ExcelTemplateReport(templatePath).generate(buffer);
    return { msg: 'ok' };
  }

  async report(templatePath: string) {
    const users = fakeUser(200000);
    console.time('couting....');
    const exporter = new Reporter(templatePath).createExporterEXCEL();
    const buffer = await exporter.toBuffer({ table: users });
    console.timeEnd('couting....');
    return buffer;
  }

  async reportFile(templatePath: string) {
    const users = fakeUser(200000);
    console.time('couting....');
    const exporter = new Reporter(templatePath).createExporterEXCEL();
    await exporter.write('excel-file.xlsx', { table: users });
    console.timeEnd('couting....');
  }

  reportStream(stream: Writable) {
    const userTranfer = new UserPartial();
    const exporter = new Reporter(
      this.reportTemplatePath,
    ).createExporterEXCEL();
    let startTime: number;
    let startTimeAddRow;
    let totalTimeAddRow;

    exporter.Event.onBegin((sheetName) =>
      console.log(`Begin sheetName ${sheetName}`),
    )
      // .onHeader((sheetName) => console.log(`OnHeader sheetName ${sheetName}`))
      // .onFooter((sheetName) => console.log(`Begin sheetName ${sheetName}`))
      // .onEnd((sheetName) => console.log(`End sheetName ${sheetName}`))
      .onFinish(() => {
        console.timeEnd('finish:::');
      })
      .onFile(() => {
        console.time('finish:::');
      })
      .onData(() => (startTimeAddRow = new Date().getTime()))
      .endData(
        () => (totalTimeAddRow += new Date().getTime() - startTimeAddRow),
      );

    exporter.streamTo(stream, { table: userTranfer }, { style: 'no-style' });

    // reporterStream.onBegin(() => {
    //   console.time('count time');
    //   console.log('Begin sheet', new Date());
    // });
    // reporterStream.onEnd(() => console.log('End sheet'));
    // reporterStream.onFinish(() => {
    //   console.log('export file successfully', new Date());
    //   console.timeEnd('count time');
    // });
    // reporterStream.start();

    return { msg: 'ok' };
  }
}

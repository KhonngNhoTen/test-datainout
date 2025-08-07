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
import { UserParital } from '../partial-tranfers/new-partial-user';
import { Readable, Writable } from 'stream';
import { fakeUser } from 'src/fake-data/fakeUser';
import { UserStreamPartial } from '../partial-tranfers/partial-user-stream';
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
      chunkSize: 5000,
      jobCount: 4,
    });
    console.timeEnd('counting time');

    return { msg: 'Ok' };
  }

  async importStream(stream: Readable) {
    const importer = new Importer(this.importTemplatePath);
    importer.ExcelTemplate.add([
      {
        keyName: 'createdBy',
        section: 'table',
        type: 'virtual',
        setValue: () => ({ name: 'AAA', createdAt: new Date() }),
      },
    ]);

    const streamer = importer.createStream(stream, new UserImporterHandler(), {
      chunkSize: 8000,
    });
    streamer.onBegin((sheetName) => {
      console.time('finish:::');
      console.log(`Begin import sheetName ${sheetName}`);
    });
    streamer.onFinish(() => {
      console.timeEnd('finish:::');
    });

    streamer.start();
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
    const buffer = await exporter.toBuffer(
      { table: users },
      { style: 'no-style' },
    );
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
    const userTranfer = new UserParital();

    const exporter = new Reporter(
      'order-report-template',
    ).createExporterEXCEL();

    exporter.Event.onBegin((sheetName) =>
      console.log(`Begin sheetName ${sheetName}`),
    );

    exporter.Event.onFinish(() => {
      console.timeEnd('finish:::');
    });

    exporter.Event.onStart(() => {
      console.log('begin:');
      console.time('finish:::');
    });

    exporter.streamTo(stream, { table: userTranfer }, { style: 'no-style' });

    return { msg: 'ok' };
  }
}

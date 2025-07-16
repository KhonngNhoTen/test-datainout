import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PassThrough } from 'stream';
import * as fs from 'fs';

@Controller({
  path: '/user',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-template')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        templatePath: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  createTemplate(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500 * 1024 * 1024 }), // 500MB
        ],
      }),
    )
    file: {
      buffer: Buffer;
    },
    @Body('templatePath') templatePath: string,
  ) {
    return this.userService.createImportTemplate(file.buffer, templatePath);
  }

  @Post('import')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  import(
    @UploadedFile()
    file: {
      buffer: Buffer;
    },
  ) {
    return this.userService.import(file.buffer);
  }

  @Post('create-report-template')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        templatePath: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  createReportTemplate(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500 * 1024 * 1024 }), // 500MB
        ],
      }),
    )
    file: {
      buffer: Buffer;
    },
    @Body('templatePath') templatePath: string,
  ) {
    return this.userService.createReportTemplate(file.buffer, templatePath);
  }

  @ApiResponse({
    description: 'File được tải xuống thành công',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiProduces('application/octet-stream')
  @Get('download-export')
  async downloadExport(
    @Query('templatePath') templatePath: string,
    @Res() res: Response,
  ) {
    const buffer = await this.userService.report(templatePath);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="example.xlsx"',
    });
    res.send(buffer);
  }

  @Get('export')
  async export(
    @Query('templatePath') templatePath: string,
    @Res() res: Response,
  ) {
    const buffer = await this.userService.reportFile(templatePath);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="example.xlsx"',
    });
    res.send(buffer);
  }

  // @ApiResponse({
  //   description: 'File được tải xuống thành công',
  //   content: {
  //     'application/octet-stream': {
  //       schema: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @ApiProduces('application/octet-stream')
  @Get('export-stream')
  exportStream(@Res() res: Response) {
    const stream = new PassThrough();
    // const stream = fs.createWriteStream('excels/user.xlsx');
    this.userService.reportStream(stream);
    // return { msg: 'ok' };
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="example.xlsx"',
    });

    stream.pipe(res);
  }
}

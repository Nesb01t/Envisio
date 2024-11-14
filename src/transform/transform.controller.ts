import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createReadStream, unlink, writeFile } from 'fs';

const execAsync = promisify(exec);
const unlinkAsync = promisify(unlink);

@Controller('transform')
export class TransformController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLitematica(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const inputFilePath = join(__dirname, '..', '..', 'tmp', file.originalname);
    const outputFilePath = join(
      __dirname,
      '..',
      '..',
      'tmp',
      `${file.originalname}`.replace('.litematic', '.schem'),
    );

    await promisify(writeFile)(inputFilePath, file.buffer);

    const jarFilePath = join(
      __dirname,
      '..',
      '..',
      'external',
      'Lite2Edit.jar',
    );
    const command = `java -jar ${jarFilePath} --convert ${inputFilePath}`;
    await execAsync(command);

    console.log('[transform] Executed command');

    const fileStream = createReadStream(outputFilePath);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="converted_${file.originalname}"`,
    });
    fileStream.pipe(res).on('finish', async () => {
      try {
        await unlinkAsync(inputFilePath);
        await unlinkAsync(outputFilePath);
      } catch (error) {
        console.error('Error deleting files:', error);
      }
    });
  }
}

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { getTempFilePath, TransformService } from './transform.service';
import { createReadStream } from 'fs';

@Controller('transform')
export class TransformController {
  constructor(private readonly transformService: TransformService) {}

  @Post('litematic2schem')
  @UseInterceptors(FileInterceptor('file'))
  async litematic2schem(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const outputFile = await this.transformService.litematicToSchem(file);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${outputFile.name}"`,
    });

    const filePath = getTempFilePath(outputFile.name);
    createReadStream(filePath).pipe(res);
    // await this.transformService.cleanupFile(file);
    // await this.transformService.cleanupFile(outputFile);
  }

  @Post('schem2schematic')
  @UseInterceptors(FileInterceptor('file'))
  async schem2schematic(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const outputFile = await this.transformService.schemToSchematic(file);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${outputFile.name}"`,
    });
    const filePath = getTempFilePath(outputFile.name);
    createReadStream(filePath).pipe(res);
    // await this.transformService.cleanupFile(file);
    // await this.transformService.cleanupFile(outputFile);
  }

  @Post('schematic2obj')
  @UseInterceptors(FileInterceptor('file'))
  async schematic2obj(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const outputFile = await this.transformService.schematicToObj(file);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${outputFile.name}"`,
    });
    const filePath = getTempFilePath(outputFile.name);
    createReadStream(filePath).pipe(res);
    // await this.transformService.cleanupFile(file);
    // await this.transformService.cleanupFile(outputFile);
  }
}

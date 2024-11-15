import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { TransformService } from './transform.service';

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
    await res.send(outputFile);
    await this.transformService.cleanupFile(outputFile);
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
    await res.send(outputFile);
    await this.transformService.cleanupFile(outputFile);
  }
}

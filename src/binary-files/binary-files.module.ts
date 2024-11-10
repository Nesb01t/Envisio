import { Module } from '@nestjs/common';
import { BinaryFilesService } from './binary-files.service';
import { BinaryFilesController } from './binary-files.controller';

@Module({
  controllers: [BinaryFilesController],
  providers: [BinaryFilesService],
})
export class BinaryFilesModule {}

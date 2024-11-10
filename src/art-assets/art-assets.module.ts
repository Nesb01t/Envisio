import { Module } from '@nestjs/common';
import { ArtAssetsService } from './art-assets.service';
import { ArtAssetsController } from './art-assets.controller';

@Module({
  controllers: [ArtAssetsController],
  providers: [ArtAssetsService],
})
export class ArtAssetsModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtAssetsModule } from './art-assets/art-assets.module';
import { BinaryFilesModule } from './binary-files/binary-files.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ArtAssetsModule,
    BinaryFilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

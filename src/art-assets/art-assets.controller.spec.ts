import { Test, TestingModule } from '@nestjs/testing';
import { ArtAssetsController } from './art-assets.controller';
import { ArtAssetsService } from './art-assets.service';

describe('ArtAssetsController', () => {
  let controller: ArtAssetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtAssetsController],
      providers: [ArtAssetsService],
    }).compile();

    controller = module.get<ArtAssetsController>(ArtAssetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

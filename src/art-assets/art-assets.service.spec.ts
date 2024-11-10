import { Test, TestingModule } from '@nestjs/testing';
import { ArtAssetsService } from './art-assets.service';

describe('ArtAssetsService', () => {
  let service: ArtAssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtAssetsService],
    }).compile();

    service = module.get<ArtAssetsService>(ArtAssetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

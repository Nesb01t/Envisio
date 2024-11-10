import { Test, TestingModule } from '@nestjs/testing';
import { BinaryFilesService } from './binary-files.service';

describe('BinaryFilesService', () => {
  let service: BinaryFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinaryFilesService],
    }).compile();

    service = module.get<BinaryFilesService>(BinaryFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

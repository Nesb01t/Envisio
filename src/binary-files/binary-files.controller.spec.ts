import { Test, TestingModule } from '@nestjs/testing';
import { BinaryFilesController } from './binary-files.controller';
import { BinaryFilesService } from './binary-files.service';

describe('BinaryFilesController', () => {
  let controller: BinaryFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BinaryFilesController],
      providers: [BinaryFilesService],
    }).compile();

    controller = module.get<BinaryFilesController>(BinaryFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

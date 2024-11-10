import { Injectable, NotFoundException } from '@nestjs/common';
import { BinaryFile } from './entities/binary-file.entity';
import { CreateBinaryFileDto } from './dto/create-binary-file.dto';
import { UpdateBinaryFileDto } from './dto/update-binary-file.dto';

@Injectable()
export class BinaryFilesService {
  private binaryFiles: BinaryFile[] = [];
  private idCounter = 1;

  create(createBinaryFileDto: CreateBinaryFileDto): BinaryFile {
    const newBinaryFile: BinaryFile = {
      id: this.idCounter++,
      data: createBinaryFileDto.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.binaryFiles.push(newBinaryFile);
    return newBinaryFile;
  }

  findAll(): BinaryFile[] {
    return this.binaryFiles;
  }

  findOne(id: number): BinaryFile {
    const binaryFile = this.binaryFiles.find((file) => file.id === id);
    if (!binaryFile) {
      throw new NotFoundException(`BinaryFile with ID ${id} not found`);
    }
    return binaryFile;
  }

  update(id: number, updateBinaryFileDto: UpdateBinaryFileDto): BinaryFile {
    const binaryFile = this.findOne(id);
    Object.assign(binaryFile, updateBinaryFileDto);
    binaryFile.updatedAt = new Date();
    return binaryFile;
  }

  remove(id: number): void {
    const index = this.binaryFiles.findIndex((file) => file.id === id);
    if (index === -1) {
      throw new NotFoundException(`BinaryFile with ID ${id} not found`);
    }
    this.binaryFiles.splice(index, 1);
  }
}

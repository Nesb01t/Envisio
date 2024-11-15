import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BinaryFilesService } from './binary-files.service';
import { CreateBinaryFileDto } from './dto/create-binary-file.dto';
import { UpdateBinaryFileDto } from './dto/update-binary-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('binary-files')
export class BinaryFilesController {
  constructor(private readonly binaryFilesService: BinaryFilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const createBinaryFileDto: CreateBinaryFileDto = {
      originalName: file.originalname,
      data: file.buffer,
      size: file.size,
    };
    return this.binaryFilesService.create(createBinaryFileDto);
  }

  @Get()
  findAll() {
    return this.binaryFilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.binaryFilesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBinaryFileDto: UpdateBinaryFileDto,
  ) {
    return this.binaryFilesService.update(+id, updateBinaryFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.binaryFilesService.remove(+id);
  }
}

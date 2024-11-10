import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BinaryFilesService } from './binary-files.service';
import { CreateBinaryFileDto } from './dto/create-binary-file.dto';
import { UpdateBinaryFileDto } from './dto/update-binary-file.dto';

@Controller('binary-files')
export class BinaryFilesController {
  constructor(private readonly binaryFilesService: BinaryFilesService) {}

  @Post()
  create(@Body() createBinaryFileDto: CreateBinaryFileDto) {
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

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ArtAssetsService } from './art-assets.service';
import { CreateArtAssetDto } from './dto/create-art-asset.dto';
import { UpdateArtAssetDto } from './dto/update-art-asset.dto';

@Controller('art-assets')
export class ArtAssetsController {
  constructor(private readonly artAssetsService: ArtAssetsService) {}

  @Post()
  create(@Body() createArtAssetDto: CreateArtAssetDto) {
    return this.artAssetsService.create(createArtAssetDto);
  }

  @Get()
  findAll() {
    return this.artAssetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artAssetsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArtAssetDto: UpdateArtAssetDto,
  ) {
    return this.artAssetsService.update(+id, updateArtAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artAssetsService.remove(+id);
  }
}

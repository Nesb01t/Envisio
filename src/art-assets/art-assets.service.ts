import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtAssetDto } from './dto/create-art-asset.dto';
import { UpdateArtAssetDto } from './dto/update-art-asset.dto';
import { ArtAsset } from './entities/art-asset.entity';

@Injectable()
export class ArtAssetsService {
  private artAssets: ArtAsset[] = [];
  private idCounter = 1;

  create(createArtAssetDto: CreateArtAssetDto): ArtAsset {
    const newArtAsset: ArtAsset = {
      id: this.idCounter++,
      ...createArtAssetDto,
      historyId: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.artAssets.push(newArtAsset);
    return newArtAsset;
  }

  findAll(): ArtAsset[] {
    return this.artAssets;
  }

  findOne(id: number): ArtAsset {
    const artAsset = this.artAssets.find((asset) => asset.id === id);
    if (!artAsset) {
      throw new NotFoundException(`ArtAsset with ID ${id} not found`);
    }
    return artAsset;
  }

  update(id: number, updateArtAssetDto: UpdateArtAssetDto): ArtAsset {
    const artAsset = this.findOne(id);

    if (updateArtAssetDto.binaryFileId) {
      artAsset.historyId.push(artAsset.binaryFileId);
    }
    Object.assign(artAsset, updateArtAssetDto);
    artAsset.updatedAt = new Date();
    return artAsset;
  }

  remove(id: number): void {
    const index = this.artAssets.findIndex((asset) => asset.id === id);
    if (index === -1) {
      throw new NotFoundException(`ArtAsset with ID ${id} not found`);
    }
    this.artAssets.splice(index, 1);
  }
}

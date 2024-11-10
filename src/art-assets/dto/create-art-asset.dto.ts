import { ArtAssetType } from '../entities/art-asset.entity';

export class CreateArtAssetDto {
  name: string;
  type: ArtAssetType;
  binaryFileId: number;
}

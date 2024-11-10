import { PartialType } from '@nestjs/mapped-types';
import { CreateArtAssetDto } from './create-art-asset.dto';

export class UpdateArtAssetDto extends PartialType(CreateArtAssetDto) {}

export class ArtAsset {
  id: number;
  name: string;
  type: ArtAssetType;
  createdAt: Date;
  updatedAt: Date;

  binaryFileId: number;
}

export enum ArtAssetType {
  DEFAULT = 'default',
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateBinaryFileDto } from './create-binary-file.dto';

export class UpdateBinaryFileDto extends PartialType(CreateBinaryFileDto) {}

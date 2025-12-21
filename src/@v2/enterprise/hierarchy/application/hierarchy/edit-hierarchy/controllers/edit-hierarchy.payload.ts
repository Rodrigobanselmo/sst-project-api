import { IsNotNull } from '@/@v2/shared/decorators/validators/is-not-null.decorator';
import { IsObject, IsOptional, IsString, ValidatorConstraint, ValidatorConstraintInterface, Validate } from 'class-validator';

const MAX_METADATA_SIZE_BYTES = 20 * 1024; // 20KB

@ValidatorConstraint({ name: 'metadataMaxSize', async: false })
class MetadataMaxSizeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    const jsonString = JSON.stringify(value);
    return Buffer.byteLength(jsonString, 'utf8') <= MAX_METADATA_SIZE_BYTES;
  }

  defaultMessage(): string {
    return 'Metadata must not exceed 20KB';
  }
}

export class EditHierarchyPayload {
  @IsString()
  @IsNotNull()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsString()
  @IsOptional()
  realDescription?: string | null;

  @IsObject()
  @IsOptional()
  @Validate(MetadataMaxSizeConstraint)
  metadata?: Record<string, unknown> | null;
}

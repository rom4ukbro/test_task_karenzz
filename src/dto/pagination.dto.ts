import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @IsNumber()
  page = 20;

  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @IsNumber()
  limit = 20;

  @IsOptional()
  @Type(() => String)
  @IsString()
  sort = '-createdAt';
}

import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class TransactionDto {
  @IsNotEmpty({ message: 'User is required' })
  @Type(() => Number)
  @IsNumber()
  user: number;

  @IsNotEmpty({ message: 'Amount is required' })
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userTo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userFrom?: number;

  @IsOptional()
  @IsString()
  product?: string;

  @IsOptional()
  @IsString()
  bill?: string;
}

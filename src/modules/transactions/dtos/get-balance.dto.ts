import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';
import { IsUserExists } from '../../users/validators/is.user.exists.validator';

export class GetBalanceDto {
  @IsNotEmpty({ message: 'User is required' })
  @Type(() => Number)
  @IsNumber()
  @IsUserExists()
  user: number;

  @IsOptional()
  @Length(3, 3, {
    message:
      'Currency must be specified in ISO 4217 format (for example, USD )',
  })
  currency?: string;
}

export class GetBalanceReturnDto {
  balance: number;
  currency: string;
}

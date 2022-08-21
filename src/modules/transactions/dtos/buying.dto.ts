import { Type } from 'class-transformer';
import { IsNegative, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsUserExists } from '../../users/validators/is.user.exists.validator';

export class BuyingDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'User is required' })
  @IsUserExists()
  user: number;

  @Type(() => Number)
  @IsNumber()
  @IsNegative({ message: 'Amount must be less than 0' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @IsString()
  @IsNotEmpty({
    message: 'Product is required',
  })
  product: string;
}

import { Type } from 'class-transformer';
import { IsNegative, IsNotEmpty, IsNumber } from 'class-validator';
import { IsUserExists } from '../../users/validators/is.user.exists.validator';

export class P2PDto {
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

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({
    message: 'User to whom the transaction is assigned is required',
  })
  @IsUserExists({ message: 'No transaction recipient found' })
  userTo: number;
}

import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { IsUserExists } from '../../users/validators/is.user.exists.validator';

export class ReplenishmentDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'User is required' })
  @IsUserExists()
  user: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: 'Amount must be greater than 0' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @IsString()
  @IsNotEmpty({
    message: 'Bill is required',
  })
  bill: string;
}

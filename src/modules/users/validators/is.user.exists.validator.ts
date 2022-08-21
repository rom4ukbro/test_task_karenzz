import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: 'IsUserExists', async: false })
export class IsUserExistsConstraint implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(id: number) {
    return (await this.usersService.findById(id)) != null;
  }

  defaultMessage() {
    return 'User not found';
  }
}

export function IsUserExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUserExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUserExistsConstraint,
    });
  };
}

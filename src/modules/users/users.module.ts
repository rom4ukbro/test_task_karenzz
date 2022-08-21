import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.scheme';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { IsUserExistsConstraint } from './validators/is.user.exists.validator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, IsUserExistsConstraint],
  exports: [UsersService, IsUserExistsConstraint],
  controllers: [UsersController],
})
export class UsersModule {}

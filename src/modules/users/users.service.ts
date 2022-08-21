import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.scheme';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocument>,
  ) {}

  async createTestUsers(): Promise<User[]> {
    const user1 = new this.usersModel({ _id: 1 });
    const user2 = new this.usersModel({ _id: 2 });
    await user1.save();
    await user2.save();
    return [user1.toJSON(), user2.toJSON()];
  }

  async findById(id: number): Promise<User> {
    return await this.usersModel.findById(id);
  }
}

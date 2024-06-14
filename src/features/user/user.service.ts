import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { User } from './user.schema';
import { Avatar } from './avatar.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Avatar.name) private avatarModel: Model<Avatar>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async createUser(createUserDto: any): Promise<User> {
    // Check if a user with the provided email already exists
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();
    // emit rabbitmq event and email
    const notification = {
      email: 'example@email.com',
      message: `${createdUser.email} signed`,
    };
    await this.rabbitMQService.sendNotification(notification);
    return createdUser;
  }

  async getUserFromApi(userId: string): Promise<any> {
    const response = await axios.get(`https://reqres.in/api/users/${userId}`);
    return response.data;
  }

  async getUserAvatar(userId: string): Promise<string> {
    const avatarPath = path.join(process.cwd(), 'avatars', `${userId}.jpg`);

    if (!fs.existsSync(avatarPath)) {
      try {
        const { data } = await axios.get(
          `https://reqres.in/api/users/${userId}`,
        );
        const avatar_uri = data.data.avatar;
        const response = await axios.get(avatar_uri, {
          responseType: 'arraybuffer',
        });
        const avatarBuffer = Buffer.from(response.data, 'binary');
        fs.writeFileSync(avatarPath, avatarBuffer);
        const avatarHash = crypto
          .createHash('md5')
          .update(avatarBuffer)
          .digest('hex');
        // Save the avatar hash and userId to DB if needed
        const newAvatar = {
          user_id: userId,
          avatar_hash: avatarHash,
        };
        const createdAvatar = new this.avatarModel(newAvatar);
        await createdAvatar.save();
      } catch (error) {
        throw new InternalServerErrorException('Failed to fetch avatar');
      }
    }

    const avatar = fs.readFileSync(avatarPath);
    return avatar.toString('base64');
  }

  async deleteUserAvatar(userId: string): Promise<string> {
    const avatarPath = path.join(process.cwd(), 'avatars', `${userId}.jpg`);
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }
    // Remove the avatar entry from DB
    const avatar = await this.avatarModel
      .findOneAndDelete({ user_id: userId })
      .exec();
    if (!avatar) {
      throw new NotFoundException('User not found');
    }

    return 'Deleted successfully!';
  }
}

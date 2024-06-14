import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { NotificationConsumer } from '../notification/notification.consumer';
import { MailModule } from '../mail/mail.module';
import { UserSchema, User } from './user.schema';
import { AvatarSchema, Avatar } from './avatar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Avatar.name, schema: AvatarSchema },
    ]),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService, RabbitMQService, NotificationConsumer],
})
export class UserModule {}

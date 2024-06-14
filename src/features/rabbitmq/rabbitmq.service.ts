import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { NotificationDto } from '../notification/notification.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'notification',
      },
    });
  }

  async sendNotification(notification: NotificationDto) {
    return await firstValueFrom(
      this.client.emit('notification_queue', notification),
    );
  }
}

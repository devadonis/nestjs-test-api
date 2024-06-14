import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { NotificationDto } from './notification.dto';

@Injectable()
@Processor('notification_queue')
export class NotificationConsumer {
  constructor(private readonly mailService: MailService) {}

  @Process()
  async processNotification(job: Job<NotificationDto>) {
    console.log(job);
    const notification = job.data;
    if (!notification) {
      console.error('Notification is undefined');
      return;
    }
    await this.mailService.sendMail(notification);
    return notification;
  }
}

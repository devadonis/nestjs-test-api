import { Module, Inject } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { databaseConfig, ttlConfig } from './config';
import { UserModule } from './features/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      load: [databaseConfig, ttlConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('ttl'),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    @Inject(databaseConfig.KEY)
    private dbConf: ConfigType<typeof databaseConfig>,
    @Inject(ttlConfig.KEY)
    private ttlConf: ConfigType<typeof ttlConfig>,
  ) {
    console.log(this.dbConf, '===========');
  }
}

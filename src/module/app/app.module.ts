import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TriggerModule } from '../trigger/trigger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TriggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

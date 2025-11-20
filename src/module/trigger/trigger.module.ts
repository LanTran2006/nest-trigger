import { Module } from '@nestjs/common';
import { TriggerService } from './trigger.service';
import { SesModule } from '../ses/ses.module';

@Module({
  imports: [SesModule],
  providers: [TriggerService],
  exports: [TriggerService],
})
export class TriggerModule {}

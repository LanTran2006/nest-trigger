import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import SchedulerService from './scheduler.service';
import { TriggerModule } from '../trigger/trigger.module';

@Module({
  imports: [ScheduleModule.forRoot(), TriggerModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class JobModule {}
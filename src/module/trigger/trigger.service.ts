import { Injectable, OnModuleInit } from '@nestjs/common';
import { tasks, runs, schedules } from '@trigger.dev/sdk/v3';

@Injectable()
export class TriggerService implements OnModuleInit {
  async onModuleInit() {
    // Register the daily promotion email schedule
    try {
      await schedules.create({
        task: 'daily-promotion-email',
        cron: '0 8 * * *', // Every day at 8:00 AM
        deduplicationKey: 'daily-promotion-8am',
        timezone: 'Asia/Ho_Chi_Minh',
      });
      console.log('Daily promotion email schedule registered successfully');
    } catch (error) {
      console.error('Error registering promotion email schedule:', error);
    }
  }
  async sendEmail(payload: {
    to: string;
    subject: string;
    body: string;
    isHtml?: boolean;
  }): Promise<{ id: string }> {
    const handle = await tasks.trigger('send-email', payload);
    return { id: handle.id };
  }

  async summarizeContent(payload: { content: string }): Promise<{ id: string }> {
    const handle = await tasks.trigger('summarize-content', payload);
    return { id: handle.id };
  }

  async summarizeAndEmail(payload: {
    description: string;
    to: string;
    subject?: string;
    from?: string;
  }): Promise<{ id: string }> {
    const handle = await tasks.trigger('summarize-and-email', payload);
    return { id: handle.id };
  }

  async getTaskStatus(runId: string) {
    const run = await runs.retrieve(runId);
    return run;
  }

  async triggerDailyPromotionEmail(payload?: Record<string, any>): Promise<{ id: string }> {
    const handle = await tasks.trigger('daily-promotion-email', payload || {});
    return { id: handle.id };
  }
}

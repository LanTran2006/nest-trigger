import { Injectable } from '@nestjs/common';
import { tasks, runs } from '@trigger.dev/sdk/v3';

@Injectable()
export class TriggerService {
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
}

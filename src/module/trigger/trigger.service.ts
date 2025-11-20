import { Injectable } from '@nestjs/common';
import { tasks, runs } from '@trigger.dev/sdk/v3';

@Injectable()
export class TriggerService {
  async summarizeAndEmail(payload: {
    description: string;
    to: string;
    subject?: string;
    from?: string;
  }): Promise<{ id: string }> {
    const handle = await tasks.trigger('summarize-and-email', payload);
    return { id: handle.id };
  }
}

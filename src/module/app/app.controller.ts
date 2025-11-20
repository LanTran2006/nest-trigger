import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TriggerService } from '../trigger/trigger.service';

@Controller('/')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly triggerService: TriggerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('summary')
  async summarizeAndEmail(
    @Body()
    body: {
      description: string;
      to: string;
      subject?: string;
    },
  ) {
    const result = await this.triggerService.summarizeAndEmail(body);
    return {
      message: 'Summarization and email task triggered successfully',
    };
  }
}

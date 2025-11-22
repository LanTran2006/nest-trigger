import { task, tasks, logger, runs } from '@trigger.dev/sdk/v3';
import { SummarizeEmailTemplate } from '../../../templates/index.js';

export const summarizeAndEmailTask = task({
  id: 'summarize-and-email',
  run: async (payload: {
    description: string;
    to: string;
    subject?: string;
  }) => {
    logger.info('Starting summarize and email job...');

    // Job Step 1: Trigger and wait for summarize task
    logger.info('Step 1: Triggering summarize content task...');
    const summaryHandle = await tasks.trigger('summarize-content', {
      content: payload.description,
    });

    const summaryRun = await runs.poll(summaryHandle.id);
    const summary = summaryRun.output as string;
    
    logger.info('Content summarized successfully', {
      summaryLength: summary?.length,
    });

    // Job Step 2: Trigger and wait for send email task
    logger.info('Step 2: Triggering send email task...');
    const emailSubject = payload.subject || 'Content Summary';
    
    // Use email template
    const emailBody = SummarizeEmailTemplate.generate(summary, payload.description);

    const emailHandle = await tasks.trigger('send-email', {
      to: payload.to,
      subject: emailSubject,
      body: emailBody,
      isHtml: true,
    });

    await runs.poll(emailHandle.id);

    logger.info('Email sent successfully');

    return {
      success: true,
      summary,
      emailSentTo: payload.to,
    };
  },
});

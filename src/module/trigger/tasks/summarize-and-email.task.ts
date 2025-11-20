import { task, tasks, logger, runs } from '@trigger.dev/sdk/v3';

function createEmailTemplate(summary: string, originalContent: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Summary</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .header {
            border-bottom: 3px solid #4CAF50;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        h1 {
            color: #4CAF50;
            margin: 0;
            font-size: 28px;
        }
        h2 {
            color: #2c3e50;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .summary-section {
            background-color: #e8f5e9;
            border-left: 4px solid #4CAF50;
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 4px;
        }
        .summary-content {
            font-size: 16px;
            line-height: 1.8;
            color: #2c3e50;
        }
        .divider {
            height: 2px;
            background: linear-gradient(to right, #4CAF50, transparent);
            margin: 30px 0;
        }
        .original-section {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }
        .original-content {
            font-size: 14px;
            line-height: 1.8;
            color: #555;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 Content Summary</h1>
        </div>
        
        <div class="summary-section">
            <h2>Summary</h2>
            <div class="summary-content">
                ${summary}
            </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="original-section">
            <h2>Original Content</h2>
            <div class="original-content">
                ${originalContent}
            </div>
        </div>
        
        <div class="footer">
            <p>This email was generated automatically by the Content Summarization Service</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

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
    const emailBody = createEmailTemplate(summary, payload.description);

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

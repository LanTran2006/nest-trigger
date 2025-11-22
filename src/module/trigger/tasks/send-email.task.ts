import { task } from '@trigger.dev/sdk/v3';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

interface payLoadType {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

export const sendEmailTask = task({
  id: 'send-email',
  run: async (payload: payLoadType) => {
    console.log('Starting email send task...', payload);
    
    const sesClient = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    try {
      const toAddresses = Array.isArray(payload.to) ? payload.to : [payload.to];

      const emailParams = {
        Source: process.env.AWS_SES_FROM_EMAIL!,
        Destination: {
          ToAddresses: toAddresses,
        },
        Message: {
          Subject: {
            Data: payload.subject,
            Charset: 'UTF-8',
          },
          Body: payload.isHtml
            ? {
                Html: {
                  Data: payload.body,
                  Charset: 'UTF-8',
                },
              }
            : {
                Text: {
                  Data: payload.body,
                  Charset: 'UTF-8',
                },
              },
        },
      };

      const command = new SendEmailCommand(emailParams);
      const response = await sesClient.send(command);

      console.log('Email sent successfully');
      return {
        success: true,
        to: payload.to,
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },
});

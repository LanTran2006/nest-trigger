import { Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type {
  SendEmailCommandInput,
  SendEmailCommandOutput,
} from '@aws-sdk/client-ses';

@Injectable()
export class SesService {
  private readonly sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async sendEmail(params: {
    to: string | string[];
    subject: string;
    body: string;
    from?: string;
    isHtml?: boolean;
  }): Promise<SendEmailCommandOutput> {
    const toAddresses = Array.isArray(params.to) ? params.to : [params.to];

    const emailParams: SendEmailCommandInput = {
      Source: params.from || process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: params.subject,
          Charset: 'UTF-8',
        },
        Body: params.isHtml
          ? {
              Html: {
                Data: params.body,
                Charset: 'UTF-8',
              },
            }
          : {
              Text: {
                Data: params.body,
                Charset: 'UTF-8',
              },
            },
      },
    };

    const command = new SendEmailCommand(emailParams);
    return await this.sesClient.send(command);
  }

  async sendHtmlEmail(params: {
    to: string | string[];
    subject: string;
    htmlBody: string;
    textBody?: string;
    from?: string;
  }): Promise<SendEmailCommandOutput> {
    const toAddresses = Array.isArray(params.to) ? params.to : [params.to];

    const emailParams: SendEmailCommandInput = {
      Source: params.from || process.env.AWS_SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: params.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: params.htmlBody,
            Charset: 'UTF-8',
          },
          ...(params.textBody && {
            Text: {
              Data: params.textBody,
              Charset: 'UTF-8',
            },
          }),
        },
      },
    };

    const command = new SendEmailCommand(emailParams);
    return await this.sesClient.send(command);
  }
}

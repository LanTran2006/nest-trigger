import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../db/prisma.service';
import { TriggerService } from '../trigger/trigger.service';
import { PromotionEmailTemplate } from 'src/templates';
import { formatDateLong } from 'src/utils';

@Injectable()
export default class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly triggerService: TriggerService,
  ) {}
 
  @Cron('00 8 * * *', {
    name: 'daily-922am-job',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleDailyJob() {
    this.logger.log('Running daily job at 9:22 AM');

    try {
      const now = new Date();

      // Get all active promotions that are currently valid
      const activePromotions = await this.prisma.promotion.findMany({
        where: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gt: now },
        },
      });

      this.logger.log(
        `Found ${activePromotions.length} `,
      );

     
      await Promise.all(
        activePromotions.map((promotion) =>
          this.processPromotion(promotion, now),
        ),
      );

      this.logger.log('Daily job completed successfully');
    } catch (error) {
      this.logger.error('Error running daily job:', error);
    }
  }

  private async processPromotion(promotion: any, now: Date) {
    try {
      this.logger.log(`Processing promotion: ${promotion.title}`);

      // Find eligible users
      const eligibleUsers = await this.prisma.user.findMany({
        where: {
          isActive: true,
          totalSpent: { gte: promotion.minSpent },
        },
        include: {
          promotions: {
            where: {
              promotionId: promotion.id,
            },
          },
        },
      });

      this.logger.log(
        `Found ${eligibleUsers.length} potentially eligible users for promotion: ${promotion.title}`,
      );

      // Filter users who haven't received this promotion yet
      const usersToEmail = eligibleUsers.filter(
        (user) => user.promotions.length === 0,
      );

      this.logger.log(
        `Sending promotion to ${usersToEmail.length} users after filtering`,
      );

      // Send emails in parallel
      await Promise.all(
        usersToEmail.map((user) => this.sendPromotionEmail(user, promotion)),
      );
    } catch (error) {
      this.logger.error(
        `Error processing promotion ${promotion.title}:`,
        error,
      );
    }
  }

  private async sendPromotionEmail(user: any, promotion: any) {
    try {
      const emailSubject = `🎁: ${promotion.title}`;
      const emailBody = PromotionEmailTemplate.generate({
        userName: user.name,
        promotionTitle: promotion.title,
        promotionDescription:
          promotion.description || 'Special offer just for you!',
        endDate: formatDateLong(promotion.endDate),
        totalSpent: user.totalSpent,
      });

      // Trigger email task
      await this.triggerService.sendEmail({
        to: user.email,
        subject: emailSubject,
        body: emailBody,
        isHtml: true,
      });

      // Record that user received this promotion
      await this.prisma.userPromotion.upsert({
        where: {
          userId_promotionId: {
            userId: user.id,
            promotionId: promotion.id,
          },
        },
        create: {
          userId: user.id,
          promotionId: promotion.id,
        },
        update: {
          assignedAt: new Date(),
        },
      });

      this.logger.log(
        `Successfully triggered email task for promotion "${promotion.title}" to ${user.email}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to trigger email for ${user.email} for promotion ${promotion.title}:`,
        error,
      );
    }
  }
}

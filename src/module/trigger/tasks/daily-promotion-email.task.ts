import { task, tasks } from '@trigger.dev/sdk/v3';
import { PrismaClient } from '@prisma/client';
import { PromotionEmailTemplate } from '../../../templates';
import { formatDateLong } from '../../../utils';

const prisma = new PrismaClient();

export const dailyPromotionEmailTask = task({
  id: 'daily-promotion-email',
  run: async (payload: Record<string, any>, { ctx }) => {
    console.log('Running daily promotion email task at 8:00 AM');

    try {
      const now = new Date();

      // Get all active promotions that are currently valid
      const activePromotions = await prisma.promotion.findMany({
        where: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gt: now },
        },
      });

      console.log(`Found ${activePromotions.length} active promotions`);

      // Process each promotion
      const results = await Promise.all(
        activePromotions.map((promotion) =>
          processPromotion(promotion, now),
        ),
      );

      const totalEmailsSent = results.reduce((sum, r) => sum + r.emailsSent, 0);

      console.log('Daily promotion email task completed');
      return {
        success: true,
        timestamp: new Date().toISOString(),
        message: 'Promotion emails processed successfully',
        promotionsProcessed: activePromotions.length,
        totalEmailsSent,
      };
    } catch (error) {
      console.error('Error in daily promotion email task:', error);
      throw error;
    }
  },
});

async function processPromotion(promotion: any, now: Date) {
  try {
    console.log(`Processing promotion: ${promotion.title}`);

    // Find eligible users
    const eligibleUsers = await prisma.user.findMany({
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

    console.log(
      `Found ${eligibleUsers.length} potentially eligible users for promotion: ${promotion.title}`,
    );

    // Filter users who haven't received this promotion yet
    const usersToEmail = eligibleUsers.filter(
      (user) => user.promotions.length === 0,
    );

    console.log(
      `Sending promotion to ${usersToEmail.length} users after filtering`,
    );

    // Send emails in parallel
    await Promise.all(
      usersToEmail.map((user) => sendPromotionEmail(user, promotion)),
    );

    return {
      promotionId: promotion.id,
      promotionTitle: promotion.title,
      emailsSent: usersToEmail.length,
    };
  } catch (error) {
    console.error(`Error processing promotion ${promotion.title}:`, error);
    return {
      promotionId: promotion.id,
      promotionTitle: promotion.title,
      emailsSent: 0,
      error: error.message,
    };
  }
}

async function sendPromotionEmail(user: any, promotion: any) {
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

    // Trigger the send-email task
    await tasks.trigger('send-email', {
      to: user.email,
      subject: emailSubject,
      body: emailBody,
      isHtml: true,
    });

    // Record that user received this promotion
    await prisma.userPromotion.upsert({
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

    console.log(
      `Successfully triggered email task for promotion "${promotion.title}" to ${user.email}`,
    );
  } catch (error) {
    console.error(
      `Failed to trigger email for ${user.email} for promotion ${promotion.title}:`,
      error,
    );
  }
}

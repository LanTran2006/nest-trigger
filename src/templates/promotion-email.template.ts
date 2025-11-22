export interface PromotionEmailParams {
  userName: string;
  promotionTitle: string;
  promotionDescription: string;
  endDate: string;
  totalSpent: number;
}

export class PromotionEmailTemplate {
  static generate(params: PromotionEmailParams): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Special Promotion</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .email-wrapper {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .header {
            background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        .header .emoji {
            font-size: 48px;
            margin-bottom: 10px;
            display: block;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .promotion-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            padding: 30px;
            margin: 30px 0;
            color: white;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .promotion-title {
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 15px 0;
            text-align: center;
        }
        .promotion-description {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 20px;
            text-align: center;
        }
        .promo-badge {
            background-color: rgba(255,255,255,0.2);
            border: 2px solid white;
            border-radius: 50px;
            padding: 10px 25px;
            display: inline-block;
            font-weight: 600;
            font-size: 14px;
            margin-top: 10px;
        }
        .validity-section {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .validity-section strong {
            color: #856404;
        }
        .customer-info {
            background-color: #e8f5e9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #4CAF50;
        }
        .customer-info p {
            margin: 5px 0;
            color: #2c3e50;
        }
        .cta-button {
            display: block;
            width: 100%;
            max-width: 300px;
            margin: 30px auto;
            padding: 18px 40px;
            background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 18px;
            box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #6c757d;
            font-size: 13px;
            border-top: 1px solid #dee2e6;
        }
        .footer p {
            margin: 5px 0;
        }
        .social-links {
            margin: 15px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="header">
            <span class="emoji">🎁</span>
            <h1>Exclusive Offer Just For You!</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello ${params.userName}! 👋
            </div>
            
            <p style="font-size: 16px; color: #555;">
                We noticed you've been an amazing customer, and we wanted to reward you with something special!
            </p>
            
            <div class="promotion-box">
                <div class="promotion-title">
                    ${params.promotionTitle}
                </div>
                <div class="promotion-description">
                    ${params.promotionDescription}
                </div>
                <div style="text-align: center;">
                    <span class="promo-badge">✨ VIP EXCLUSIVE ✨</span>
                </div>
            </div>
            
            <div class="validity-section">
                <strong>⏰ Limited Time Offer!</strong><br>
                This promotion is valid until <strong>${params.endDate}</strong>
            </div>
            
            <div class="customer-info">
                <p><strong>📊 Your Customer Profile:</strong></p>
                <p>💰 Total Spending: <strong>$${params.totalSpent.toFixed(2)}</strong></p>
                <p>🌟 Status: <strong>Valued Customer</strong></p>
            </div>
            
            <a href="#" class="cta-button">
                🛍️ Shop Now & Save
            </a>
            
            <p style="text-align: center; color: #777; font-size: 14px; margin-top: 30px;">
                This offer was handpicked based on your shopping history and preferences.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Thank you for choosing us!</strong></p>
            <p>You received this email because you're a valued customer.</p>
            <div class="social-links">
                <a href="#">Facebook</a> | 
                <a href="#">Instagram</a> | 
                <a href="#">Twitter</a>
            </div>
            <p style="margin-top: 15px;">
                © 2025 Your Company. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }
}

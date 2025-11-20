# Content Summarizer with Email Notification

A NestJS application that uses **Google Gemini AI** to summarize long text content and automatically sends the summary via email using **AWS SES** and **Trigger.dev**.

## Features

- 📝 **AI-Powered Summarization** - Uses Google Gemini 2.5 Flash API to summarize long content
- 📧 **Email Delivery** - Sends formatted HTML emails via AWS SES
- ⚡ **Background Jobs** - Powered by Trigger.dev for reliable task execution
- 🎨 **Beautiful Email Templates** - Professional HTML email design with summary and original content

## Tech Stack

- **NestJS** - Backend framework
- **Trigger.dev** - Background job processing
- **Google Gemini AI** - Text summarization
- **AWS SES** - Email delivery service

## Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# App
PORT=5000

# Trigger.dev
TRIGGER_SECRET_KEY=your_trigger_secret_key
TRIGGER_API_URL=https://api.trigger.dev

# AWS SES Configuration
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_SES_FROM_EMAIL=your-email@example.com

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Get API Keys

- **Trigger.dev**: Sign up at [cloud.trigger.dev](https://cloud.trigger.dev)
- **Gemini API**: Get free key at [Google AI Studio](https://aistudio.google.com/app/apikey)
- **AWS SES**: Set up in [AWS Console](https://console.aws.amazon.com/ses)

## Running the Application

You need to run **2 terminals**:

**Terminal 1** - Start Trigger.dev dev server:
```bash
pnpm dlx trigger.dev@latest dev
```

**Terminal 2** - Start NestJS app:
```bash
pnpm start:dev
```

## API Usage

### Summarize and Email Endpoint

```bash
POST http://localhost:5000/summary
Content-Type: application/json

{
  "description": "Your long text content here that needs to be summarized...",
  "to": "recipient@example.com",
  "subject": "Content Summary Report"
}
```

**Response:**
```json
{
  "message": "Summarization and email task triggered successfully"
}
```

## How It Works

1. **User sends POST request** with long text content and recipient email
2. **Summarization Task** - Google Gemini AI generates a concise summary
3. **Email Task** - AWS SES sends a formatted HTML email with:
   - Summary section (highlighted)
   - Original content section
   - Professional styling
4. **User receives email** with the summarized content

## Project Structure

```
src/
├── module/
│   ├── app/              # Main application module
│   ├── ses/              # AWS SES email service
│   └── trigger/          # Trigger.dev tasks
│       └── tasks/
│           ├── send-email.task.ts
│           ├── summarize-content.task.ts
│           └── summarize-and-email.task.ts
└── templates/            # Email HTML templates
```

## License

MIT

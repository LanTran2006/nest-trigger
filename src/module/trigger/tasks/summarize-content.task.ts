import { task } from '@trigger.dev/sdk/v3';
import { GoogleGenAI } from '@google/genai';

export const summarizeContentTask = task({
  id: 'summarize-content',
  run: async (payload: { content: string }) => {
    console.log('Starting content summarization task...');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
      const prompt = `Please summarize the following content:\n\n${payload.content}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const summary = response.text;

      console.log('Content summarized successfully');
      return summary;
    } catch (error) {
      console.error('Error summarizing content:', error);
      throw error;
    }
  },
});

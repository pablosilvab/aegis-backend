export interface LLMConfig {
    provider: 'groq' | 'openai' | 'anthropic';
    apiKey: string;
    model: string;
    maxTokens?: number;
    temperature?: number;
    timeout?: number;
  }
  
  export const getLLMConfig = (): LLMConfig => ({
    provider: (process.env.LLM_PROVIDER as 'groq') || 'groq',
    apiKey: process.env.LLM_API_KEY || '',
    model: process.env.LLM_MODEL || 'llama-3.1-70b-versatile',
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '1000'),
    temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.3'),
    timeout: parseInt(process.env.LLM_TIMEOUT || '30000'),
  });
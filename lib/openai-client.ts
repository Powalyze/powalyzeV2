// ============================================
// OpenAI Client Configuration
// ============================================

import OpenAI from 'openai';

// Support Azure OpenAI or standard OpenAI
const isAzure = !!process.env.AZURE_OPENAI_API_KEY;
const hasApiKey = !!(process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY);

export const openaiClient = hasApiKey ? (isAzure
  ? new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
      defaultQuery: { 'api-version': '2024-02-01' },
      defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY }
    })
  : new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })) : null;

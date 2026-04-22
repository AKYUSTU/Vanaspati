import client from './client';

export const sendChatMessage = async (message, history = []) => {
  const { data } = await client.post('/api/ai/chat', { message, history });
  return data;
};

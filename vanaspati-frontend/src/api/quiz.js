import client from './client';

const API_BASE = '/api/quiz';

export const fetchQuizQuestions = async () => {
  const { data } = await client.get(`${API_BASE}/dosha/questions`);
  return data;
};

export const submitQuizResult = async (score, total, nickname) => {
  const { data } = await client.post(`${API_BASE}/dosha/result`, {
    score,
    total,
    nickname,
  });
  return data;
};

export const fetchLeaderboard = async (limit = 10) => {
  const { data } = await client.get(`${API_BASE}/plant/leaderboard`, {
    params: { limit },
  });
  return data;
};

export const fetchUserScores = async () => {
  const { data } = await client.get(`${API_BASE}/plant/scores`);
  return data;
};

// Admin endpoints
export const createQuestion = async (question) => {
  const { data } = await client.post(`${API_BASE}/admin/questions`, question);
  return data;
};

export const updateQuestion = async (id, question) => {
  const { data } = await client.put(`${API_BASE}/admin/questions/${id}`, question);
  return data;
};

export const deleteQuestion = async (id) => {
  await client.delete(`${API_BASE}/admin/questions/${id}`);
};

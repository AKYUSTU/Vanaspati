import client from './client';

export async function fetchMe() {
  const { data } = await client.get('/api/users/me');
  return data;
}

export async function fetchBookmarks() {
  const { data } = await client.get('/api/bookmarks');
  return data;
}

export async function fetchViewHistory() {
  const { data } = await client.get('/api/users/me/history');
  return data;
}

export async function fetchPointsHistory() {
  const { data } = await client.get('/api/users/me/points-history');
  return data;
}

export async function clearViewHistory() {
  const { data } = await client.delete('/api/users/me/history');
  return data;
}
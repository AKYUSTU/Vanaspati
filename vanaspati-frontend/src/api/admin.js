import client from './client';

export async function fetchAdminStats() {
  const { data } = await client.get('/api/admin/stats');
  return data;
}

export async function fetchAdminUsers() {
  const { data } = await client.get('/api/admin/users');
  return data;
}

export async function changeUserRole({ userId, role }) {
  const { data } = await client.put(`/api/admin/users/${userId}/role`, null, {
    params: { role },
  });
  return data;
}

export async function bulkImportPlants(payload) {
  const { data } = await client.post('/api/admin/plants/bulk-import', payload);
  return data;
}

export async function createPlant(payload) {
  const { data } = await client.post('/api/plants', payload);
  return data;
}

export async function updatePlant({ id, payload }) {
  const { data } = await client.put(`/api/plants/${id}`, payload);
  return data;
}

export async function deletePlant(id) {
  const { data } = await client.delete(`/api/plants/${id}`);
  return data;
}
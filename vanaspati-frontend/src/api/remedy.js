import client from './client';
import { FALLBACK_REMEDIES } from '../utils/remedyFallbacks';

const API_BASE = '/api/remedies';

export const fetchAllRemedies = async () => {
  const { data } = await client.get(API_BASE);
  return data;
};

export const fetchRemediesPaged = async (page = 0, size = 12, sortBy = 'newest') => {
  const { data } = await client.get(`${API_BASE}/paged`, {
    params: { page, size, sortBy },
  });
  return data;
};

export const searchRemedies = async (query, page = 0, size = 12) => {
  const { data } = await client.get(`${API_BASE}/search`, {
    params: { query, page, size },
  });
  return data;
};

export const fetchRemedyById = async (id) => {
  try {
    const { data } = await client.get(`${API_BASE}/${id}`);
    return data;
  } catch (error) {
    if (String(id).startsWith('fr')) {
      const baseRemedy = FALLBACK_REMEDIES.find((r) => r.id === id) || FALLBACK_REMEDIES[0];
      return {
        ...baseRemedy,
        ingredients: [
          { id: 1, ingredientName: 'Main Herb (e.g., Tulsi/Ginger)', quantity: '1 tbsp', notes: 'Freshly washed' },
          { id: 2, ingredientName: 'Hot Water', quantity: '2 cups', notes: 'Boiled to 100°C' },
          { id: 3, ingredientName: 'Honey', quantity: '1 tsp', notes: 'Optional, for taste' }
        ],
        steps: [
          { id: 1, stepNumber: 1, instruction: 'Gather and clean all raw materials.' },
          { id: 2, stepNumber: 2, instruction: 'Steep the herbs in hot water for 5-10 minutes.' },
          { id: 3, stepNumber: 3, instruction: 'Strain the mixture into a clean vessel.' },
          { id: 4, stepNumber: 4, instruction: 'Consume while warm.' }
        ],
        precautions: 'Do not consume on an empty stomach if you have high acidity. Consult an Ayurvedic practitioner before daily use.'
      };
    }
    throw error;
  }
};

export const createRemedy = async (remedy) => {
  const { data } = await client.post(API_BASE, remedy);
  return data;
};

export const updateRemedy = async (id, remedy) => {
  const { data } = await client.put(`${API_BASE}/${id}`, remedy);
  return data;
};

export const deleteRemedy = async (id) => {
  await client.delete(`${API_BASE}/${id}`);
};

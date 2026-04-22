import client from './client';
import { FALLBACK_ZONES } from '../utils/gardenFallbacks';
import { getFallbackPlants } from '../utils/plantFallbacks';

export const fetchGardenZones = async () => {
  try {
    const { data } = await client.get('/api/garden/zones');
    return data;
  } catch (error) {
    return FALLBACK_ZONES;
  }
};

export const fetchZonePlants = async (zoneId) => {
  try {
    const { data } = await client.get(`/api/garden/zones/${zoneId}/plants`);
    return data;
  } catch (error) {
    if (String(zoneId).startsWith('fz')) {
      const offlinePlants = getFallbackPlants(15);
      let selectedList = [];
      if (zoneId === 'fz1') selectedList = offlinePlants.filter(p => ['Tulsi', 'Ashwagandha', 'Guduchi', 'Brahmi'].includes(p.commonName));
      if (zoneId === 'fz2') selectedList = offlinePlants.filter(p => ['Turmeric', 'Ginger', 'Licorice', 'Shatavari'].includes(p.commonName));
      if (zoneId === 'fz3') selectedList = offlinePlants.filter(p => ['Aloe Vera', 'Gotu Kola', 'Bhringraj'].includes(p.commonName));
      if (zoneId === 'fz4') selectedList = offlinePlants.filter(p => ['Neem', 'Amla', 'Arjuna', 'Haritaki'].includes(p.commonName));

      return { plants: selectedList };
    }
    return { plants: [] };
  }
};

export const createGardenZone = async (payload) => {
  const { data } = await client.post('/api/garden/zones', payload);
  return data;
};

export const updateGardenZone = async (zoneId, payload) => {
  const { data } = await client.put(`/api/garden/zones/${zoneId}`, payload);
  return data;
};

export const deleteGardenZone = async (zoneId) => {
  await client.delete(`/api/garden/zones/${zoneId}`);
};

export const assignPlantToZone = async (zoneId, plantId) => {
  await client.post(`/api/garden/zones/${zoneId}/plants/${plantId}`);
};

export const removePlantFromZone = async (zoneId, plantId) => {
  await client.delete(`/api/garden/zones/${zoneId}/plants/${plantId}`);
};

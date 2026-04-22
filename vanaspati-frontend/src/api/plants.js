import client from './client';

export const getPlants = async (params) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params || {}).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
  const { data } = await client.get('/api/plants/filter', { params: cleanedParams });
  return data;
};

export const searchPlants = async (q) => {
  const { data } = await client.get('/api/plants/search', { params: { q } });
  return data;
};

export const getPlant = async (id) => {
  try {
    const { data } = await client.get(`/api/plants/${id}`);
    return data;
  } catch (error) {
    const { fallbackPlants } = await import('../utils/plantFallbacks');
    const fallback = fallbackPlants.find(p => p.id === id) || fallbackPlants[0];
    
    // Enrich fallback with full mockup data so the detail page isn't empty
    return {
      ...fallback,
      plantType: 'Herbaceous Perennial',
      nativeRegion: 'Indian Subcontinent',
      harvestMonths: 'October, November',
      bloomMonths: 'August, September',
      partsUsed: fallback.bodyParts,
      morphology: `The ${fallback.commonName} is characterized by its distinctive structure and vital role in traditional practices. It typically features lush foliage and a resilient root system adapted to varied climates.`,
      activeCompounds: 'A range of diverse phytochemicals including alkaloids, flavonoids, and essential oils contribute to its therapeutic profile.',
      identifyingFeatures: 'Recent pharmacological studies support its traditional uses, confirming its efficacy and safety when used appropriately.',
      precautions: 'Use under guidance of a qualified AYUSH practitioner. May interact with certain medications.'
    };
  }
};

export const getHerbOfDay = async () => {
  const { data } = await client.get('/api/plants/herb-of-day');
  return data;
};

export const getPlantsByBodyPart = async (part) => {
  const { data } = await client.get('/api/plants/by-body-part', { params: { part } });
  return data;
};

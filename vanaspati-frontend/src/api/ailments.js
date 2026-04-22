import client from './client';

import { FALLBACK_AILMENTS } from '../utils/ailmentFallbacks';
import { getFallbackPlantsByBodyPart } from '../utils/plantFallbacks';
import { FALLBACK_REMEDIES } from '../utils/remedyFallbacks';

export const fetchAilments = async () => {
  const { data } = await client.get('/api/ailments');
  return data;
};

export const fetchAilmentDetail = async (id) => {
  try {
    const { data } = await client.get(`/api/ailments/${id}`);
    return data;
  } catch (error) {
    if (String(id).startsWith('fa')) {
      const baseAilment = FALLBACK_AILMENTS.find((a) => a.id === id) || FALLBACK_AILMENTS[0];
      
      const relatedPlants = getFallbackPlantsByBodyPart(baseAilment.bodyPart).map(p => ({
        plantId: p.id,
        commonName: p.commonName,
        scientificName: p.scientificName,
        howUsed: `Traditional preparations using ${p.commonName} are noted for ${baseAilment.name.toLowerCase()}.`,
        dosageForm: 'Extract / Powder'
      }));

      const relatedRemedies = FALLBACK_REMEDIES.filter(r => 
        r.forAilment.toLowerCase().includes(baseAilment.bodyPart.toLowerCase()) || 
        baseAilment.name.toLowerCase().includes(r.forAilment.toLowerCase())
      ).slice(0, 3);

      return {
        ...baseAilment,
        plants: relatedPlants,
        remedies: relatedRemedies.length > 0 ? relatedRemedies : FALLBACK_REMEDIES.slice(0, 2)
      };
    }
    throw error;
  }
};

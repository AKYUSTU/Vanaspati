/**
 * Known growing locations for each plant (4-5 places each).
 * Key = commonName (lowercase) from the database.
 */
export const PLANT_LOCATIONS = {
  'tulsi': ['Uttar Pradesh', 'Madhya Pradesh', 'Tamil Nadu', 'West Bengal', 'Rajasthan'],
  'ashwagandha': ['Rajasthan', 'Madhya Pradesh', 'Gujarat', 'Punjab', 'Haryana'],
  'neem': ['Rajasthan', 'Maharashtra', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka'],
  'turmeric': ['Tamil Nadu', 'Andhra Pradesh', 'Odisha', 'West Bengal', 'Maharashtra'],
  'ginger': ['Kerala', 'Meghalaya', 'Arunachal Pradesh', 'West Bengal', 'Karnataka'],
  'amla': ['Madhya Pradesh', 'Uttar Pradesh', 'Rajasthan', 'Andhra Pradesh', 'Tamil Nadu'],
  'brahmi': ['Bihar', 'West Bengal', 'Uttar Pradesh', 'Kerala', 'Punjab'],
  'giloy': ['Rajasthan', 'Madhya Pradesh', 'Bihar', 'Andhra Pradesh', 'Karnataka'],
  'shatavari': ['Rajasthan', 'Madhya Pradesh', 'Maharashtra', 'Andhra Pradesh', 'Karnataka'],
  'mulethi': ['Kashmir', 'Punjab', 'Uttar Pradesh', 'Balochistan', 'Afghanistan'],
  'haritaki': ['Uttarakhand', 'Bengal', 'Madhya Pradesh', 'Andhra Pradesh', 'Tamil Nadu'],
  'moringa': ['Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Rajasthan', 'Maharashtra'],
  'ajwain': ['Rajasthan', 'Gujarat', 'Madhya Pradesh', 'Uttar Pradesh', 'Punjab'],
  'kalonji': ['Rajasthan', 'Punjab', 'Uttar Pradesh', 'Madhya Pradesh', 'Bangladesh'],
  'arjun': ['Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'West Bengal', 'Deccan region'],
  'manjistha': ['Himachal Pradesh', 'Uttarakhand', 'Kashmir', 'Sikkim', 'Western Ghats'],
  'shankhpushpi': ['Rajasthan', 'Madhya Pradesh', 'Bihar', 'Uttar Pradesh', 'Himalayas'],
  'vidanga': ['Assam', 'Bengal', 'Maharashtra', 'Western Ghats', 'Sri Lanka'],
  'punarnava': ['Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Odisha', 'Tamil Nadu'],
  'jatamansi': ['Uttarakhand', 'Himachal Pradesh', 'Kashmir', 'Nepal', 'Sikkim'],
  'atees': ['Uttarakhand', 'Himachal Pradesh', 'Kashmir', 'Nepal', 'Arunachal Pradesh'],
  'vacha': ['Manipur', 'Assam', 'West Bengal', 'Uttarakhand', 'Kashmir'],
  'nilavembu': ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Sri Lanka'],
  'thoothuvalai': ['Tamil Nadu', 'Andhra Pradesh', 'Kerala', 'Karnataka', 'Sri Lanka'],
  'keezhanelli': ['Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Karnataka', 'Maharashtra'],
  'kapikacchu': ['Bengal', 'Andhra Pradesh', 'Maharashtra', 'Kerala', 'Tamil Nadu'],
  'kokilaksha': ['Bengal', 'Assam', 'Kerala', 'Andhra Pradesh', 'Sri Lanka'],
  'senna': ['Tamil Nadu', 'Rajasthan', 'Maharashtra', 'Gujarat', 'Middle East'],
  'calendula': ['Himachal Pradesh', 'Uttarakhand', 'Kashmir', 'Europe', 'Mediterranean'],
  'arnica': ['Himachal Pradesh', 'Uttarakhand', 'Europe', 'North America', 'Siberia'],
  'belladonna': ['Himachal Pradesh', 'Kashmir', 'Europe', 'North Africa', 'Western Asia'],
  'hypericum': ['Himachal Pradesh', 'Uttarakhand', 'Europe', 'Western Asia', 'North Africa'],
  'pulsatilla': ['Himachal Pradesh', 'Europe', 'Russia', 'North America', 'Uttarakhand'],
  'vembu siddha': ['Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Kerala', 'Sri Lanka'],
  'shankhpushpi siddha': ['Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Karnataka', 'Sri Lanka'],
};

/**
 * Get 4-5 growing locations for a plant by its common name.
 * Falls back to deriving from nativeRegion if not in map.
 */
export function getGrowingLocations(commonName, nativeRegion) {
  if (!commonName) return nativeRegion ? [nativeRegion] : ['India'];
  const key = commonName.toLowerCase().trim();
  if (PLANT_LOCATIONS[key]) return PLANT_LOCATIONS[key];

  // Partial match
  const partialKey = Object.keys(PLANT_LOCATIONS).find((k) => key.includes(k) || k.includes(key));
  if (partialKey) return PLANT_LOCATIONS[partialKey];

  // Fallback: use nativeRegion if available
  return nativeRegion ? [nativeRegion, 'Various parts of India'] : ['Pan-India'];
}

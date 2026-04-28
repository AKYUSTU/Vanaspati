const PLANT_PHOTOS = {
  tulsi: '/images/plants/tulsi.png',
  neem: '/images/plants/neem.png',
  turmeric: '/images/plants/turmeric.png',
  ginger: '/images/plants/ginger.png',
  ashwagandha: '/images/plants/ashwagandha.png',
  brahmi: '/images/plants/brahmi.png',
  amla: '/images/plants/amla.png',
  guduchi: '/images/plants/guduchi.png',
  giloy: '/images/plants/guduchi.png',
  bhringraj: '/images/plants/bhringraj.png',
  licorice: '/images/plants/licorice.png',
  mulethi: '/images/plants/licorice.png',
  aloevera: '/images/plants/aloe.png',
  'aloe vera': '/images/plants/aloe.png',
  shatavari: '/images/plants/shatavari.png',
  arjuna: '/images/plants/arjuna.png',
  arjun: '/images/plants/arjuna.png',
  gotukola: '/images/plants/gotukola.png',
  'gotu kola': '/images/plants/gotukola.png',
  haritaki: '/images/plants/haritaki.png',
  peppermint: '/images/plants/peppermint.png',
  cardamom: '/images/plants/cardamom.jpg',
  cinnamon: '/images/plants/cinnamon.jpg',
  clove: '/images/plants/clove.jpg',
  fennel: '/images/plants/fennel.jpg',
  moringa: '/images/plants/moringa.png',
  manjistha: '/images/plants/manjistha.png',
  punarnava: '/images/plants/punarnava.png',
  vidanga: '/images/plants/vidanga.png',
  ajwain: '/images/plants/ajwain.png',
  kalonji: '/images/plants/kalonji.png',
  senna: '/images/plants/senna.png',
  nilavembu: '/images/plants/nilavembu.png',
  keezhanelli: '/images/plants/keezhanelli.png',
  thoothuvalai: '/images/plants/thoothuvalai.png',
  shankhpushpi: '/images/plants/shankhpushpi.png',
  vacha: '/images/plants/vacha.png',
  jatamansi: '/images/plants/jatamansi.png',
  kapikacchu: '/images/plants/kapikacchu.png',
  arnica: '/images/plants/arnica.png',
  belladonna: '/images/plants/belladonna.png',
  calendula: '/images/plants/calendula.png',
  hypericum: '/images/plants/arnica.png',
  'st. john': '/images/plants/arnica.png',
};

// Generic high-quality botanical fallback photos by index
const BOTANICAL_PHOTOS = [
  'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&q=80&fit=crop', // tulsi/herbs
  'https://images.unsplash.com/photo-1502810365585-56ffa361fdde?w=600&q=80&fit=crop', // neem/leaves
  'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80&fit=crop', // turmeric/roots
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&fit=crop', // ginger
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80&fit=crop', // botanical
  'https://images.unsplash.com/photo-1585320806297-9794b3e4aaae?w=600&q=80&fit=crop', // plant
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80&fit=crop', // amla/fruit
  'https://images.unsplash.com/photo-1524492414210-a1d6e2e1b4b5?w=600&q=80&fit=crop', // ashwagandha
  'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&q=80&fit=crop', // brahmi
  'https://images.unsplash.com/photo-1550159930-40066082a4fc?w=600&q=80&fit=crop', // licorice
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80&fit=crop', // green leaves
  'https://images.unsplash.com/photo-1466692476877-bb89bf8d4ac5?w=600&q=80&fit=crop', // potted plants
];

function hashString(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

/**
 * Get a realistic botanical photo for a plant.
 * Checks known plant names first, then falls back to a stable hash-based photo.
 */
export function buildBotanicalFallbackImage(title) {
  const key = String(title || '').toLowerCase().replace(/\s+/g, '');
  // Check known plants
  for (const [name, url] of Object.entries(PLANT_PHOTOS)) {
    if (key.includes(name)) return url;
  }
  // Stable hash-based fallback from our botanical photo array
  const index = hashString(String(title || 'plant')) % BOTANICAL_PHOTOS.length;
  return BOTANICAL_PHOTOS[index];
}

const fallbackSeedPlants = [
  {
    id: 'fallback-tulsi',
    commonName: 'Tulsi',
    scientificName: 'Ocimum tenuiflorum',
    bodyParts: ['HEAD', 'THROAT', 'CHEST'],
    description: 'Sacred basil with aromatic leaves, revered in Ayurveda for respiratory and immune support.',
    accent: '#4A8C5C',
    bloom: '#C9922A',
    photo: PLANT_PHOTOS.tulsi,
    type: 'HERB',
    system: 'AYURVEDA',
    region: 'Pan-India',
    partUsed: 'LEAVES',
    rasa: 'PUNGENT',
    season: 'SUMMER',
  },
  {
    id: 'fallback-neem',
    commonName: 'Neem',
    scientificName: 'Azadirachta indica',
    bodyParts: ['SKIN', 'LIVER', 'HEAD'],
    description: 'A resilient tree admired for its bitter leaves and broad traditional uses in skin and liver health.',
    accent: '#2F6F4E',
    bloom: '#7FAF5B',
    photo: PLANT_PHOTOS.neem,
    type: 'TREE',
    system: 'AYURVEDA',
    region: 'Pan-India',
    partUsed: 'LEAVES',
    rasa: 'BITTER',
    season: 'SPRING',
  },
  {
    id: 'fallback-turmeric',
    commonName: 'Turmeric',
    scientificName: 'Curcuma longa',
    bodyParts: ['JOINTS', 'STOMACH', 'LIVER'],
    description: 'Golden rhizome known for its anti-inflammatory properties and warming kitchen preparations.',
    accent: '#D48A1F',
    bloom: '#E7B547',
    photo: PLANT_PHOTOS.turmeric,
    type: 'HERB',
    system: 'AYURVEDA',
    region: 'South India',
    partUsed: 'RHIZOME',
    rasa: 'BITTER',
    season: 'WINTER',
  },
  {
    id: 'fallback-ginger',
    commonName: 'Ginger',
    scientificName: 'Zingiber officinale',
    bodyParts: ['STOMACH', 'CHEST', 'THROAT'],
    description: 'Spicy rhizome used across cuisines and comfort preparations for digestion and immunity.',
    accent: '#A86B3B',
    bloom: '#E0A35A',
    photo: PLANT_PHOTOS.ginger,
    type: 'HERB',
    system: 'AYURVEDA',
    region: 'Pan-India',
    partUsed: 'RHIZOME',
    rasa: 'PUNGENT',
    season: 'MONSOON',
  },
  {
    id: 'fallback-ashwagandha',
    commonName: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    bodyParts: ['HEAD', 'JOINTS'],
    description: 'Grounding root herb long associated with steady vitality, stress relief and energy.',
    accent: '#6C4A3E',
    bloom: '#D7B08A',
    photo: PLANT_PHOTOS.ashwagandha,
    type: 'SHRUB',
    system: 'AYURVEDA',
    region: 'North India',
    partUsed: 'ROOT',
    rasa: 'SWEET',
    season: 'WINTER',
  },
  {
    id: 'fallback-brahmi',
    commonName: 'Brahmi',
    scientificName: 'Bacopa monnieri',
    bodyParts: ['HEAD', 'EYES'],
    description: 'A creeping herb favored in memory and focus traditions across Ayurvedic practice.',
    accent: '#3C7C9A',
    bloom: '#93D1E6',
    photo: PLANT_PHOTOS.brahmi,
    type: 'HERB',
    system: 'AYURVEDA',
    region: 'Coastal',
    partUsed: 'WHOLE',
    rasa: 'BITTER',
    season: 'SUMMER',
  },
  {
    id: 'fallback-amla',
    commonName: 'Amla',
    scientificName: 'Phyllanthus emblica',
    bodyParts: ['SKIN', 'EYES', 'STOMACH'],
    description: 'Bright fruit rich in Vitamin C, used for tart tonics, hair care, and seasonal nourishment.',
    accent: '#5A8E45',
    bloom: '#B8D95B',
    photo: PLANT_PHOTOS.amla,
    type: 'TREE',
    system: 'AYURVEDA',
    region: 'North India',
    partUsed: 'FRUIT',
    rasa: 'SOUR',
    season: 'WINTER',
  },
  {
    id: 'fallback-guduchi',
    commonName: 'Guduchi',
    scientificName: 'Tinospora cordifolia',
    bodyParts: ['LIVER', 'STOMACH'],
    description: 'Climbing vine traditionally valued as a balancing, restorative and immunity-boosting plant.',
    accent: '#4D8C6A',
    bloom: '#A7D7A8',
    photo: PLANT_PHOTOS.guduchi,
    type: 'CLIMBER',
    system: 'AYURVEDA',
    region: 'South India',
    partUsed: 'STEM',
    rasa: 'BITTER',
    season: 'MONSOON',
  },
  {
    id: 'fallback-bhringraj',
    commonName: 'Bhringraj',
    scientificName: 'Eclipta prostrata',
    bodyParts: ['HEAD', 'SKIN'],
    description: 'Compact herb known for hair, scalp-focused preparations and liver support.',
    accent: '#2E5E58',
    bloom: '#A2CBBF',
    photo: PLANT_PHOTOS.bhringraj,
    type: 'HERB',
    system: 'AYURVEDA',
    region: 'Coastal',
    partUsed: 'WHOLE',
    rasa: 'BITTER',
    season: 'MONSOON',
  },
  {
    id: 'fallback-licorice',
    commonName: 'Licorice',
    scientificName: 'Glycyrrhiza glabra',
    bodyParts: ['THROAT', 'STOMACH', 'CHEST'],
    description: 'Sweet root used in soothing preparations, herbal blends and respiratory support.',
    accent: '#7A5D3D',
    bloom: '#D9C199',
    photo: PLANT_PHOTOS.licorice,
    type: 'SHRUB',
    system: 'UNANI',
    region: 'Himalayan',
    partUsed: 'ROOT',
    rasa: 'SWEET',
    season: 'SUMMER',
  },
  {
    id: 'fallback-aloevera',
    commonName: 'Aloe Vera',
    scientificName: 'Aloe barbadensis',
    bodyParts: ['SKIN', 'STOMACH'],
    description: 'Succulent plant well-regarded for its cooling, soothing gel and digestive health applications.',
    accent: '#7AA34D',
    bloom: '#C2E092',
    photo: PLANT_PHOTOS.aloevera,
    type: 'HERB',
    system: 'AYURVEDA',
    region: 'South India',
    partUsed: 'LEAVES',
    rasa: 'BITTER',
    season: 'SUMMER',
  },
  {
    id: 'fallback-shatavari',
    commonName: 'Shatavari',
    scientificName: 'Asparagus racemosus',
    bodyParts: ['REPRODUCTIVE', 'STOMACH'],
    description: 'Cooling root known as a premier rejuvenating herb for women’s health in Ayurveda.',
    accent: '#A0B286',
    bloom: '#DCE6C8',
    photo: PLANT_PHOTOS.shatavari,
    type: 'SHRUB',
    system: 'AYURVEDA',
    region: 'Himalayan',
    partUsed: 'ROOT',
    rasa: 'SWEET',
    season: 'SPRING',
  },
  {
    id: 'fallback-arjuna',
    commonName: 'Arjuna',
    scientificName: 'Terminalia arjuna',
    bodyParts: ['HEART', 'CHEST'],
    description: 'Tree bark traditionally associated with cardiovascular wellness and emotional balance.',
    accent: '#8C5A4A',
    bloom: '#C79A8A',
    photo: PLANT_PHOTOS.arjuna,
    type: 'TREE',
    system: 'AYURVEDA',
    region: 'Pan-India',
    partUsed: 'BARK',
    rasa: 'ASTRINGENT',
    season: 'WINTER',
  },
  {
    id: 'fallback-gotukola',
    commonName: 'Gotu Kola',
    scientificName: 'Centella asiatica',
    bodyParts: ['HEAD', 'SKIN'],
    description: 'Small aquatic herb reputed to support mental clarity, healing, and skin vitality.',
    accent: '#477C57',
    bloom: '#92C4A2',
    photo: PLANT_PHOTOS.gotukola,
    type: 'HERB',
    system: 'AYURVEDA',
    region: 'Coastal',
    partUsed: 'LEAVES',
    rasa: 'BITTER',
    season: 'MONSOON',
  },
  {
    id: 'fallback-haritaki',
    commonName: 'Haritaki',
    scientificName: 'Terminalia chebula',
    bodyParts: ['STOMACH', 'LIVER'],
    description: 'Considered the king of medicines in Tibet, a cornerstone of Triphala for digestive cleansing.',
    accent: '#665C40',
    bloom: '#B8AD8E',
    photo: PLANT_PHOTOS.haritaki,
    type: 'TREE',
    system: 'AYURVEDA',
    region: 'Himalayan',
    partUsed: 'FRUIT',
    rasa: 'ASTRINGENT',
    season: 'WINTER',
  },
  {
    id: 'fallback-peppermint',
    commonName: 'Peppermint',
    scientificName: 'Mentha x piperita',
    bodyParts: ['STOMACH', 'HEAD', 'RESPIRATORY'],
    description: 'Refreshing aromatic herb widely used in teas for settling the stomach and clearing sinuses.',
    accent: '#4E9F6A',
    bloom: '#A3D9B5',
    photo: PLANT_PHOTOS.peppermint,
    type: 'HERB',
    system: 'HOMEOPATHY',
    region: 'North India',
    partUsed: 'LEAVES',
    rasa: 'PUNGENT',
    season: 'SUMMER',
  },
  {
    id: 'fallback-cardamom',
    commonName: 'Cardamom',
    scientificName: 'Elettaria cardamomum',
    bodyParts: ['STOMACH', 'THROAT'],
    description: 'Highly prized spice pod with a cooling, sweet aroma commonly used for digestive issues and flavoring.',
    accent: '#839659',
    bloom: '#BCCE9D',
    photo: PLANT_PHOTOS.cardamom,
    type: 'HERB',
    system: 'UNANI',
    region: 'South India',
    partUsed: 'FRUIT',
    rasa: 'SWEET',
    season: 'WINTER',
  },
  {
    id: 'fallback-cinnamon',
    commonName: 'Cinnamon',
    scientificName: 'Cinnamomum verum',
    bodyParts: ['STOMACH', 'BLOOD'],
    description: 'Aromatic inner bark of a tree that is revered for its warming properties and balancing blood sugar.',
    accent: '#A36544',
    bloom: '#D29C81',
    photo: PLANT_PHOTOS.cinnamon,
    type: 'TREE',
    system: 'SIDDHA',
    region: 'South India',
    partUsed: 'BARK',
    rasa: 'PUNGENT',
    season: 'WINTER',
  },
  {
    id: 'fallback-clove',
    commonName: 'Clove',
    scientificName: 'Syzygium aromaticum',
    bodyParts: ['TEETH', 'STOMACH', 'THROAT'],
    description: 'A dried flower bud popular for its potent warming aroma and traditional uses in toothache remedies.',
    accent: '#5E382B',
    bloom: '#8B6A5E',
    photo: PLANT_PHOTOS.clove,
    type: 'TREE',
    system: 'AYURVEDA',
    region: 'South India',
    partUsed: 'FLOWER',
    rasa: 'PUNGENT',
    season: 'WINTER',
  },
  {
    id: 'fallback-fennel',
    commonName: 'Fennel',
    scientificName: 'Foeniculum vulgare',
    bodyParts: ['STOMACH', 'RESPIRATORY'],
    description: 'Sweet, anise-flavored seeds used after meals as a digestive aid and breath freshener.',
    accent: '#A1B57D',
    bloom: '#D0DEC1',
    photo: PLANT_PHOTOS.fennel,
    type: 'HERB',
    system: 'HOMEOPATHY',
    region: 'Pan-India',
    partUsed: 'SEEDS',
    rasa: 'SWEET',
    season: 'SPRING',
  },
];

export const fallbackPlants = fallbackSeedPlants.map((plant) => ({
  ...plant,
  mainImageUrl: plant.photo,
  galleryImages: [plant.photo],
}));

export function getFallbackPlants(limit = fallbackPlants.length) {
  return fallbackPlants.slice(0, Math.max(0, limit));
}

export function getFallbackPlantByIndex(index = 0) {
  return fallbackPlants[((index % fallbackPlants.length) + fallbackPlants.length) % fallbackPlants.length];
}

export function getFallbackPlantsByBodyPart(part) {
  const normalized = String(part || '').toUpperCase();
  const matches = fallbackPlants.filter((plant) => plant.bodyParts.includes(normalized));
  return matches.length > 0 ? matches : fallbackPlants.slice(0, 6);
}

export function getFallbackHerbOfDay(date = new Date()) {
  const dayKey = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const index = hashString(dayKey.toString());
  return fallbackPlants[index % fallbackPlants.length];
}

export function getPlantDisplayImage(plant, index = 0) {
  if (plant?.mainImageUrl && !plant.mainImageUrl.startsWith('data:')) {
    return plant.mainImageUrl;
  }
  return buildBotanicalFallbackImage(plant?.commonName || `Plant ${index + 1}`);
}

export function createFallbackPlantsPage(limit = 12) {
  const content = getFallbackPlants(limit);
  return {
    content,
    totalElements: content.length,
    totalPages: 1,
    size: content.length,
    number: 0,
    numberOfElements: content.length,
    first: true,
    last: true,
    empty: content.length === 0,
  };
}

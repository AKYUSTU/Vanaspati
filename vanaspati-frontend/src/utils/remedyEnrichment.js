/**
 * Dynamically enriches sparse remedy data with detailed content.
 * Used when database fields are too short.
 */

const REMEDY_ENRICHMENTS = {
  'Ginger Tulsi Kadha': {
    about: 'Ginger Tulsi Kadha is a time-honoured Ayurvedic decoction prescribed across generations for managing fever, cold, and flu. The combination of Tulsi — revered as the "Queen of Herbs" — and fresh ginger creates a powerful synergy that is both antimicrobial and anti-inflammatory. Tulsi contains eugenol, rosmarinic acid, and ursolic acid, which combat respiratory pathogens, while ginger\'s gingerols and shogaols reduce body temperature and relieve throat inflammation. Black pepper, the third pillar of this kadha, acts as a bioavailability enhancer (bioperine) ensuring maximum absorption of all active compounds. Traditionally consumed twice daily during illness, this remedy is safe for adults and children above 8 years when prepared in recommended quantities.',
    steps: [
      'Gather 10 fresh Tulsi leaves, 1 inch of ginger root, and 4 black peppercorns. Rinse the Tulsi leaves under cool running water and lightly crush the ginger to expose its fibrous interior.',
      'Pour 300 ml of fresh water into a clean stainless steel or clay pot. Add the Tulsi leaves, crushed ginger, and lightly crushed peppercorns to the water.',
      'Bring the mixture to a full rolling boil over medium heat, then reduce to a gentle simmer. Allow it to cook uncovered for 10–12 minutes until the water reduces to approximately 150 ml and turns a deep amber colour.',
      'Remove from heat and allow to cool for 2 minutes. Place a fine mesh strainer over your cup and pour the decoction through it to remove all solid plant material.',
      'Add 1 teaspoon of raw honey or jaggery to taste — never add honey to boiling liquid as heat destroys its enzymes. Stir gently and sip slowly while still warm.',
      'Consume twice daily — once in the morning on a relatively empty stomach and once in the evening. Continue for 3–5 days at the first sign of fever or cold symptoms.',
    ],
  },
  'Turmeric Milk': {
    about: 'Turmeric Milk, known as Haldi Doodh or "Golden Milk," is one of the most celebrated bedtime tonics in Ayurvedic medicine. Its primary active compound, curcumin, is a potent anti-inflammatory and antioxidant that supports the body\'s natural healing processes during sleep. The fat content of milk significantly enhances curcumin absorption, as curcumin is fat-soluble. Adding black pepper (piperine) further increases bioavailability by 2000%. This warm drink promotes restful sleep, supports muscle recovery, boosts immunity, and has been studied for its potential role in reducing chronic inflammation. It is particularly beneficial after physical exertion, during illness recovery, and in colder months.',
    steps: [
      'Measure 250 ml of full-fat milk (cow milk preferred; use almond or oat milk for dairy-free). Pour into a small saucepan and place over low-medium heat.',
      'Add ½ teaspoon of high-quality turmeric powder (Curcuma longa) to the cold milk before heating. This allows the curcumin to infuse gradually as the milk warms.',
      'Add a pinch (⅛ tsp) of freshly ground black pepper. This is essential — piperine in black pepper increases curcumin absorption by up to 2000%, making this step non-negotiable for therapeutic effect.',
      'Optionally add ¼ teaspoon of cinnamon powder for additional anti-inflammatory benefit, and a small piece of fresh ginger (¼ inch, grated) for warmth and digestive support.',
      'Heat the milk while stirring continuously until it just begins to steam — do not allow it to reach a full boil as this can degrade some heat-sensitive nutrients. This typically takes 4–5 minutes.',
      'Pour into a warm cup and allow to cool to a comfortable drinking temperature. Sweeten with ½ teaspoon of raw honey if desired (add only after cooling below 60°C).',
      'Drink 30 minutes before bedtime. For maximum benefit, consume consistently for at least 4 weeks. Avoid consuming on a completely empty stomach.',
    ],
  },
};

/**
 * Generate enriched detailed steps when DB steps are too short.
 */
function generateDetailedSteps(remedy) {
  const name = remedy.name || '';
  const ailment = remedy.forAilment || 'general wellness';
  const ingList = (remedy.ingredients || []).map(i => i.ingredientName).join(', ') || 'the prepared herbs';

  return [
    `Gather and carefully clean all required ingredients: ${ingList}. Rinse any fresh plant material under running water, removing any dirt or damaged parts. Use a clean, dry vessel — preferably clay, stainless steel, or glass — for preparation.`,
    `Measure out the precise quantities of each ingredient as listed. Accurate measurement is important in herbal preparation — too much of a herb can sometimes have the opposite of the intended therapeutic effect.`,
    `Combine the solid ingredients in the vessel with the appropriate amount of water or base liquid (typically 250–300 ml of water for a single serving decoction). Allow ingredients to soak for 5 minutes before applying heat — this pre-soaking activates plant compounds more effectively.`,
    `Apply gentle heat and bring to a slow boil. Once boiling, reduce to a low simmer. For decoctions (kashayam), simmer uncovered until the liquid reduces to approximately half its original volume. This concentration step is critical for therapeutic potency.`,
    `Once sufficiently reduced and fragrant, remove from heat. Allow the preparation to rest for 2–3 minutes. Strain through a fine mesh or muslin cloth into a clean cup, pressing the plant material gently to extract all liquid.`,
    `Add any finishing ingredients such as honey, jaggery, or salt only after the liquid has cooled slightly (below 60°C for honey to preserve its enzymes). Stir well to incorporate.`,
    `Consume while warm for best results. This remedy is traditionally recommended for ${ailment}. Take as directed — typically once or twice daily. Do not store leftover decoction; prepare fresh each time for maximum potency.`,
  ];
}

/**
 * Generate enriched "About" text when DB description is too short.
 */
function generateAboutText(remedy) {
  const name = remedy.name || 'This remedy';
  const ailment = remedy.forAilment || 'general wellness';
  const desc = remedy.description || '';
  const systemMap = { Ayurveda: 'Ayurvedic', Siddha: 'Siddha', Unani: 'Unani', Homeopathy: 'Homeopathic' };

  return `${name} is a traditional herbal preparation rooted in the ancient AYUSH systems of medicine, specifically formulated to support ${ailment}. ${desc ? desc + ' ' : ''}

This remedy brings together carefully selected medicinal herbs whose combined therapeutic properties have been validated both by centuries of traditional use and by growing modern phytochemical research. Each ingredient contributes unique bioactive compounds — including alkaloids, flavonoids, terpenes, and essential oils — that work synergistically to deliver targeted relief.

Practitioners recommend this remedy as part of a holistic approach to health, complementing dietary adjustments and lifestyle practices. When prepared and consumed correctly, it works gently with the body's natural healing mechanisms without the side effects commonly associated with synthetic medications.

Always source herbs from verified, pesticide-free suppliers. Consult a qualified Ayurvedic or Siddha practitioner before beginning any herbal regimen, particularly if you are pregnant, nursing, have a chronic medical condition, or are taking prescription medications.`;
}

/**
 * Main enrichment function — merges DB data with enriched content.
 */
export function enrichRemedy(remedy) {
  if (!remedy) return remedy;

  const enriched = REMEDY_ENRICHMENTS[remedy.name];

  // Enrich "About" if description is too short (< 80 chars)
  const about = (remedy.description && remedy.description.length >= 80)
    ? remedy.description
    : (enriched?.about || generateAboutText(remedy));

  // Enrich steps if missing or too short (steps with instruction < 40 chars)
  const hasGoodSteps = remedy.steps?.length >= 3 &&
    remedy.steps.every(s => s.instruction && s.instruction.length >= 40);

  const steps = hasGoodSteps
    ? remedy.steps
    : (enriched?.steps
        ? enriched.steps.map((instruction, i) => ({ id: i + 1, stepNumber: i + 1, instruction }))
        : generateDetailedSteps(remedy).map((instruction, i) => ({ id: i + 1, stepNumber: i + 1, instruction })));

  // Enrich ingredients if missing
  const ingredients = (remedy.ingredients && remedy.ingredients.length > 0)
    ? remedy.ingredients
    : [
        { id: 1, ingredientName: 'Primary herb (as named)', quantity: '1–2 tbsp', notes: 'Use fresh where possible' },
        { id: 2, ingredientName: 'Water', quantity: '300 ml', notes: 'Filtered, freshly boiled' },
        { id: 3, ingredientName: 'Honey or jaggery', quantity: '1 tsp', notes: 'To taste, add after cooling' },
      ];

  // Enrich precautions if missing
  const precautions = remedy.precautions ||
    'Consult a qualified Ayurvedic practitioner before use if you are pregnant, nursing, or on prescription medication. Do not exceed recommended dosage. Discontinue use and seek medical advice if any adverse reaction occurs. Not intended to replace professional medical treatment.';

  return { ...remedy, description: about, steps, ingredients, precautions };
}

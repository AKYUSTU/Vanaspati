import { getPlantDisplayImage } from './plantFallbacks';

function shuffle(items) {
  const array = [...items];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }
  return array;
}

export function buildPlantQuizQuestions(plants, maxQuestions = 5) {
  const eligible = (plants || [])
    .filter((plant) => plant?.id && plant?.commonName)
    .filter((plant, index, array) => array.findIndex((entry) => entry.commonName === plant.commonName) === index);

  if (eligible.length < 4) {
    return [];
  }

  const shuffledPlants = shuffle(eligible);
  const selected = shuffledPlants.slice(0, Math.min(maxQuestions, shuffledPlants.length));

  return selected
    .map((plant) => {
      const distractors = shuffle(
        eligible
          .filter((entry) => entry.id !== plant.id)
          .map((entry) => entry.commonName)
      ).slice(0, 3);

      if (distractors.length < 3) {
        return null;
      }

      return {
        id: plant.id,
        image: getPlantDisplayImage(plant, plant.id),
        prompt: 'Identify the medicinal plant shown below.',
        options: shuffle([plant.commonName, ...distractors]),
        answer: plant.commonName,
        hint: plant.scientificName
          ? `Scientific name: ${plant.scientificName}`
          : 'Use visual traits and your catalog memory.',
      };
    })
    .filter(Boolean);
}
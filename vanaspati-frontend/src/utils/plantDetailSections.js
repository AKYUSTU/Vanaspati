export function shouldShowMedicinalUses(partsUsed, bodyParts, plant) {
  return (
    partsUsed.length > 0
    || bodyParts.length > 0
    || Boolean(plant?.partsUsed || plant?.bodyParts)
  );
}

export function buildPlantDetailSections(plant, partsUsed, bodyParts, hasPrecautions, hasVisuals) {
  return [
    { id: 'overview', label: 'Overview' },
    { id: 'botanical-description', label: 'Botanical Description', enabled: Boolean(plant?.morphology) },
    { id: 'medicinal-uses', label: 'Medicinal Uses', enabled: shouldShowMedicinalUses(partsUsed, bodyParts, plant) },
    { id: 'ayush-applications', label: 'AYUSH Applications' },
    { id: 'cultivation-guide', label: 'Cultivation Guide' },
    { id: 'phytochemistry', label: 'Phytochemistry', enabled: Boolean(plant?.activeCompounds) },
    { id: 'research-studies', label: 'Research & Studies', enabled: Boolean(plant?.identifyingFeatures) },
    { id: 'traditional-recipes', label: 'Preparation Notes' },
    { id: 'precautions', label: 'Precautions', enabled: hasPrecautions },
    { id: 'gallery', label: 'Gallery', enabled: hasVisuals },
  ].filter((section) => section.enabled !== false);
}
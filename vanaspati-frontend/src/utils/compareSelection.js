export const DEFAULT_MAX_COMPARE = 3;

export function canAddPlant(selectedIds, maxCompare = DEFAULT_MAX_COMPARE) {
  return selectedIds.length < maxCompare;
}

export function addPlantSelection(selectedIds, id, maxCompare = DEFAULT_MAX_COMPARE) {
  if (!canAddPlant(selectedIds, maxCompare)) {
    return selectedIds;
  }
  if (selectedIds.includes(id)) {
    return selectedIds;
  }
  return [...selectedIds, id];
}

export function removePlantSelection(selectedIds, id) {
  return selectedIds.filter((value) => value !== id);
}

export function getAvailableMatches(matches, selectedIds, limit = 8) {
  return matches.filter((item) => !selectedIds.includes(item.id)).slice(0, limit);
}

export function formatCompareValue(value) {
  if (!value) {
    return 'Not specified';
  }
  if (typeof value === 'string') {
    return value.replaceAll(',', ', ');
  }
  return String(value);
}
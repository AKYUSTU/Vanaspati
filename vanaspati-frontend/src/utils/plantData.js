export function parseListField(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item || '').trim()).filter(Boolean);
      }
    } catch {
      return trimmed
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
}

export function normalizeImageList(mainImageUrl, galleryImages) {
  const merged = [mainImageUrl, ...parseListField(galleryImages)]
    .map((src) => (typeof src === 'string' ? src.trim() : ''))
    .filter(Boolean);

  return merged.filter((src, index) => merged.indexOf(src) === index);
}
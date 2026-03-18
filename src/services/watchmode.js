const WATCHMODE_KEY = 'oAGcE9cYKdYbR8wTFEJJTTgkoqL2EwM4ql8e8ODm';
const BASE = 'https://api.watchmode.com/v1';
const FALLBACK = ['Netflix', 'Prime Video', 'Disney+', 'Apple TV+', 'Hulu'];

export async function getStreamingPlatforms(title) {
  try {
    const searchRes = await fetch(
      `${BASE}/search/?apiKey=${WATCHMODE_KEY}&search_field=name&search_value=${encodeURIComponent(title)}`
    );
    const searchData = await searchRes.json();

    if (!searchData.title_results?.length) return { platforms: FALLBACK, isFallback: true };

    const id = searchData.title_results[0].id;
    const detailRes  = await fetch(`${BASE}/title/${id}/details/?apiKey=${WATCHMODE_KEY}`);
    const detailData = await detailRes.json();

    if (!detailData.sources?.length) return { platforms: FALLBACK, isFallback: true };

    const platforms = [...new Set(detailData.sources.map(s => s.name))];
    return { platforms, isFallback: false };
  } catch {
    return { platforms: FALLBACK, isFallback: true };
  }
}
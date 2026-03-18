export async function getWikiSummary(title) {
  const clean = title.replace(/\(\d{4}\)/g, '').replace(/:/g, '').replace(/-/g, ' ').trim();

  const searchRes = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(clean + ' film')}&format=json&origin=*`
  );
  const searchData = await searchRes.json();

  if (!searchData.query?.search?.length) return null;

  const pageTitle = searchData.query.search[0].title;
  const pageRes   = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`
  );
  return await pageRes.json();
}
export async function onRequest(context) {
  const { env } = context;

  const libraryId = env.BUNNY_LIBRARY_ID;
  const apiKey = env.BUNNY_API_KEY;

  const url = `https://video.bunnycdn.com/library/${libraryId}/videos`;

  const res = await fetch(url, {
    headers: { AccessKey: apiKey }
  });

  const data = await res.json();

  const pullZone = env.BUNNY_PULLZONE_URL;

// 必要な情報だけ返す
const videos = data.items.map(v => ({
    id: v.guid,
    title: v.title,
    thumbnail: `${pullZone}/${v.guid}/thumbnail.jpg`,
    status: v.status
}));


  return new Response(JSON.stringify(videos), {
    headers: { "Content-Type": "application/json" }
  });
}

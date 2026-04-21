export async function onRequest(context) {
  const { params, env } = context;
  const videoId = params.id;

  const libraryId = env.BUNNY_LIBRARY_ID;
  const apiKey = env.BUNNY_API_KEY;

  const url = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;

  const res = await fetch(url, {
    headers: { AccessKey: apiKey }
  });

  const data = await res.json();

  // ★ Pull Zone 再生方式
  const pullZoneUrl = env.BUNNY_PULLZONE_URL; 
  const playlistUrl = `${pullZoneUrl}/${data.guid}/playlist.m3u8`;

  return new Response(JSON.stringify({
    title: data.title,
    thumbnailUrl: data.thumbnailUrl,
    playlistUrl,
    status: data.status,
    availableResolutions: data.availableResolutions
  }), {
    headers: { "Content-Type": "application/json" }
  });
}

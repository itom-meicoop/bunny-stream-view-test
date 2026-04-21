export async function onRequest(context) {
  const { BUNNY_API_KEY, BUNNY_LIBRARY_ID } = context.env;
  const videoId = context.params.id;

  if (!BUNNY_API_KEY || !BUNNY_LIBRARY_ID) {
    return new Response(JSON.stringify({ error: "Missing API key or library ID" }), { status: 500 });
  }

  const apiUrl = `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${videoId}`;
  const res = await fetch(apiUrl, {
    headers: {
      'AccessKey': BUNNY_API_KEY,
      'accept': 'application/json'
    }
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Video not found" }), { status: 404 });
  }

  const data = await res.json();

  // 構造化して返す
  const result = {
    title: data.title,
    thumbnailUrl: data.thumbnail && data.thumbnail.length > 0
      ? data.thumbnail[0].url
      : null,
    playlistUrl: data.playlistUrl || data.playlist?.m3u8 || data.encodeProgress === 100
      ? `https://vz-${videoId}-bunny.b-cdn.net/play_720p.m3u8`
      : null,
    status: data.encodeProgress === 100 ? "ready" : "processing",
    availableResolutions: data.availableResolutions || []
  };

  return new Response(JSON.stringify(result), {
    headers: { 'content-type': 'application/json' }
  });
}

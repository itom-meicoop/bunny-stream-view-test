export async function onRequest(context) {
  const { params, env } = context;
  const videoId = params.id;

  const libraryId = env.BUNNY_LIBRARY_ID;
  const apiKey = env.BUNNY_API_KEY;

  const url = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;

  const res = await fetch(url, {
      headers: {
          AccessKey: apiKey
      }
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch video info" }), {
      status: 500
  });
  }

  const data = await res.json();

  return new Response(JSON.stringify({
      title: data.title,
      thumbnailUrl: data.thumbnailUrl,
      playlistUrl: data.playlistUrl,
      status: data.status,
      availableResolutions: data.availableResolutions
  }), {
      headers: { "Content-Type": "application/json" }
  });
}

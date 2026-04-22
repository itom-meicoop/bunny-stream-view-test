export async function onRequest(context) {
  const { env } = context;

  return new Response(JSON.stringify({
      supabaseUrl: env.SUPABASE_URL,
      supabaseAnonKey: env.SUPABASE_ANON_KEY
  }), {
      headers: { "Content-Type": "application/json" }
  });
}

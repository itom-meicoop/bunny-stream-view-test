export async function onRequest(context) {
  const { env, request } = context;

  const token = request.headers.get("Authorization");

  if (!token) {
    return Response.redirect("/login", 302);
  }

  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
          Authorization: token,
          apikey: env.SUPABASE_ANON_KEY
      }
  });

  if (res.status !== 200) {
    return Response.redirect("/login", 302);
  }

  return context.next();
}

import { onRequest as protect } from "./protected.js";

export async function onRequest(context) {
    const url = new URL(context.request.url);

    // ログイン不要のページ
    const publicPaths = [
        "/login",
        "/auth/callback",
        "/api/env"
    ];

    if (publicPaths.some(path => url.pathname.startsWith(path))) {
        return context.next();
    }

    // それ以外は保護
    return protect(context);
}

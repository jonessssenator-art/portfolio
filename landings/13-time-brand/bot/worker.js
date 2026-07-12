/**
 * TIME BRAND — приёмник заявок с сайта.
 * Разворачивается на Cloudflare Workers (бесплатный тариф).
 * Секреты BOT_TOKEN и CHAT_ID задаются в настройках воркера — в коде их НЕТ.
 */
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST")
      return new Response(JSON.stringify({ ok: false, error: "POST only" }), { status: 405, headers: cors });

    let text = "";
    try {
      const body = await request.json();
      text = String(body.text || "").slice(0, 1500);
    } catch (e) {}
    if (!text.trim())
      return new Response(JSON.stringify({ ok: false, error: "empty" }), { status: 400, headers: cors });

    const tg = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text: "🔔 " + text }),
    });

    return new Response(JSON.stringify({ ok: tg.ok }), {
      status: tg.ok ? 200 : 502,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};

// Fetches a web page and serves it from this app's own address, so the animator
// can read which fonts and breakpoints the page uses, and swap in uploaded fonts.
// Works as a Vercel serverless function and from dev-server.js.

const BLOCKED = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.|169\.254\.|\[?::1\]?$|.*\.local$|.*\.internal$)/i;

function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

module.exports = async function handler(req, res) {
  const q = new URL(req.url, 'http://x').searchParams;
  let target;
  try {
    target = new URL(q.get('url') || '');
    if (!/^https?:$/.test(target.protocol)) throw new Error('bad protocol');
  } catch (e) {
    return send(res, 400, page('Paste a full address, for example https://www.example.com'));
  }
  if (BLOCKED.test(target.hostname) && process.env.ALLOW_PRIVATE !== '1') {
    return send(res, 400, page('Private and local addresses are not allowed.'));
  }

  let r, html;
  try {
    r = await fetch(target.href, {
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml',
        'accept-language': 'en'
      }
    });
    html = await r.text();
  } catch (e) {
    return send(res, 502, page('Could not reach ' + target.hostname + '.'));
  }

  const final = new URL(r.url || target.href);
  // Drop the page's own CSP meta tags so it can run from this address.
  html = html.replace(/<meta[^>]+http-equiv=["']?content-security-policy["']?[^>]*>/gi, '');
  // Resolve every relative link against the real site, and give the page its real path
  // so client-side routers (Framer, Next, etc.) render the right page.
  const inject =
    `<base href="${escAttr(final.href)}">` +
    `<script>try{history.replaceState(null,'',${JSON.stringify(final.pathname + final.search + final.hash)})}catch(e){}` +
    `window.__REFLOW_SOURCE__=${JSON.stringify(final.href)};</script>`;
  if (/<head[^>]*>/i.test(html)) html = html.replace(/<head[^>]*>/i, m => m + inject);
  else html = inject + html;

  res.setHeader('cache-control', 'no-store');
  send(res, r.ok ? 200 : r.status, html);
};

function page(msg) {
  return `<!doctype html><meta charset="utf-8"><body style="font:16px system-ui;display:grid;place-items:center;height:100vh;margin:0;color:#7a7a77">${escAttr(msg)}</body>`;
}
function send(res, code, body) {
  res.statusCode = code;
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.end(body);
}

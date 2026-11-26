// Run locally without Vercel:  node dev-server.js   then open http://localhost:3000
const http = require('http');
const fs = require('fs');
const path = require('path');
const proxy = require('./api/proxy.js');

const PORT = process.env.PORT || 3000;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/api/proxy') return proxy(req, res);
  const file = path.join(__dirname, u.pathname === '/' ? 'index.html' : path.normalize(u.pathname));
  if (!file.startsWith(__dirname) || file.includes(path.sep + 'api' + path.sep)) { res.statusCode = 404; return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.statusCode = 404; return res.end('Not found'); }
    res.setHeader('content-type', TYPES[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
}).listen(PORT, () => console.log('Reflow Press on http://localhost:' + PORT));

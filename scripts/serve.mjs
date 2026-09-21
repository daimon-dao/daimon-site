// Serves ./out (the static export) with clean URLs, exactly as a static host would.
// Zero dependencies. Usage: npm run build && npm run preview   (PORT=3000 by default)
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const port = Number(process.env.PORT ?? 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function resolve(pathname) {
  const clean = normalize(decodeURIComponent(pathname));
  for (const candidate of [clean, `${clean}.html`, join(clean, "index.html")]) {
    const file = join(root, candidate);
    if (!file.startsWith(root)) continue;
    try {
      if ((await stat(file)).isFile()) return file;
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const file = (await resolve(pathname)) ?? join(root, "404.html");
  try {
    const body = await readFile(file);
    res.writeHead(file.endsWith("404.html") ? 404 : 200, {
      "content-type": types[extname(file)] ?? "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
  }
}).listen(port, () => {
  console.log(`Serving out/ at http://localhost:${port}`);
});

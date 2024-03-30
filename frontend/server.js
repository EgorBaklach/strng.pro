import fs from 'fs'
import express from 'express'
import {createServer} from 'vite'

const app = express()

const createFetchRequest = (request, response) =>
{
    const url = new URL(request.originalUrl || request.url, `${request.protocol}://${request.get("host")}`), controller = new AbortController(), headers = new Headers(), init = {method: request.method, headers, signal: controller.signal}

    response.on("close", () => controller.abort())

    for(const [key, values] of Object.entries(request.headers))
    {
        if(key === 'connection') continue; if(Array.isArray(values)) for (let value of values) headers.append(key, value); else if(values) headers.set(key, values);
    }

    if(request.method !== "GET" && request.method !== "HEAD") init.body = request.body; return new Request(url, init);
}

const vite = await createServer({
    server: {
        middlewareMode: true,
        hmr: false,
        https: {
            key: fs.readFileSync('/etc/letsencrypt/live/dev.arg.me/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/dev.arg.me/fullchain.pem'),
        }
    },
    appType: 'custom'
});

app.use(vite.middlewares);

app.use('*', async (request, response) =>
{
    try
    {
        const render = await vite.ssrLoadModule('./src/server.jsx').then(module => module.render(createFetchRequest(request, response)));

        const html = await vite.transformIndexHtml(request.originalUrl.replace('/', ''), fs.readFileSync('index.html', 'utf-8')).then(template => template
            .replace(`<!--app-head-->`, render.head ?? '')
            .replace(`<!--app-html-->`, render.html ?? '')
        );

        response.status(render.statusCode ?? 200).set({'Content-Type': 'text/html'}).end(html);
    }
    catch (e)
    {
        vite?.ssrFixStacktrace(e); response.status(500).end(e.stack);
    }
})

app.listen(3000, () => console.log('ready'));
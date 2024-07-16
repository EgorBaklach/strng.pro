import fs from 'fs'
import express from 'express'
import {createServer} from 'vite'
import { Server } from "socket.io";
import http from "http";

const isProduction = process.env.NODE_ENV === 'production', app = express(), server = http.createServer(app), io = new Server(server); let vite;

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

io.on("connection", socket => socket.on('call', props => io.emit('answer', props)));

if(!isProduction)
{
    vite = await createServer({
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
}

app.use('*', async (request, response) =>
{
    try
    {
        const render = await (!isProduction ? vite.ssrLoadModule('./src/server.jsx') : import('./src/server.js')).then(module => module.render(createFetchRequest(request, response)));

        const html = await (!isProduction ? vite.transformIndexHtml(request.originalUrl.replace('/', ''), fs.readFileSync('index.html', 'utf-8')) : fs.readFileSync('index.html', 'utf-8'));

        response.status(render.statusCode ?? 200).set({'Content-Type': 'text/html'}).end(html.replace(/<!--([a-zA-Z]+)-->/gi, (match, p1) => render[p1]));
    }
    catch (e)
    {
        !isProduction && vite.ssrFixStacktrace(e); response.status(500).end(e.stack);
    }
})

server.listen(3000, () => console.log('ready'));
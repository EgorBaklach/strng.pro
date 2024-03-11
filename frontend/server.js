import fs from 'fs'
import express from 'express'
import {createServer} from 'vite'

const app = express()

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
})

app.use(vite.middlewares)

app.use('*', async (request, response) =>
{
    try
    {
        const url = request.originalUrl.replace('/', '')

        const render = await vite.ssrLoadModule('./src/server.jsx').then(module => module.render(request))

        const html = await vite.transformIndexHtml(url, fs.readFileSync('index.html', 'utf-8')).then(template => template
            .replace(`<!--app-head-->`, render.head ?? '')
            .replace(`<!--app-html-->`, render.html ?? '')
        )

        response.status(render.statusCode ?? 200).set({ 'Content-Type': 'text/html' }).end(html)
    }
    catch (e)
    {
        vite?.ssrFixStacktrace(e)
        response.status(500).end(e.stack)
    }
})

app.listen(3000, () => console.log('ready'));
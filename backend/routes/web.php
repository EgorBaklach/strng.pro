<?php

use App\Controllers\Main;
use App\Controllers\Update;
use App\Middlewares\{CloseDBConnectionMiddleware, CredentialsMiddleware, ProfilerMiddleware};
use Framework\Routers\LeagueRouter;
use Psr\Container\ContainerInterface;

/** @var LeagueRouter $router */
/** @var ContainerInterface $container */

$router->middleware($container->get(CredentialsMiddleware::class));
$router->middleware($container->get(ProfilerMiddleware::class));
$router->middleware($container->get(CloseDBConnectionMiddleware::class));

////////////// GET

$router->get('/index.json', [Main::class, 'index']);

$router->get('/blog/index.json', [Main::class, 'blog']);
$router->get('/blog/{slug}/index.json', [Main::class, 'article']);

$router->get('/gallery/index.json', [Main::class, 'gallery']);
$router->get('/tag/{slug}/index.json', [Main::class, 'tag']);

$router->get('/about/index.json', [Main::class, 'about']);
$router->get('/about/stock/index.json', [Main::class, 'stock']);

////////////// POST

$router->post('/blog/{id}/{table}/update/index.json', [Update::class, 'social']);
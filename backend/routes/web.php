<?php

use App\Controllers\{Get, Controller, Post};
use App\Middlewares\{CloseDBConnectionMiddleware, CredentialsMiddleware, ProfilerMiddleware};
use Framework\Routers\LeagueRouter;
use Psr\Container\ContainerInterface;

/** @var LeagueRouter $router */
/** @var ContainerInterface $container */

$router->middleware($container->get(CredentialsMiddleware::class));
$router->middleware($container->get(ProfilerMiddleware::class));
$router->middleware($container->get(CloseDBConnectionMiddleware::class));

////////////// GET

$router->get('/index.json', [Controller::class, 'index']);

$router->get('/blog/index.json', [Controller::class, 'blog']);
$router->get('/blog/{slug}/index.json', [Controller::class, 'article']);

$router->get('/gallery/index.json', [Controller::class, 'gallery']);
$router->get('/tag/{slug}/index.json', [Controller::class, 'tag']);

$router->get('/about/index.json', [Controller::class, 'about']);
$router->get('/about/stock/index.json', [Controller::class, 'stock']);

$router->get('/stats/index.json', [Get::class, 'social']);

$router->get('/chat/messages/index.json', [Get::class, 'chat']);

$router->get('/me/index.json', [Get::class, 'user']);

////////////// POST

$router->post('/blog/{id}/{table}/update/index.json', [Post::class, 'social']);

$router->post('/{instance}/{operation}/index.json', [Post::class, 'dialog']);

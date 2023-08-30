<?php

use App\Extensions\AssetRender;
use Cli\Commands\HelloWorldCommand;
use Cli\Console\SymfonyConsole;
use Framework\Emitters\SapiEmitter;
use Framework\Handlers\ErrorResponseHandler;
use Framework\Routers\LeagueRouter;
use Framework\Strategies\ApplicationStrategy;
use Framework\Templates\Plates;
use League\Event\Emitter as Event;
use Magistrale\Caches\Phpfastcache;
use League\Container\Definition\{Definition, DefinitionAggregate};
use Phpfastcache\Drivers\Memcached\Config;

return new DefinitionAggregate([
    new Definition('dependencies', [
        'event' => Event::class,
        'cache' => Phpfastcache::class,
        'strategy' => ApplicationStrategy::class,
        'template' => Plates::class,
        'console' => SymfonyConsole::class,
        'handler' => ErrorResponseHandler::class,
        'emitter' => SapiEmitter::class,
        'router' => LeagueRouter::class
    ]),
    new Definition('cache', ['Memcached', Config::class]),
    new Definition('template', ['templates', 'php', [new AssetRender('public')]]),
    new Definition('listeners', []),
    new Definition('commands', [
        HelloWorldCommand::class
    ]),
    new Definition('databases', [
        'strng' => ["localhost", "root", "8PhB6vFzq616VXn", "strng", "utf8mb4"]
    ])
]);
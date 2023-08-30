<?php

use Cli\Console\ConsoleInterface;
use Cli\Inflectors\ConsoleInflector;
use Contracts\Router\RouterInterface;
use Framework\Inflectors\{InflectorAggregate, RouteInflector};

return new InflectorAggregate([
    RouterInterface::class => RouteInflector::class,
    ConsoleInterface::class => ConsoleInflector::class
]);
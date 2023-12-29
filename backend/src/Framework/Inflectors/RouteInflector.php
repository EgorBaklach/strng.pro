<?php namespace Framework\Inflectors;

use Contracts\Router\RouterInterface;
use Laminas\Stdlib\Glob;

class RouteInflector extends InflectorAbstract
{
    public function __invoke(RouterInterface $router)
    {
        $container = $this->aggregate->getContainer(); foreach (Glob::glob('routes/*.php', Glob::GLOB_BRACE, true) as $file) require $file;
    }
}
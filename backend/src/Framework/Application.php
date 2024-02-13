<?php namespace Framework;

use Contracts\Console\ConsoleInterface;
use Contracts\Emitter\EmitterInterface;
use League\Container\Container;
use League\Container\Definition\DefinitionAggregateInterface;
use League\Container\Inflector\InflectorAggregateInterface;
use League\Container\ReflectionContainer;
use League\Container\ServiceProvider\ServiceProviderAggregateInterface;

class Application
{
    /** @var Container */
    private $container;

    public function __construct(DefinitionAggregateInterface $definitions, InflectorAggregateInterface $inflectors, ServiceProviderAggregateInterface $providers)
    {
        $this->container = call_user_func([new Container($definitions, $providers, $inflectors), 'defaultToShared']);
    }

    public static function make(array $config): self
    {
        return new self(...$config);
    }

    public function run()
    {
        $this->container->delegate(new ReflectionContainer(true))->get(EmitterInterface::class);
    }

    public function cli()
    {
        $this->container->delegate(new ReflectionContainer(true))->get(ConsoleInterface::class)->run();
    }
}
<?php namespace Framework\Inflectors;

use Contracts\Inflector\InflectorAggregateInterface;
use League\Container\ContainerAwareTrait;
use League\Container\Inflector\Inflector;
use League\Container\Inflector\InflectorAggregateInterface as InflectorAggregateInterfaceLeague;
use Traversable;

class InflectorAggregate implements InflectorAggregateInterface, InflectorAggregateInterfaceLeague
{
    use ContainerAwareTrait;

    /** @var Inflector[] */
    private $inflectors = [];

    public function __construct(array $inflectors)
    {
        foreach($inflectors as $type => $inflector) $this->inflectors[] = $this->resolve($type, $inflector);
    }

    public function resolve(string $type, $inflector): Inflector
    {
        return new Inflector($type, $inflector instanceof InflectorAbstract ? $inflector : new $inflector($this));
    }

    public function add(string $type, callable $callback = null) : Inflector
    {
        return $this->inflectors[] = $this->resolve($type, $callback);
    }

    public function getIterator(): Traversable
    {
        yield from $this->inflectors;
    }

    public function inflect($object)
    {
        /** @var Inflector $inflector */
        foreach ($this->getIterator() as $inflector)
        {
            $type = $inflector->getType(); if(!$object instanceof $type) continue;

            $inflector->setContainer($this->getContainer()); $inflector->inflect($object);
        }

        return $object;
    }
}
<?php namespace Framework\Inflectors;

use Contracts\Inflector\{InflectorAggregateInterface, InflectorInterface};
use League\Container\Inflector\InflectorAggregateInterface as InflectorAggregateInterfaceLeague;
use Psr\Container\ContainerInterface;

abstract class InflectorAbstract implements InflectorInterface
{
    /** @var InflectorAggregateInterfaceLeague */
    protected $aggregate;

    public function __construct(InflectorAggregateInterface $aggregate)
    {
        $this->aggregate = $aggregate;
    }

    public function container(): ?ContainerInterface
    {
        return $this->aggregate->getContainer();
    }
}
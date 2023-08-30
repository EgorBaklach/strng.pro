<?php namespace Framework\Providers;

use Contracts\Provider\{ProviderAggregateInterface, ProviderInterface};
use League\Container\ServiceProvider\{AbstractServiceProvider, ServiceProviderAggregateInterface};
use Psr\Container\ContainerInterface;

abstract class ProviderAbstract extends AbstractServiceProvider implements ProviderInterface
{
    /** @var ServiceProviderAggregateInterface */
    private $aggregate;

    /** @var array */
    protected $provides;

    public function __construct(ProviderAggregateInterface $aggregate)
    {
        $this->aggregate = $aggregate;
    }

    public function container(): ?ContainerInterface
    {
        return $this->aggregate->getContainer();
    }

    public function provides(string $id): bool
    {
        return in_array($id, $this->provides);
    }
}
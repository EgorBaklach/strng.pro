<?php namespace App\Providers;

use Framework\Providers\ProviderAbstract;
use Psr\Container\ContainerInterface;

class AppProvider extends ProviderAbstract
{
    protected $provides = [ContainerInterface::class];

    public function register(): void
    {
        $this->container()->add(ContainerInterface::class, $this->container());
    }
}
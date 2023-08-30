<?php namespace App\Providers;

use Framework\Providers\ProviderAbstract;
use League\Container\ServiceProvider\BootableServiceProviderInterface;
use League\Event\EmitterInterface as EventInterface;

class EventProvider extends ProviderAbstract implements BootableServiceProviderInterface
{
    /** @var array */
    private $dependencies;

    /** @var array */
    private $listeners;

    protected $provides = [EventInterface::class];

    public function boot(): void
    {
        $this->dependencies = $this->container()->get('dependencies');
        $this->listeners = $this->container()->get('listeners');
    }

    public function register(): void
    {
        $this->container()->add(EventInterface::class, function()
        {
            $event = new $this->dependencies['event']; foreach($this->listeners as $listener) $event->useListenerProvider(new $listener($this->container())); return $event;
        });
    }
}
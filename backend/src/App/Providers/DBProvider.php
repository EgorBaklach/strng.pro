<?php namespace App\Providers;

use App\Middlewares\CloseDBConnectionMiddleware;
use Framework\Providers\ProviderAbstract;
use League\Container\ServiceProvider\BootableServiceProviderInterface;
use Magistrale\Databases\ORMStrng;
use Molecule\Connection;

class DBProvider extends ProviderAbstract implements BootableServiceProviderInterface
{
    /** @var array */
    private $accesses;

    protected $provides = ['database.strng', ORMStrng::class, CloseDBConnectionMiddleware::class];

    public function boot(): void
    {
        $this->accesses = $this->container()->get('databases');
    }

    public function register(): void
    {
        $this->container()->add('database.strng', Connection::class)->addArguments($this->accesses['strng']);
        $this->container()->add(ORMStrng::class)->addArgument('database.strng');

        $this->container()->add(CloseDBConnectionMiddleware::class)->addArguments(['database.strng']);
    }
}
<?php namespace Cli\Inflectors;

use Cli\Console\ConsoleInterface;
use Framework\Inflectors\InflectorAbstract;

class ConsoleInflector extends InflectorAbstract
{
    public function __invoke(ConsoleInterface $console)
    {
        $container = $this->aggregate->getContainer();

        foreach($container->get('commands') as $command)
        {
            $console->add($container->get($command));
        }
    }
}
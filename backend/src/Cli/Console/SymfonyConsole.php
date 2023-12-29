<?php namespace Cli\Console;

use Contracts\Console\CommandInterface;
use Contracts\Console\ConsoleInterface;
use Psr\Container\ContainerInterface;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Command\Command;

class SymfonyConsole extends Application implements ConsoleInterface
{
    /** @var ContainerInterface */
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container; parent::__construct('Application CLI', '1.0.0');
    }

    public function add($command): ?Command
    {
        $command = parent::add($command); if($command instanceof CommandInterface) $command->setContainer($this->container); return $command;
    }

    public function find(string $name): Command
    {
        $command = parent::find($name); if($command instanceof CommandInterface) $command->construct(); return $command;
    }
}

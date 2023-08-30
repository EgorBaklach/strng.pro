<?php namespace Cli\Console;

use Symfony\Component\Console\Application as Console;
use Symfony\Component\Console\Command\Command;

class SymfonyConsole implements ConsoleInterface
{
    /** @var Console */
    private $console;

    public function __construct()
    {
        $this->console = new Console('Application CLI', '1.0.0');
    }

    public function add($command): ?Command
    {
        return $this->console->add($command);
    }

    public function run(): int
    {
        return $this->console->run();
    }
}

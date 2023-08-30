<?php namespace Cli\Commands;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class HelloWorldCommand extends Command
{
    protected static $defaultName = 'hello:world';

    public function __construct()
    {
        parent::__construct();
    }

    protected function configure()
    {
        $this->setDescription('Outputs "Hello World"');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln('Hello World'); return Command::SUCCESS;
    }
}

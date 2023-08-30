<?php namespace Cli\Console;

interface ConsoleInterface
{
    public function add($command);
    public function run(): int;
}

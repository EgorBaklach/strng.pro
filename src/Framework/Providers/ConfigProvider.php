<?php namespace Framework\Providers;

use Generator;
use Laminas\Stdlib\Glob;

class ConfigProvider
{
    function __invoke(): Generator
    {
        foreach (Glob::glob('config/*.php', Glob::GLOB_BRACE, true) as $key => $file) yield [require $file];
    }
}
<?php namespace Framework\Templates;

use Contracts\Template\TemplateInterface;
use League\Plates\Engine;

class Plates implements TemplateInterface
{
    /** @var Engine  */
    private $engine;

    public function __construct()
    {
        $this->engine = new Engine();
    }

    public function init(string $path, string $extension = 'php', array $extensions = [])
    {
        $this->engine->setDirectory($path);
        $this->engine->setFileExtension($extension);
        $this->engine->loadExtensions($extensions);
    }

    public function render($name, array $params = []): string
    {
        return $this->engine->make($name)->render($params);
    }
}
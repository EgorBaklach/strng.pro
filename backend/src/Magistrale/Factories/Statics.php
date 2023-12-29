<?php namespace Magistrale\Factories;

use Psr\Container\ContainerInterface;

class Statics
{
    /** @var ContainerInterface */
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function get(string $name): StaticInterface
    {
        if(!$this->container->has($name))
        {
            $this->container->add($name, new class($name) implements StaticInterface
            {
                private const prefix = 'statics';

                /** @var string */
                private $path;

                public function __construct(string $name)
                {
                    $this->path = self::prefix.DIRECTORY_SEPARATOR.$name.'.php';
                }

                public function path(): ?string
                {
                    return $this->path;
                }

                public function require(): ?array
                {
                    return require $this->path;
                }
            });
        }

        return $this->container->get($name);
    }
}
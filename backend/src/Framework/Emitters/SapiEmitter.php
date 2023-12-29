<?php namespace Framework\Emitters;

use Contracts\Emitter\EmitterInterface;
use Contracts\Router\RouterInterface;
use Laminas\Diactoros\ServerRequestFactory;
use Laminas\HttpHandlerRunner\Emitter\SapiEmitter as SapiEmitterLaminas;

class SapiEmitter implements EmitterInterface
{
    /** @var SapiEmitterLaminas */
    private $emitter;

    public function __construct()
    {
        $this->emitter = new SapiEmitterLaminas;
    }

    public function emit(RouterInterface $router): bool
    {
        return $this->emitter->emit($router->dispatch(ServerRequestFactory::fromGlobals()));
    }
}

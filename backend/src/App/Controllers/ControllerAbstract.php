<?php namespace App\Controllers;

use App\Nodes\Articles;
use Contracts\Cache\RememberInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Magistrale\Factories\Statics;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

abstract class ControllerAbstract
{
    /** @var RememberInterface */
    private $cache;

    /** @var Articles */
    protected $articles;

    /** @var Statics */
    private $statics;

    public function __construct(ContainerInterface $container)
    {
        $this->cache = $container->get(RememberInterface::class);
        $this->articles = $container->get(Articles::class);
        $this->statics = $container->get(Statics::class);
    }

    public function __call($name, $arguments): ResponseInterface
    {
        /** @var ServerRequestInterface $request */ [$request, $arguments] = $arguments;

        return new JsonResponse($this->cache->remember('page_params_'.md5($request->getUri()->getPath()), 10, function() use ($name, $arguments)
        {
            $params = $this->statics->get($name)->require() + ['articles' => $this->articles->all()];

            return method_exists($this, $method = 'use'.ucfirst($name)) ? call_user_func([$this, $method], $params, $arguments) : $params;
        }));
    }
}
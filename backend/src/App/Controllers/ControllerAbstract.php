<?php namespace App\Controllers;

use App\Nodes\Articles;
use Laminas\Diactoros\Response\JsonResponse;
use Magistrale\Factories\Statics;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

abstract class ControllerAbstract
{
    /** @var Articles */
    protected $articles;

    /** @var Statics */
    private $statics;

    public function __construct(ContainerInterface $container)
    {
        $this->articles = $container->get(Articles::class);
        $this->statics = $container->get(Statics::class);
    }

    public function __call($name, $arguments): ResponseInterface
    {
        /** @var ServerRequestInterface $request */ [$request, $arguments] = $arguments;

        $server = $request->getServerParams(); $cookies = $request->getCookieParams(); $address = $server['HTTP_X_REAL_IP'] ?: $server['REMOTE_ADDR'];

        $data = $this->statics->get($name)->require() + ['uid' => $cookies['uid']] + compact('address') + $this->articles->articles();

        foreach($this->articles->stats($cookies['uid'] ?: ip2long($address)) as $field => $rs) while($v = $rs->fetch()) $data[$field][$v['aid']] = true;

        return new JsonResponse(method_exists($this, $method = 'use'.ucfirst($name)) ? call_user_func([$this, $method], $data, $arguments) : $data);
    }
}
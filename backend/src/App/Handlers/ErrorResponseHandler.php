<?php namespace App\Handlers;

use App\Nodes\Articles;
use Framework\Handlers\ErrorHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use League\Container\Container;
use League\Route\Http\Exception\HttpExceptionInterface;
use Magistrale\Factories\Statics;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Throwable;

class ErrorResponseHandler implements ErrorHandlerInterface
{
    /** @var Articles */
    private $articles;

    /** @var Statics */
    private $statics;

    public function __construct(Container $container)
    {
        $this->articles = $container->get(Articles::class);
        $this->statics = $container->get(Statics::class);
    }

    public function handle(ServerRequestInterface $request, Throwable $error): ResponseInterface
    {
        $status = $error instanceof HttpExceptionInterface ? $error->getStatusCode() : $error->getCode();

        $server = $request->getServerParams(); $cookies = $request->getCookieParams(); $address = $server['HTTP_X_REAL_IP'] ?: $server['REMOTE_ADDR'];

        $data = $this->statics->get(in_array($status, [404, 405]) ? $status : 500)->require() + ['uid' => $cookies['uid']] + compact('address') + $this->articles->articles();

        foreach($this->articles->stats($cookies['uid'] ?: ip2long($address)) as $field => $rs) while($v = $rs->fetch()) $data[$field][$v['aid']] = true;

        return new JsonResponse($data, $status);
    }
}
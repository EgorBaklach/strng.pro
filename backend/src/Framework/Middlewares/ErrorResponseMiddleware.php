<?php namespace Framework\Middlewares;

use Framework\Handlers\ErrorHandlerInterface;
use League\Route\Http\Exception\HttpExceptionInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Throwable;

class ErrorResponseMiddleware implements MiddlewareInterface
{
    /** @var ErrorHandlerInterface */
    private $handler;

    /** @var Throwable */
    private $error;

    public function __construct(ErrorHandlerInterface $handler, HttpExceptionInterface $error)
    {
        $this->handler = $handler;
        $this->error = $error;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        return $this->handler->handle($request, $this->error);
    }
}
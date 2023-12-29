<?php namespace App\Middlewares;

use Molecule\Connection;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CloseDBConnectionMiddleware implements MiddlewareInterface
{
    /** @var Connection[] */
    private $connections;

    public function __construct(...$connections)
    {
        $this->connections = $connections;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request); foreach ($this->connections as $connection) $connection->abort(); return $response;
    }
}

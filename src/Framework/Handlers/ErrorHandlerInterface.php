<?php namespace Framework\Handlers;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Throwable;

interface ErrorHandlerInterface
{
    public function handle(ServerRequestInterface $request, Throwable $error): ResponseInterface;
}

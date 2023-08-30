<?php namespace Framework\Handlers;

use Contracts\Template\TemplateInterface;
use League\Container\Container;
use League\Route\Http\Exception\HttpExceptionInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Throwable;

class ErrorResponseHandler implements ErrorHandlerInterface
{
    /** @var ResponseFactoryInterface */
    private $factory;

    /** @var TemplateInterface */
    private $engine;

    public function __construct(Container $container)
    {
        $this->factory = $container->get(ResponseFactoryInterface::class);
        $this->engine = $container->get(TemplateInterface::class);
    }

    public function handle(ServerRequestInterface $request, Throwable $error): ResponseInterface
    {
        $code = $error instanceof HttpExceptionInterface ? $error->getStatusCode() : $error->getCode(); $code = in_array($code, [404, 405]) ? $code : 500;

        $response = $this->factory->createResponse($code); $response->getBody()->write($this->engine->render($code, ['error' => $error]));

        return $response->withStatus($code, strtok($error->getMessage(), "\n"));
    }
}
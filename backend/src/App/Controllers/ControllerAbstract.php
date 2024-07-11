<?php namespace App\Controllers;

use Laminas\Diactoros\Response\JsonResponse;
use Magistrale\Databases\ORMStrng;
use Psr\Http\Message\{ResponseInterface, ServerRequestInterface};
use Throwable;

abstract class ControllerAbstract
{
    /** @var ORMStrng */
    protected $strng;

    public function __construct(ORMStrng $strng)
    {
        $this->strng = $strng;
    }

    public function __call($name, $arguments): ResponseInterface
    {
        /** @var ServerRequestInterface $request */ [$request, $arguments] = $arguments; $cookies = $request->getCookieParams(); $server = $request->getServerParams();

        return new JsonResponse(...$this->handle($name, $cookies['uid'] ?: ip2long($server['HTTP_X_REAL_IP'] ?: $server['REMOTE_ADDR']), $arguments));
    }

    protected function handle($name, $uid, $arguments): array
    {
        try
        {
            return [call_user_func([$this, $name], $uid * 1, $arguments), 200];
        }
        catch (Throwable $e)
        {
            return [['abort' => true, 'message' => $e->getMessage()], 500];
        }
    }
}

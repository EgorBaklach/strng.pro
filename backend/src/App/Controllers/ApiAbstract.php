<?php namespace App\Controllers;

use Laminas\Diactoros\Response\JsonResponse;
use Magistrale\Databases\ORMStrng;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Throwable;

abstract class ApiAbstract
{
    /** @var ORMStrng */
    protected $strng;

    /** @var false|float|int */
    protected $uid;

    public function __construct(ORMStrng $strng)
    {
        $this->strng = $strng;
    }

    public function __call($name, $arguments): ResponseInterface
    {
        /** @var ServerRequestInterface $request */ [$request, $attibutes] = $arguments; $cookies = $request->getCookieParams(); $server = $request->getServerParams();

        $this->uid = (float) $cookies['uid'] ?: ip2long($server['HTTP_X_REAL_IP'] ?: $server['REMOTE_ADDR']);

        try
        {
            return new JsonResponse(call_user_func([$this, $name], $attibutes), 200);
        }
        catch (Throwable $e)
        {
            return new JsonResponse(['abort' => true, 'message' => $e->getMessage()], 500);
        }
    }
}

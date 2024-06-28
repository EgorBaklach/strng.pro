<?php namespace App\Controllers;

use Laminas\Diactoros\Response\JsonResponse;
use Magistrale\Databases\ORMStrng;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Get
{
    private $strng;

    public function __construct(ORMStrng $strng)
    {
        $this->strng = $strng;
    }

    function social(ServerRequestInterface $request): ResponseInterface
    {
        $cookies = $request->getCookieParams(); $server = $request->getServerParams(); $stats = [];

        $uid = (float) $cookies['uid'] ?: ip2long($server['HTTP_X_REAL_IP'] ?: $server['REMOTE_ADDR']);

        foreach(['visits', 'likes'] as $table)
        {
            $rs = $this->strng->table($table)->where(['uid=' => $uid])->select(['aid'])->exec(); while($aid = $rs->fetchColumn()) $stats[$table][$aid] = true;
        }

        return new JsonResponse($stats, 200);
    }
}

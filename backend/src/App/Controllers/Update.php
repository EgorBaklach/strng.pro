<?php namespace App\Controllers;

use ErrorException;
use Laminas\Diactoros\Response\JsonResponse;
use Magistrale\Databases\ORMStrng;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Throwable;

class Update
{
    /** @var ORMStrng */
    private $strng;

    public function __construct(ORMStrng $strng)
    {
        $this->strng = $strng;
    }

    function social(ServerRequestInterface $request, array $arguments): ResponseInterface
    {
        $cookies = $request->getCookieParams(); $server = $request->getServerParams(); $table = $this->strng->table($arguments['table']);

        $uid = (float) $cookies['uid'] ?: ip2long($server['HTTP_X_REAL_IP'] ?: $server['REMOTE_ADDR']);

        $post = json_decode(file_get_contents('php://input'), true, 512, JSON_BIGINT_AS_STRING); $value = $post['value'];

        try
        {
            switch(true)
            {
                case $uid < 0 || $uid > 4294967295: throw new ErrorException('UID is Not Corrected');
                case !in_array($value, [-1, 1]) || ($value === -1 && $arguments['table'] === 'visits'): throw new ErrorException('Value is Not Corrected');
            }

            switch($value)
            {
                case 1: $table->insert(['aid' => $arguments['id'], 'uid' => $uid])->exec(); break;
                case -1: if(!$table->where(['aid=' => $arguments['id'], 'uid=' => $uid])->delete()->exec()->rowCount()) throw new ErrorException('User dont have values yet'); break;
            }

            $this->strng->table('articles')->where(['id=' => $arguments['id']])->update(['cnt_'.$arguments['table'].'=cnt_'.$arguments['table'].'+'.$value])->exec();
        }
        catch (Throwable $e)
        {
            return new JsonResponse(['abort' => true, 'message' => $e->getMessage()], 500);
        }

        return new JsonResponse(['success' => true] + compact('uid'), 200);
    }
}
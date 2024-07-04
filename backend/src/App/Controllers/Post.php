<?php namespace App\Controllers;

use ErrorException;
use Helpers\Log;

class Post extends ApiAbstract
{
    /** @throws ErrorException */
    protected function social($attibutes): array
    {
        $table = $this->strng->table($attibutes['table']); $post = json_decode(file_get_contents('php://input'), true, 512, JSON_BIGINT_AS_STRING); $value = $post['value'];

        switch(true)
        {
            case $this->uid < 0 || $this->uid > 4294967295: throw new ErrorException('UID is Not Corrected');
            case !in_array($value, [-1, 1]) || ($value === -1 && $attibutes['table'] === 'visits'): throw new ErrorException('Value is Not Corrected');
        }

        switch($value)
        {
            case 1: $table->insert(['aid' => $attibutes['id'], 'uid' => $this->uid])->exec(); break;
            case -1: if(!$table->where(['aid=' => $attibutes['id'], 'uid=' => $this->uid])->delete()->exec()->rowCount()) throw new ErrorException('User dont have values yet'); break;
        }

        $this->strng->table('articles')->where(['id=' => $attibutes['id']])->update(['cnt_'.$attibutes['table'].'=cnt_'.$attibutes['table'].'+'.$value])->exec();

        return ['success' => true, 'uid' => $this->uid];
    }

    /** @throws ErrorException */
    protected function chat($attributes): array
    {
        $table = $this->strng->table('chat'); $result = [];

        switch($attributes['operation'])
        {
            case 'message':

                [$name, $text, $id] = json_decode(file_get_contents('php://input'), true, 512, JSON_BIGINT_AS_STRING); [$day, $time] = explode(' ', $date = date('Y-m-d H:i:s')); Log::add2log($id);

                $this->strng->table('users')->insert(['uid' => $this->uid, 'name' => $name])->onDuplicate(['name' => 'values(name)'] + (!$id ? ['counter' => 'counter + 1'] : []))->exec();

                $table->insert(['uid' => $this->uid] + compact('id', 'date', 'text'))->onDuplicate(['text' => 'values(text)'])->exec();

                $result = ['id' => $id ?? $table->connection()->lastInsertId()] + compact('date', 'name', 'text', 'day', 'time');

                break;

            case 'delete':

                if(!$table->where(['uid=' => $this->uid, 'id=' => $id = file_get_contents('php://input') * 1])->delete()->exec()->rowCount()) throw new ErrorException('Internal Error');

                $this->strng->table('users')->where(['uid=' => $this->uid])->update(['counter=counter - 1'])->exec();

                $result = compact('id');

                break;
        }

        return ['success' => true, 'uid' => $this->uid] + $result;
    }
}
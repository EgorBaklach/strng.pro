<?php namespace App\Controllers;

use App\Nodes\Articles;
use ErrorException;
use Molecule\ORM;

class Post extends ControllerAbstract
{
    /** @throws ErrorException */
    protected function social($uid, $attibutes): array
    {
        $table = $this->strng->table($attibutes['table']); $value = json_decode(file_get_contents('php://input'), true, 512, JSON_BIGINT_AS_STRING) * 1;

        switch(true)
        {
            case $uid < 0 || $uid > 4294967295: throw new ErrorException('UID is Not Corrected');
            case !in_array($value, [-1, 1]) || ($value === -1 && $attibutes['table'] === 'visits'): throw new ErrorException('Value is Not Corrected');
        }

        switch($value)
        {
            case 1: $table->insert(['aid' => $attibutes['id']] + compact('uid'))->exec(); break;
            case -1: if(!$table->where(['aid=' => $attibutes['id'], 'uid=' => $uid])->delete()->exec()->rowCount()) throw new ErrorException('User dont have values yet'); break;
        }

        $this->strng->table('articles')->where(['id=' => $attibutes['id']])->update(['cnt_'.$attibutes['table'].'=cnt_'.$attibutes['table'].'+'.$value])->exec();

        return ['success' => true] + compact('uid');
    }

    private function table(string $name): ?ORM
    {
        return $this->strng->get($name) ?? $this->strng->set($name);
    }

    /** @throws ErrorException */
    protected function dialog($uid, $attributes): array
    {
        $result = compact('uid'); $post = json_decode(file_get_contents('php://input'), true, 512, JSON_BIGINT_AS_STRING); $aid = array_pop($post); $value = null;

        $table = $this->table($attributes['instance'] === 'comments' ? Articles::prefix.$aid : $attributes['instance']);

        switch($attributes['operation'])
        {
            case 'message':

                [$name, $text, $id] = $post; [$day, $time] = explode(' ', $date = date('Y-m-d H:i:s')); if(!$id) $value = 1;

                $this->strng->table('users')->insert(compact('uid', 'name'))->onDuplicate(['name' => 'values(name)'] + (!$id ? ['counter' => 'counter + 1'] : []))->exec();

                $table->insert(compact('uid', 'id', 'date', 'text'))->onDuplicate(['text' => 'values(text)'])->exec();

                $result += ['id' => $id ?? $table->connection()->lastInsertId()] + compact('date', 'name', 'text', 'day', 'time');

                break;

            case 'delete':

                if(!$table->where(['uid=' => $uid, 'id=' => $id = array_shift($post) * 1])->delete()->exec()->rowCount()) throw new ErrorException('Internal Error');

                $this->strng->table('users')->where(['uid=' => $uid])->update(['counter=counter - 1'])->exec(); $value = -1; $result += compact('id'); break;
        }

        if($attributes['instance'] === 'comments' && $value !== null) $this->strng->table('articles')->where(['id=' => $aid])->update(['cnt_comments=cnt_comments+'.$value])->exec();

        return ['success' => true] + $result;
    }
}
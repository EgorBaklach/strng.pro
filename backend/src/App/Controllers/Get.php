<?php namespace App\Controllers;

use App\Helpers\Convert;
use Helpers\Log;

class Get extends ApiAbstract
{
    protected function social(): array
    {
        $values = [];

        foreach(['visits', 'likes'] as $table)
        {
            $rs = $this->strng->table($table)->where(['uid=' => $this->uid])->select(['aid'])->exec(); while($aid = $rs->fetchColumn()) $values[$table][$aid] = true;
        }

        return $values;
    }

    protected function user(): array
    {
        return $this->strng->table('users')->where(['uid=' => $this->uid])->select()->exec()->fetch() ?: ['uid' => $this->uid];
    }

    protected function chat(): array
    {
        $rs = $this->strng->table('chat')
            ->dependence('users', 'LEFT', ['1:uid=' => '0:uid'])
            ->order(['0:date' => 'DESC'])
            ->limit(50)
            ->select([
                '0:id as id',
                '0:uid as uid',
                '0:date as date',
                '1:name as name',
                '1:role as role',
                '0:text as text'
            ])->exec();

        $values = []; $nid = 'id:0';

        while($message = $rs->fetch())
        {
            [$message['day'], $message['time']] = explode(' ', $message['date']);

            if(array_key_exists($nid, $values) && $values[$nid]['day'] !== $message['day']) $values[$nid]['date_break'] = Convert::month($values[$nid]['date']);

            if($this->uid === (float) $message['uid']) $message['me'] = true; unset($message['uid']); $values[$nid = 'id:'.$message['id']] = $message;
        }

        $values[$nid]['date_break'] = Convert::month($values[$nid]['date']); return $values;
    }
}

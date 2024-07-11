<?php namespace App\Controllers;

use App\Helpers\Convert;

class Get extends ControllerAbstract
{
    protected function social($uid): array
    {
        $values = [];

        foreach(['visits', 'likes'] as $table)
        {
            $rs = $this->strng->table($table)->where(['uid=' => $uid])->select(['aid'])->exec(); while($aid = $rs->fetchColumn()) $values[$table][$aid] = true;
        }

        return $values;
    }

    protected function user($uid): array
    {
        return $this->strng->table('users')->where(['uid=' => $uid])->select()->exec()->fetch() ?: compact('uid');
    }

    protected function chat($uid): ?array
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

        $values = null; $nid = 'id:0';

        while($message = $rs->fetch())
        {
            [$message['day'], $message['time']] = explode(' ', $message['date']);

            if(array_key_exists($nid, $values) && $values[$nid]['day'] !== $message['day']) $values[$nid]['date_break'] = Convert::month($values[$nid]['day']);

            if($uid === $message['uid'] * 1) $message['me'] = true; unset($message['uid']); $values[$nid = 'id:'.$message['id']] = $message;
        }

        if(count($values)) $values[$nid]['date_break'] = Convert::month($values[$nid]['day']); return $values;
    }
}

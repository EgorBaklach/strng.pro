<?php namespace App\Nodes;

use App\Helpers\Convert;
use Contracts\Cache\RememberInterface;
use Magistrale\Databases\ORMStrng;
use PDOStatement;

class Articles
{
    /** @var ORMStrng */
    private $strng;

    /** @var RememberInterface */
    private $cache;

    /** @var array */
    private $result;

    /** @var int */
    private $uid;

    const prefix = 'comments_';

    public function __construct(ORMStrng $strng, RememberInterface $cache)
    {
        $this->strng = $strng; $this->cache = $cache;
    }

    public function setUid(int $uid): self
    {
        $this->uid = $uid; return $this;
    }

    public function gallery(): ?array
    {
        return array_filter($this->articles()['articles'], function($article)
        {
            return $article['props']['is_gallery'];
        });
    }

    public function comments($id): ?array
    {
        if(!$table = $this->strng->get(self::prefix.$id)) return null; $values = null; $nid = 'id:0';

        $rs = $table
            ->dependence('users', 'LEFT', ['1:uid=' => '0:uid'])
            ->order(['0:date' => 'DESC'])
            ->limit(50)
            ->select([
                '0:id as id',
                '0:uid as uid',
                '0:date as date',
                '0:name as name',
                '1:role as role',
                '0:text as text'
            ])->exec();

        while($message = $rs->fetch())
        {
            [$message['day'], $message['time']] = explode(' ', $message['date']);

            if(array_key_exists($nid, $values) && $values[$nid]['day'] !== $message['day']) $values[$nid]['date_break'] = Convert::month($values[$nid]['day']);

            if($this->uid === $message['uid'] * 1) $message['me'] = true; unset($message['uid']); $values[$nid = 'id:'.$message['id']] = $message;
        }

        if(count($values)) $values[$nid]['date_break'] = Convert::month($values[$nid]['day']); return array_reverse($values, true);
    }

    public function __call($name, $arguments)
    {
        $this->result = []; [$hash] = $arguments;

        return $this->cache->remember(implode('_', array_filter([$name, $hash])), 5, function() use ($name, $arguments)
        {
            $rs = call_user_func([$this, $name], ...$arguments); $as = [];

            while($article = $rs->fetch())
            {
                foreach(scandir($path = 'storage/pictures/'.$article['slug']) as $value)
                {
                    if(!in_array($value, ['.', '..']) && $name = pathinfo($path.'/'.$value, PATHINFO_FILENAME))
                    {
                        $article['pictures'][$name] = '/pictures/'.$article['slug'].'/'.$value;
                    }
                }

                $article['date'] = Convert::month(...explode(' ', $article['date_update'] ?: $article['date_insert']));

                $article['props'] = json_decode($article['props'], true, 512, JSON_BIGINT_AS_STRING);

                $this->result['articles'][$as[$article['id']] = $article['slug']] = $article;
            }

            if(count($this->result['articles']))
            {
                $rs = $this->strng->table('a2t')
                    ->dependence('tags', 'LEFT', ['0:tid=' => '1:id'])
                    ->where(['0:aid in ' => array_keys($as)])
                    ->order(['0:aid', '0:tid'])
                    ->select([
                        '0:aid as aid',
                        '0:tid as tid',
                        '1:name as name',
                        '1:slug as slug'
                    ])
                    ->exec();

                while($a2t = $rs->fetch()) $this->result['articles'][$as[$a2t['aid']]]['tags'][$a2t['tid']] = $a2t;
            }

            return array_key_exists('articles', $this->result) ? $this->result : null;
        });
    }

    private function articles(): PDOStatement
    {
        return $this->strng->table('articles')
            ->where(['active=' => 'Y'])
            ->order(['date_insert' => 'DESC'])
            ->limit(100)
            ->select()
            ->exec();
    }

    private function tag(string $slug): PDOStatement
    {
        $database = $this->strng; $tag = $database->table('tags')->where(['slug=' => $slug])->select()->exec()->fetch();

        $rs = $database->table('articles')
            ->dependence('a2t', 'LEFT', ['0:id=' => '1:aid'])
            ->where(['0:active=' => 'Y', '1:tid=' => $tag['id']])
            ->order(['0:date_insert' => 'DESC'])
            ->limit(100)
            ->select()
            ->exec();

        if($rs->rowCount()) $this->result = $tag; return $rs;
    }
}
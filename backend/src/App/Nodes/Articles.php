<?php namespace App\Nodes;

use Contracts\Cache\RememberInterface;
use Helpers\Log;
use Magistrale\Databases\ORMStrng;
use PDOStatement;

/**
 * @method array articles(...$attibutes);
 * @method array tag(...$attibutes);
 */
class Articles
{
    /** @var ORMStrng */
    private $strng;

    /** @var RememberInterface */
    private $cache;

    /** @var array */
    private $result;

    private const months = [1 => 'Января', 2 => 'Февраля', 3 => 'Марта', 4 => 'Апреля', 5 => 'Мая', 6 => 'Июня', 7 => 'Июля', 8 => 'Августа', 9 => 'Сентября', 10 => 'Октября', 11 => 'Ноября', 12 => 'Декабря'];

    public function __construct(ORMStrng $strng, RememberInterface $cache)
    {
        $this->strng = $strng; $this->cache = $cache;
    }

    private function month($matches): string
    {
        [$match, $replace] = $matches; return self::months[$replace];
    }

    public function gallery(): ?array
    {
        return array_filter($this->articles()['articles'], function($article)
        {
            return $article['props']['is_gallery'];
        });
    }

    public function __call($name, $arguments)
    {
        if(!method_exists($this, $method = 'get'.ucfirst($name))) return null; $this->result = []; [$hash] = $arguments;

        return $this->cache->remember(implode('_', array_filter([$name, $hash])), 10, function() use ($method, $arguments)
        {
            $rs = call_user_func([$this, $method], ...$arguments); $as = [];

            while($article = $rs->fetch())
            {
                foreach(scandir($path = 'storage/pictures/'.$article['slug']) as $value)
                {
                    if(!in_array($value, ['.', '..']) && $name = pathinfo($path.'/'.$value, PATHINFO_FILENAME))
                    {
                        $article['pictures'][$name] = '/pictures/'.$article['slug'].'/'.$value;
                    }
                }

                $article['date'] = preg_replace_callback('/#(.*)#/i', [$this, 'month'], date('j \#n\# Y', strtotime($article['date_update'] ?: $article['date_insert'])));

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

            return $this->result;
        });
    }

    private function getArticles(): PDOStatement
    {
        return $this->strng->table('articles')
            ->where(['active=' => 'Y'])
            ->order(['date_insert' => 'DESC'])
            ->limit(100)
            ->select()
            ->exec();
    }

    private function getTag(string $slug): PDOStatement
    {
        $this->result = $this->strng->table('tags')->where(['slug=' => $slug])->select()->exec()->fetch();

        return $this->strng->table('articles')
            ->dependence('a2t', 'LEFT', ['0:id=' => '1:aid'])
            ->where(['0:active=' => 'Y', '1:tid=' => $this->result['id']])
            ->order(['0:date_insert' => 'DESC'])
            ->limit(100)
            ->select()
            ->exec();
    }
}
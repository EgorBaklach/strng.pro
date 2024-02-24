<?php namespace App\Nodes;

use Contracts\Cache\RememberInterface;
use Magistrale\Databases\ORMStrng;

class Articles
{
    /** @var ORMStrng */
    private $strng;

    /** @var RememberInterface */
    private $cache;

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
        return array_filter($this->all(), function($article)
        {
            return $article['props']['is_gallery'];
        });
    }

    public function article(string $slug): ?array
    {
        return $this->all()[md5($slug)];
    }

    public function all(int $limit = 100): array
    {
        return $this->cache->remember('articles', 10, function() use ($limit)
        {
            $articles = []; $amd5s = [];

            $rs = $this->strng->table('articles')->where(['active=' => 'Y'])->order(['date_insert' => 'DESC'])->limit($limit)->select()->exec();

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

                $articles[$amd5s[$article['id']] = md5($article['slug'])] = $article;
            }

            if(count($articles))
            {
                $rs = $this->strng->table('a2t')
                    ->dependence('tags', 'LEFT', ['0:tid=' => '1:id'])
                    ->where(['0:aid in ' => array_keys($amd5s)])
                    ->order(['0:aid', '0:tid'])
                    ->select([
                        '0:aid as aid',
                        '0:tid as tid',
                        '1:name as name',
                        '1:slug as slug'
                    ])
                    ->exec();

                while($a2t = $rs->fetch()) $articles[$amd5s[$a2t['aid']]]['tags'][$a2t['tid']] = $a2t;
            }

            return $articles;
        });
    }
}
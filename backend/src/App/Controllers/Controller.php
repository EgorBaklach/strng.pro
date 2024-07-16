<?php namespace App\Controllers;

use App\Nodes\Articles;
use Contracts\Cache\RememberInterface;
use League\Route\Http\Exception\NotFoundException;
use Magistrale\Databases\ORMStrng;
use Magistrale\Factories\Statics;

class Controller extends ControllerAbstract
{
    /** @var Articles */
    private $articles;

    /** @var Statics */
    private $statics;

    public function __construct(ORMStrng $strng, Statics $statics, RememberInterface $cache)
    {
        parent::__construct($strng); $this->articles = new Articles($strng, $cache); $this->statics = $statics;
    }

    private function cleaner($value)
    {
        unset($value['content']); return $value;
    }

    protected function handle($name, $uid, $arguments): array
    {
        $data = $this->statics->get($name)->require() + compact('uid') + $this->articles->setUid($uid)->articles();

        if(method_exists($this, $name)) $data = call_user_func([$this, $name], $data, $arguments);

        return [['articles' => array_map([$this, 'cleaner'], $data['articles'])] + $data, 200];
    }

    private function article(array $data, array $arguments): array
    {
        if(!array_key_exists($arguments['slug'], $data['articles'])) throw new NotFoundException; $article = $data['articles'][$arguments['slug']];

        $og_title = htmlentities($page_title = $article['name']).' | strng.pro - Strong Elephant';

        $og_description = $description = htmlentities($article['announce']); $image = 'https://dev.arg.me'.$article['pictures'][1];

        return $article + $data + ['comments' => $this->articles->comments($article['id'])] + compact('page_title', 'og_title', 'image', 'og_description', 'description');
    }

    private function gallery(array $data): array
    {
        return $data + ['gallery' => array_filter($data['articles'], function($article)
        {
            return $article['props']['is_gallery'];
        })];
    }

    private function tag(array $data, array $arguments): array
    {
        if(!$tag = $this->articles->tag($arguments['slug'])) throw new NotFoundException;

        $og_title = htmlentities($page_title = $tag['name']).' | strng.pro - Strong Elephant'; $og_description = $description = htmlentities($tag['name']);

        return $data + compact('tag', 'page_title', 'og_title', 'og_description', 'description');
    }
}
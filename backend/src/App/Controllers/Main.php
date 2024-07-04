<?php namespace App\Controllers;

use App\Nodes\Articles;
use Laminas\Diactoros\Response\JsonResponse;
use League\Route\Http\Exception\NotFoundException;
use Magistrale\Factories\Statics;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Main
{
    /** @var Articles */
    private $articles;

    /** @var Statics */
    private $statics;

    public function __construct(Articles $articles, Statics $statics)
    {
        $this->articles = $articles; $this->statics = $statics;
    }

    public function __call($name, $arguments): ResponseInterface
    {
        /** @var ServerRequestInterface $request */ [$request, $arguments] = $arguments;

        $server = $request->getServerParams(); $cookies = $request->getCookieParams(); $address = $server['HTTP_X_REAL_IP'] ?: $server['REMOTE_ADDR'];

        $data = $this->statics->get($name)->require() + ['uid' => $cookies['uid'] ?: ip2long($address)] + compact('address') + $this->articles->articles();

        return new JsonResponse(method_exists($this, $name) ? call_user_func([$this, $name], $data, $arguments) : $data);
    }

    private function article(array $data, array $arguments): array
    {
        if(!array_key_exists($arguments['slug'], $data['articles'])) throw new NotFoundException; $article = $data['articles'][$arguments['slug']];

        $og_title = $page_title = $article['name'].' | Strong Elephant'; $og_description = $description = $article['announce'];

        return $article + $data + compact('page_title', 'og_title', 'og_description', 'description');
    }

    private function gallery(array $data): array
    {
        return $data + ['gallery' => $this->articles->gallery()];
    }

    private function tag(array $data, array $arguments): array
    {
        if(!$tag = $this->articles->tag($arguments['slug'])) throw new NotFoundException;

        $og_title = $page_title = $tag['name'].' | Strong Elephant'; $og_description = $description = $tag['name'];

        return $data + ['tag' => $tag] + compact('page_title', 'og_title', 'og_description', 'description');
    }
}
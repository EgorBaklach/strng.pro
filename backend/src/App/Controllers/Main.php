<?php namespace App\Controllers;

use League\Route\Http\Exception\NotFoundException;

class Main extends ControllerAbstract
{
    public function useArticle(array $data, array $arguments): array
    {
        if(!array_key_exists($arguments['slug'], $data['articles'])) throw new NotFoundException; $article = $data['articles'][$arguments['slug']];

        $og_title = $page_title = $article['name'].' | Strong Elephant'; $og_description = $description = $article['announce'];

        return $article + $data + compact('page_title', 'og_title', 'og_description', 'description');
    }

    public function useGallery(array $data): array
    {
        return $data + ['gallery' => $this->articles->gallery()];
    }

    public function useTag(array $data, array $arguments): array
    {
        if(!$tag = $this->articles->tag($arguments['slug'])) throw new NotFoundException;

        $og_title = $page_title = $tag['name'].' | Strong Elephant'; $og_description = $description = $tag['name'];

        return $data + ['tag' => $tag] + compact('page_title', 'og_title', 'og_description', 'description');
    }
}
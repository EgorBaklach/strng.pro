<?php namespace App\Controllers;

use League\Route\Http\Exception\NotFoundException;

class Main extends ControllerAbstract
{
    public function useArticle(array $params, array $arguments): array
    {
        if(!$article = $this->articles->article($arguments['slug'])) throw new NotFoundException;

        $og_title = $page_title = $article['name'].' | Strong Elephant'; $og_description = $description = $article['announce'];

        return $article + $params + compact('page_title', 'og_title', 'og_description', 'description');
    }
}
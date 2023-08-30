<?php namespace App\Controllers;

use Contracts\Template\TemplateInterface;
use Laminas\Diactoros\Response\HtmlResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Home
{
    /** @var TemplateInterface */
    private $template;

    public function __construct(TemplateInterface $engine)
    {
        $this->template = $engine;
    }

    public function __invoke(ServerRequestInterface $request): ResponseInterface
    {
        return new HtmlResponse($this->template->render('index'));
    }
}
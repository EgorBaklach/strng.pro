<?php namespace Magistrale\Factories;

interface StaticInterface
{
    public function path(): ?string;
    public function require(): ?array;
}
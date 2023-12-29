<?php namespace Magistrale\Databases;

use Molecule\ORM;
use Molecule\ORMFactory;

class ORMProxifier extends ORMFactory
{
    public function agents(): ORM
    {
        return $this->tables['agents'];
    }

    public function proxies(): ORM
    {
        return $this->tables['proxies'];
    }

    public function requests(): ORM
    {
        return $this->tables['requests'];
    }

    public function catalog(): ORM
    {
        return $this->tables['catalog'];
    }
}

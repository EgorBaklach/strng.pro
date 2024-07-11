<?php namespace Magistrale\Databases;

use Molecule\Connection;
use Molecule\ORM;
use Molecule\ORMFactory;

class ORMStrng extends ORMFactory
{
    /** @var Connection */
    private $connection;

    public function __construct(Connection $connection)
    {
        parent::__construct($connection); $this->connection = $connection;
    }

    public function get(string $name): ?ORM
    {
        return $this->tables[$name];
    }

    public function set(string $name): ?ORM
    {
        $this->connection->connection()->exec(str_replace('#TABLE#', $name, file_get_contents('storage/table.sql'))); return $this->tables[$name] = new ORM($name, $this->connection);
    }
}

<?php

use App\Providers\{AppProvider, CacheProvider, DBProvider, EventProvider};
use Cli\Providers\ServiceProvider as CliServiceProvider;
use Framework\Providers\ProviderAggregate;
use Framework\Providers\ServiceProvider;

return new ProviderAggregate([
    CliServiceProvider::class,
    ServiceProvider::class,
    EventProvider::class,
    CacheProvider::class,
    AppProvider::class,
    DBProvider::class
]);
<?php

use Framework\Providers\ConfigProvider;
use Laminas\ConfigAggregator\ConfigAggregator;

$aggregator = new ConfigAggregator([ConfigProvider::class]); return $aggregator->getMergedConfig();

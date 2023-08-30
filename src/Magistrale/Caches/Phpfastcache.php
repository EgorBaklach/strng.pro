<?php namespace Magistrale\Caches;

use Phpfastcache\Core\Pool\ExtendedCacheItemPoolInterface;
use Phpfastcache\Core\Item\ExtendedCacheItemInterface;
use Phpfastcache\Cluster\AggregatablePoolInterface;
use Contracts\Cache\RememberInterface;
use Phpfastcache\CacheManager;
use Traversable;
use DateTime;

class Phpfastcache implements RememberInterface
{
    /** @var AggregatablePoolInterface|ExtendedCacheItemPoolInterface  */
    private $cache;

    public function __construct($driver, $config)
    {
        $this->cache = CacheManager::getInstance($driver, new $config);
    }

    public function get($key, $default = null)
    {
        $cacheItem = $this->cache->getItem($key); return !$cacheItem->isExpired() && $cacheItem->get() !== null ? $cacheItem->get() : $default;
    }

    public function set($key, $value, $ttl = null): bool
    {
        $cacheItem = $this->cache->getItem($key)->set($value);

        if ($ttl === null) $cacheItem->expiresAt((new DateTime('@0'))); elseif (is_int($ttl) && intval($ttl)) $cacheItem->expiresAfter($ttl);

        return $this->cache->save($cacheItem);
    }

    public function delete($key): bool
    {
        return $this->cache->deleteItem($key);
    }

    public function clear(): bool
    {
        return $this->cache->clear();
    }

    public function getMultiple($keys, $default = null)
    {
        if ($keys instanceof Traversable) $keys = iterator_to_array($keys);

        return array_map(static function (ExtendedCacheItemInterface $item) { return $item->get(); }, $this->cache->getItems($keys));
    }

    public function setMultiple($values, $ttl = null): bool
    {
        foreach ($values as $key => $value)
        {
            $cacheItem = $this->cache->getItem($key)->set($value);

            if ($ttl === null) $cacheItem->expiresAt((new DateTime('@0'))); elseif (is_int($ttl) && intval($ttl)) $cacheItem->expiresAfter($ttl);

            $this->cache->saveDeferred($cacheItem); unset($cacheItem);
        }

        return $this->cache->commit();
    }

    public function deleteMultiple($keys): bool
    {
        if ($keys instanceof Traversable) $keys = iterator_to_array($keys); return $this->cache->deleteItems($keys);
    }

    public function has($key): bool
    {
        $cacheItem = $this->cache->getItem($key); return $cacheItem->isHit() && !$cacheItem->isExpired();
    }

    public function forever($key, callable $callback)
    {
        return $this->remember($key, 0, $callback);
    }

    public function remember($key, ?int $ttl, callable $callback)
    {
        $cacheItem = $this->cache->getItem($key);

        if (!$cacheItem->isHit())
        {
            $cacheItem->set($callback());

            if ($ttl === null) $cacheItem->expiresAt((new DateTime('@0'))); else $cacheItem->expiresAfter($ttl);

            $this->cache->save($cacheItem);
        }

        return $cacheItem->get();
    }
}
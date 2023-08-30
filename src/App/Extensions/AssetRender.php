<?php namespace App\Extensions;

use League\Plates\Engine;
use League\Plates\Extension\Asset;
use League\Plates\Extension\ExtensionInterface;

class AssetRender implements ExtensionInterface
{
    use Traits\Dom;

    /** @var array */
    private $assets = [];

    /** @var Asset */
    private $asset;

    public function __construct(string $path = 'public')
    {
        $this->asset = new Asset($path);
    }

    public function register(Engine $engine)
    {
        $engine->registerFunction('group', [$this, 'group']);
        $engine->registerFunction('get', [$this, 'get']);
    }

    public function get($url)
    {
        if(!array_key_exists($url, $this->assets)) $this->add($url); return $this->assets[$url];
    }

    private function add(string $url)
    {
        $this->assets[$url] = ([$this, pathinfo($url, PATHINFO_EXTENSION)])($this->asset->cachedAssetUrl($url));
    }

    protected function js($url)
    {
        return self::addContainer('script', false, ['type' => 'text/javascript', 'src' => $url]);
    }

    protected function css($url)
    {
        return self::addLoner('link', ['type' => 'text/css', 'rel' => 'stylesheet', 'href' => $url]);
    }

    public function group(array $urls)
    {
        $new = []; foreach($urls as $url) $new[] = $this->get($url); return implode(PHP_EOL, $new);
    }
}
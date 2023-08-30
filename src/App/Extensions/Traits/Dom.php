<?php namespace App\Extensions\Traits;

use Helpers\Corrector;

trait Dom
{
    public static function addLoner($tag, array $attr = [])
    {
        return '<'.$tag.self::attributes($attr).'/>';
    }

    public static function addContainer($tag, $content = '', array $attr = [])
    {
        return '<'.$tag.self::attributes($attr).'>'.$content.'</'.$tag.'>';
    }

    private static function attributes(array $attributes)
    {
        if(empty($attributes)) return false; $data = [''];

        foreach($attributes as $name => $value) $data[] = is_int($name) ? $name : $name.'='.Corrector::Framing($value, '"');

        return implode(' ', $data);
    }
}

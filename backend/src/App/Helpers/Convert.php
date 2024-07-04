<?php namespace App\Helpers;

class Convert
{
    private const months = [
        1 => 'Января',
        2 => 'Февраля',
        3 => 'Марта',
        4 => 'Апреля',
        5 => 'Мая',
        6 => 'Июня',
        7 => 'Июля',
        8 => 'Августа',
        9 => 'Сентября',
        10 => 'Октября',
        11 => 'Ноября',
        12 => 'Декабря'
    ];

    static public function month(string $data): string
    {
        $convert = function($matches)
        {
            [$match, $replace] = $matches; return self::months[$replace];
        };

        return preg_replace_callback('/#(.*)#/i', $convert, date('j \#n\# Y', strtotime($data)));
    }
}

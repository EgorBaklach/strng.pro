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

    static public function month(string $day): string
    {
        [$y, $m, $d] = explode('-', $day); return implode(' ', [$d * 1, self::months[$m * 1], $y]);
    }
}

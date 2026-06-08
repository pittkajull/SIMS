<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InfusionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'infusion_id',
        'volume_recorded',
        'tpm',
    ];

    public function infusion()
    {
        return $this->belongsTo(Infusion::class);
    }
}
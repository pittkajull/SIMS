<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('infusions', function (Blueprint $table) {
            $table->integer('tpm_target')->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('infusions', function (Blueprint $table) {
            $table->integer('tpm_target')->nullable(false)->change();
        });
    }
};

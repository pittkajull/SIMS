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
        Schema::table('infusion_logs', function (Blueprint $table) {
            $table->float('tpm')->default(0)->after('volume_recorded');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('infusion_logs', function (Blueprint $table) {
            $table->dropColumn('tpm');
        });
    }
};

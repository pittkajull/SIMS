<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Infusion;
use App\Models\InfusionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class InfusionController extends Controller
{
    public function updateStatus(Request $request, $id)
    {
        $startTime = microtime(true);

        // ========== LOG: Data Masuk dari ESP32 ==========
        Log::channel('infusion')->info('=== DATA MASUK DARI DEVICE ===', [
            'infusion_id' => $id,
            'raw_body' => $request->getContent(),
            'parsed' => $request->all(),
            'ip' => $request->ip(),
            'timestamp' => now()->toDateTimeString(),
        ]);

        $infusion = Infusion::find($id);
        if (!$infusion) {
            Log::channel('infusion')->error('Infusion TIDAK DITEMUKAN', ['id' => $id]);
            return response()->json(['status' => 'error', 'message' => 'Infusion not found'], 404);
        }

        // Terima TPM (tetesan per menit) dari device
        $tpm = (float) $request->input('tpm', 0);

        // Drop factor: Makro = 20 tetes/ml, Mikro = 60 tetes/ml
        $dropFactor = (strtolower($infusion->drip_type) === 'mikro') ? 60 : 20;

        // Ambil log terakhir untuk hitung delta waktu & volume
        $lastLog = InfusionLog::where('infusion_id', $id)->latest('created_at')->first();
        $now = Carbon::now();

        $volumeConsumed = 0;

        if ($lastLog) {
            // Hitung volume yang masuk sejak log terakhir berdasarkan TPM
            $elapsedSeconds = Carbon::parse($lastLog->created_at)->diffInSeconds($now);
            $elapsedMinutes = $elapsedSeconds / 60;

            // Volume = (TPM / drop_factor) * menit_berlalu
            $volumeConsumed = ($tpm / $dropFactor) * $elapsedMinutes;
            $currentRemaining = max(0, round($infusion->current_remaining - $volumeConsumed));

            // ========== LOG: Perhitungan Volume ==========
            Log::channel('infusion')->info('HITUNG VOLUME', [
                'last_log_at' => $lastLog->created_at,
                'now' => $now->toDateTimeString(),
                'elapsed_seconds' => $elapsedSeconds,
                'elapsed_minutes' => round($elapsedMinutes, 4),
                'tpm_received' => $tpm,
                'drop_factor' => $dropFactor,
                'volume_consumed' => round($volumeConsumed, 4),
                'prev_remaining' => $infusion->current_remaining,
                'new_remaining' => $currentRemaining,
            ]);
        } else {
            // Log pertama: tidak ada delta, sisa = total_volume
            $currentRemaining = $infusion->current_remaining;

            Log::channel('infusion')->info('LOG PERTAMA (tidak ada delta)', [
                'current_remaining' => $currentRemaining,
                'tpm_received' => $tpm,
            ]);
        }

        // Simpan ke database
        $infusion->current_remaining = $currentRemaining;
        $infusion->status = ($currentRemaining < ($infusion->total_volume * 0.1)) ? 'warning' : 'monitoring';
        $infusion->save();

        InfusionLog::create([
            'infusion_id' => $id,
            'volume_recorded' => $currentRemaining,
            'tpm' => $tpm,
        ]);

        $elapsed = round((microtime(true) - $startTime) * 1000, 2);

        // ========== LOG: Hasil Akhir ==========
        Log::channel('infusion')->info('=== DATA TERSIMPAN ===', [
            'infusion_id' => $id,
            'patient' => $infusion->patient_name,
            'room' => $infusion->room_number,
            'tpm' => $tpm,
            'drop_factor' => $dropFactor,
            'volume_consumed' => round($volumeConsumed, 2),
            'current_remaining' => $currentRemaining,
            'total_volume' => $infusion->total_volume,
            'percentage' => round(($currentRemaining / $infusion->total_volume) * 100, 1) . '%',
            'status' => $infusion->status,
            'process_time_ms' => $elapsed,
        ]);

        return response()->json([
            'status' => 'success',
            'current_remaining' => $currentRemaining,
            'tpm_received' => $tpm,
            'volume_consumed' => round($volumeConsumed, 2),
            'percentage' => round(($currentRemaining / $infusion->total_volume) * 100, 1),
        ]);
    }
}

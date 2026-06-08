<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Infusion;
use App\Models\InfusionLog;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    // ==========================================
    // PUSAT MONITORING (DASHBOARD)
    // ==========================================
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'infusions' => Infusion::whereNull('finished_at')->latest('start_time')->get()
        ]);
    })->name('dashboard');

    // ==========================================
    // MANAJEMEN INFUS
    // ==========================================
    
    // Simpan Pasien Baru
    Route::post('/infusions', function (Request $request) {
        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'room_number'  => 'required|string|max:50',
            'fluid_type'   => 'required|string|max:255',
            'total_volume' => 'required|numeric|min:1',
            'flowrate'     => 'required|numeric|min:1',
            'drip_type'    => 'required|in:Mikro,Makro,mikro,makro',
        ]);

        Infusion::create([
            'patient_name'      => $validated['patient_name'],
            'room_number'       => $validated['room_number'],
            'patient_group'     => Str::slug($validated['patient_name'] . '_' . $validated['room_number']),
            'infusion_number'   => 1,
            'fluid_type'        => $validated['fluid_type'],
            'total_volume'      => $validated['total_volume'],
            'current_remaining' => $validated['total_volume'],
            'flowrate'          => $validated['flowrate'],
            'drip_type'         => $validated['drip_type'],
            'tpm_target'        => 0,
            'start_time'        => now(),
            'status'            => 'monitoring',
        ]);

        return redirect()->route('dashboard');
    })->name('infusions.store');

    // Digital Charting / Rekap
    Route::get('/recap/{id}', function ($id) {
        $infusion = Infusion::findOrFail($id);
        $allInfusions = Infusion::where('patient_group', $infusion->patient_group)
            ->orderBy('infusion_number')
            ->get();
        $logs = InfusionLog::where('infusion_id', $id)
            ->latest()
            ->take(50)
            ->get();

        return Inertia::render('Recap', [
            'infusion'     => $infusion,
            'allInfusions' => $allInfusions,
            'logs'         => $logs,
        ]);
    })->name('infusions.recap');

    // Ganti Infus (tandai selesai + buat baru)
    Route::post('/infusions/{id}/ganti', function ($id) {
        $infusion = Infusion::findOrFail($id);
        if (!$infusion->isActive()) {
            return redirect()->back()->with('error', 'Infus sudah ditandai selesai.');
        }

        try {
            $newInfusion = $infusion->gantiInfus();
            if (!$newInfusion) {
                return redirect()->back()->with('error', 'Gagal membuat infus baru.');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }

        return redirect()->route('dashboard');
    })->name('infusions.ganti');

    // Hapus Monitoring
    Route::delete('/infusions/{id}', function ($id) {
        Infusion::findOrFail($id)->delete();
        return redirect()->back();
    })->name('infusions.destroy');

    // ==========================================
    // LOG VIEWER (DEBUG)
    // ==========================================
    Route::get('/logs', function () {
        $logPath = storage_path('logs/infusion.log');
        $logs = '';
        if (file_exists($logPath)) {
            $logs = file_get_contents($logPath);
        }
        return Inertia::render('LogViewer', [
            'logs' => $logs,
        ]);
    })->name('logs.viewer');

    // ==========================================
    // PENGATURAN PROFIL
    // ==========================================
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
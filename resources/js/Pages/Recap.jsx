import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, Suspense, useEffect } from 'react';
import InfusionModel from '@/Components/InfusionModel';
import {
    ChevronLeft, Clock, Activity, Droplet,
    FileText, Calendar, TrendingDown, Download,
    Filter, CheckCircle2, RefreshCw, Check
} from 'lucide-react';

export default function Recap({ auth, infusion, logs, allInfusions = [] }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // 1. LIVE SYNC: Refresh data otomatis tiap 2 detik supaya 3D-nya gerak real-time
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['infusion', 'logs'], preserveScroll: true });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // 2. RUMUS DIGITAL TWIN: Persentase sisa cairan untuk animasi 3D
    const percentage = (infusion.current_remaining / infusion.total_volume) * 100;

    // Filter logs berdasarkan tanggal
    const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.created_at).toISOString().split('T')[0];
        if (startDate && logDate < startDate) return false;
        if (endDate && logDate > endDate) return false;
        return true;
    });

    // Total volume yang sudah masuk ke pasien = total awal - sisa sekarang
    const totalVolumeAdministered = infusion.total_volume - infusion.current_remaining;

    // Hitung durasi antar log, delta volume per data point, dan akumulasi
    const enrichedLogs = filteredLogs.map((log, idx, arr) => {
        let duration = '-';
        let deltaVolume = 0; // volume yang masuk ke pasien sejak data point sebelumnya

        if (idx === 0) {
            // Log pertama: delta = total_volume - volume_recorded (volume terpakai dari awal sampai log pertama)
            deltaVolume = infusion.total_volume - (log.volume_recorded || 0);
        } else {
            const prevTime = new Date(arr[idx-1].created_at);
            const currTime = new Date(log.created_at);
            const diffMs = currTime - prevTime;
            const diffMinutes = Math.floor(diffMs / 60000);
            duration = diffMinutes > 0 ? `${diffMinutes} menit` : '< 1 menit';
            // Delta = sisa sebelumnya - sisa sekarang = volume yang masuk di antara 2 data point
            deltaVolume = (arr[idx-1].volume_recorded || 0) - (log.volume_recorded || 0);
        }

        // Akumulasi = total volume yang sudah masuk ke pasien sampai data point ini
        const accumulated = infusion.total_volume - (log.volume_recorded || 0);

        return { ...log, duration, deltaVolume: Math.max(0, deltaVolume), accumulated };
    });

    // Ekspor ke CSV
    const exportToCSV = () => {
        if (enrichedLogs.length === 0) {
            alert('Tidak ada data untuk diekspor.');
            return;
        }
        const headers = ['Waktu', 'Sisa Volume (ml)', 'Volume Masuk (ml)', 'Durasi', 'Total Terpakai (ml)'];
        const rows = enrichedLogs.map(log => [
            new Date(log.created_at).toLocaleString('id-ID'),
            log.volume_recorded,
            log.deltaVolume,
            log.duration,
            log.accumulated
        ]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `rekapitulasi_${infusion.patient_name}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Digital Charting - ${infusion.patient_name}`} />

            <div className="py-4 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-[1300px] mx-auto">
                
                {/* Custom Header Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition-all group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Dashboard
                    </Link>
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => {
                                if (confirm(`Ganti infus untuk ${infusion.patient_name}? Infus lama akan ditandai selesai.`)) {
                                    router.post(`/infusions/${infusion.id}/ganti`);
                                }
                            }}
                            className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                        >
                            <RefreshCw size={12} className="sm:w-3.5 sm:h-3.5" /> Ganti Infus
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                            <Download size={12} className="sm:w-3.5 sm:h-3.5" /> Ekspor CSV
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">

                    {/* SISI KIRI: DIGITAL TWIN 3D & INFO PASIEN (5 KOLOM) */}
                    <div className="lg:col-span-5 space-y-4 sm:space-y-6">

                        {/* 3D MODEL BOX */}
                        <div className="bg-white p-1.5 sm:p-2 rounded-3xl sm:rounded-[45px] shadow-sm border border-slate-100 overflow-hidden relative">
                            <Suspense fallback={
                                <div className="h-[250px] sm:h-[450px] w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold text-xs animate-pulse uppercase tracking-widest">
                                    Menghubungkan ke Perangkat IoT...
                                </div>
                            }>
                                {/* KIRIM PERCENTAGE & STATUS KE KOMPONEN 3D */}
                                <InfusionModel percentage={percentage} status={infusion.status} />
                            </Suspense>
                        </div>

                        {/* DETAIL PASIEN CARD */}
                        <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[35px] border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-3 sm:mb-4 flex items-center gap-2">
                                <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" /> Pasien Sedang Dipantau
                            </p>
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <h1 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tighter">{infusion.patient_name}</h1>
                                {infusion.infusion_number > 1 && (
                                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-amber-50 text-amber-600 text-[9px] sm:text-[10px] font-black tracking-widest border border-amber-100 uppercase">
                                        Infus ke-{infusion.infusion_number}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <span className="bg-slate-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-slate-700">BED {infusion.room_number}</span>
                                <span className="bg-emerald-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-emerald-600 uppercase">{infusion.fluid_type}</span>
                                <span className="bg-slate-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-slate-400 uppercase">{infusion.drip_type} SET</span>
                            </div>
                        </div>

                        {/* HISTORI GANTI INFUS */}
                        {allInfusions.length > 1 && (
                            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-[25px] border border-slate-100 shadow-sm">
                                <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 sm:mb-4 flex items-center gap-2">
                                    <RefreshCw size={12} className="text-amber-500" /> Histori Ganti Infus
                                </h3>
                                <div className="space-y-1.5 sm:space-y-2">
                                    {allInfusions.map((item) => {
                                        const isActive = item.id === infusion.id;
                                        const isFinished = item.finished_at !== null;
                                        const startTime = new Date(item.start_time);
                                        const endTime = item.finished_at ? new Date(item.finished_at) : new Date();
                                        const durationMin = Math.floor((endTime - startTime) / 60000);
                                        const hours = Math.floor(durationMin / 60);
                                        const mins = durationMin % 60;
                                        const durationStr = hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;

                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => router.get(`/recap/${item.id}`)}
                                                className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all text-left ${
                                                    isActive
                                                        ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                                                }`}
                                            >
                                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-black ${
                                                    isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                                                }`}>
                                                    {item.infusion_number}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs sm:text-sm font-bold text-slate-800">Infus ke-{item.infusion_number}</span>
                                                        {isActive && <span className="text-[8px] sm:text-[9px] font-black text-emerald-600 bg-emerald-100 px-1.5 sm:px-2 py-0.5 rounded uppercase">Aktif</span>}
                                                        {isFinished && <span className="text-[8px] sm:text-[9px] font-black text-slate-400 bg-slate-200 px-1.5 sm:px-2 py-0.5 rounded uppercase flex items-center gap-1"><Check size={8} /> Selesai</span>}
                                                    </div>
                                                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400">{item.total_volume}ml {item.fluid_type} • {durationStr}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* SISI KANAN: STATS & TIMELINE (7 KOLOM) */}
                    <div className="lg:col-span-7 space-y-4 sm:space-y-6">

                        {/* SUMMARY CARDS */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-4">
                            <div className="bg-white rounded-xl sm:rounded-[25px] p-3 sm:p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 transition-all hover:shadow-md">
                                <div className="p-2 sm:p-3 bg-emerald-50 text-emerald-500 rounded-lg sm:rounded-2xl"><Droplet size={16} className="sm:w-5 sm:h-5" /></div>
                                <div className="text-center sm:text-left"><p className="text-[8px] sm:text-[9px] font-bold uppercase text-slate-400 mb-0.5">Sisa Volume</p><p className="text-base sm:text-xl font-black text-slate-800">{infusion.current_remaining} <span className="text-[10px] sm:text-xs">ml</span></p></div>
                            </div>
                            <div className="bg-white rounded-xl sm:rounded-[25px] p-3 sm:p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 transition-all hover:shadow-md">
                                <div className="p-2 sm:p-3 bg-teal-50 text-teal-500 rounded-lg sm:rounded-2xl"><TrendingDown size={16} className="sm:w-5 sm:h-5" /></div>
                                <div className="text-center sm:text-left"><p className="text-[8px] sm:text-[9px] font-bold uppercase text-slate-400 mb-0.5">Total Masuk</p><p className="text-base sm:text-xl font-black text-slate-800">{totalVolumeAdministered} <span className="text-[10px] sm:text-xs">ml</span></p></div>
                            </div>
                            <div className="bg-white rounded-xl sm:rounded-[25px] p-3 sm:p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 transition-all hover:shadow-md">
                                <div className="p-2 sm:p-3 bg-slate-50 text-slate-500 rounded-lg sm:rounded-2xl"><Clock size={16} className="sm:w-5 sm:h-5" /></div>
                                <div className="text-center sm:text-left"><p className="text-[8px] sm:text-[9px] font-bold uppercase text-slate-400 mb-0.5">Estimasi</p><p className="text-[10px] sm:text-sm font-black text-slate-800">{infusion.estimated_time_remaining}</p></div>
                            </div>
                        </div>

                        {/* TIMELINE LOGS */}
                        <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-full min-h-[300px] sm:min-h-[500px]">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-slate-50 gap-3 sm:gap-0">
                                <h3 className="text-base sm:text-xl font-black text-slate-800 flex items-center gap-2 sm:gap-3">
                                    <Activity size={18} className="sm:w-[22px] sm:h-[22px] text-emerald-500" /> Histori Digital Charting
                                </h3>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-[10px] border-slate-100 rounded-lg px-2 py-1 bg-slate-50 font-bold outline-none flex-1 sm:flex-none" />
                                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-[10px] border-slate-100 rounded-lg px-2 py-1 bg-slate-50 font-bold outline-none flex-1 sm:flex-none" />
                                </div>
                            </div>

                            <div className="overflow-y-auto max-h-[400px] sm:max-h-[600px] pr-1 sm:pr-2 custom-scrollbar">
                                {enrichedLogs.length === 0 ? (
                                    <div className="text-center py-12 sm:py-20 bg-slate-50 rounded-2xl sm:rounded-[30px] border border-dashed border-slate-200">
                                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Tidak ada data tercatat</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 sm:space-y-4">
                                        {enrichedLogs.map((log, idx) => (
                                            <div key={log.id} className="flex gap-3 sm:gap-5 group animate-in slide-in-from-bottom-2 duration-300">
                                                <div className="w-1 sm:w-1.5 bg-slate-100 rounded-full group-hover:bg-emerald-400 transition-all duration-500"></div>
                                                <div className="flex-1 bg-slate-50 p-3 sm:p-5 rounded-xl sm:rounded-[22px] border border-slate-100 group-hover:border-emerald-200 group-hover:bg-white transition-all duration-300 shadow-sm">
                                                    <div className="flex justify-between items-center mb-0.5 sm:mb-1">
                                                        <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase">{new Date(log.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</span>
                                                        <span className="text-base sm:text-lg font-black text-emerald-600">+{log.deltaVolume} ml</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[10px] sm:text-xs font-bold text-slate-600">
                                                            {log.tpm > 0 && <span className="text-emerald-600">{log.tpm} TPM</span>}
                                                            {log.tpm > 0 && ' • '}
                                                            Sisa: {log.volume_recorded} ml • {log.duration} jeda
                                                        </p>
                                                        <p className="text-[8px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-widest">Total: {log.accumulated}ml</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Custom Scrollbar CSS */}
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}} />
        </AuthenticatedLayout>
    );
}
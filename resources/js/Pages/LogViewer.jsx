import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Terminal, RefreshCw, Trash2, ChevronDown } from 'lucide-react';

export default function LogViewer({ auth, logs = '' }) {
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(() => {
            router.reload({ only: ['logs'], preserveScroll: true });
        }, 3000);
        return () => clearInterval(interval);
    }, [autoRefresh]);

    const logLines = logs.split('\n').filter(line => line.trim());

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Log Viewer - SIMS Debug" />

            <div className="py-4 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 p-2 rounded-lg">
                            <Terminal className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800">Log Viewer</h1>
                            <p className="text-xs text-slate-500 font-bold">Data dari ESP32 → Laravel</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${
                                autoRefresh
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                    : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}
                        >
                            <RefreshCw size={12} className={`inline mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                            Auto Refresh: {autoRefresh ? 'ON' : 'OFF'}
                        </button>
                        <button
                            onClick={() => router.reload({ only: ['logs'], preserveScroll: true })}
                            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border border-slate-200 bg-white hover:bg-slate-50 transition-all"
                        >
                            <RefreshCw size={12} className="inline mr-1" /> Refresh
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
                    <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-xs font-mono text-slate-400">infusion.log</span>
                    </div>
                    <div className="p-4 overflow-auto max-h-[70vh] font-mono text-xs leading-relaxed">
                        {logLines.length === 0 ? (
                            <div className="text-slate-500 text-center py-10">
                                <p className="text-sm">Belum ada log.</p>
                                <p className="mt-1 text-xs">Kirim data dari ESP32 untuk melihat log di sini.</p>
                            </div>
                        ) : (
                            logLines.map((line, idx) => {
                                let color = 'text-slate-300';
                                if (line.includes('ERROR') || line.includes('TIDAK DITEMUKAN')) color = 'text-red-400';
                                else if (line.includes('=== DATA MASUK')) color = 'text-emerald-400 font-bold';
                                else if (line.includes('=== DATA TERSIMPAN')) color = 'text-cyan-400 font-bold';
                                else if (line.includes('HITUNG VOLUME')) color = 'text-yellow-400';
                                else if (line.includes('LOG PERTAMA')) color = 'text-blue-400';
                                else if (line.includes('INFO')) color = 'text-slate-300';

                                return (
                                    <div key={idx} className={`${color} hover:bg-slate-800/50 px-2 py-0.5 rounded`}>
                                        {line}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Warna Legend</p>
                        <div className="space-y-1 text-xs">
                            <p><span className="text-emerald-500 font-bold">■ Hijau</span> = Data masuk dari ESP32</p>
                            <p><span className="text-yellow-500 font-bold">■ Kuning</span> = Proses hitung volume</p>
                            <p><span className="text-cyan-500 font-bold">■ Biru Muda</span> = Data tersimpan</p>
                            <p><span className="text-red-500 font-bold">■ Merah</span> = Error</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Tips Debug</p>
                        <div className="space-y-1 text-xs text-slate-600">
                            <p>• Pastikan Laravel jalan di <code className="bg-slate-100 px-1 rounded">0.0.0.0:8000</code></p>
                            <p>• ESP32 & PC harus satu jaringan WiFi</p>
                            <p>• Cek IP PC dengan <code className="bg-slate-100 px-1 rounded">ipconfig</code></p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">File Log</p>
                        <div className="space-y-1 text-xs text-slate-600">
                            <p><code className="bg-slate-100 px-1 rounded">storage/logs/infusion.log</code></p>
                            <p>Log disimpan 7 hari, auto-rotate harian</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

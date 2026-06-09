import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, Link } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import { Activity, Droplet, AlertCircle, Users, Clock, Plus, X, FileText, HeartPulse, Stethoscope, Bell, RefreshCw, Terminal, User, LogOut, ChevronDown } from 'lucide-react';
import InfusionBag from '@/Components/InfusionBag';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Dashboard({ auth, infusions = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeNotifications, setActiveNotifications] = useState([]);
    const previousCriticalIdsRef = useRef([]);
    const alarmIntervalsRef = useRef({});

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['infusions'], preserveScroll: true });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Cari pasien yang BARU masuk status kritis (sebelumnya bukan warning, sekarang warning)
        const currentCriticalIds = infusions.filter(i => i.status === 'warning').map(i => i.id);
        const newCriticalIds = currentCriticalIds.filter(id => !previousCriticalIdsRef.current.includes(id));

        // Filter: hanya pasien yang BELUM punya notif
        const trulyNew = newCriticalIds.filter(id =>
            !activeNotifications.some(n => n.id === id)
        );

        if (trulyNew.length > 0) {
            const newCriticalItems = infusions.filter(i => trulyNew.includes(i.id));
            const notifs = newCriticalItems.map(item => ({
                id: item.id,
                message: `Peringatan: Cairan Infus Bed ${item.room_number} (${item.patient_name}) Hampir Habis!`,
                timestamp: new Date(),
            }));
            setActiveNotifications(prev => [...prev, ...notifs]);

            // Alarm loop — beep terus sampe suster matikan
            newCriticalItems.forEach(item => {
                const playBeep = () => {
                    try {
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        [0, 0.25, 0.5].forEach(delay => {
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            osc.connect(gain);
                            gain.connect(ctx.destination);
                            osc.type = 'sine';
                            osc.frequency.value = 880;
                            gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
                            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.2);
                            osc.start(ctx.currentTime + delay);
                            osc.stop(ctx.currentTime + delay + 0.2);
                        });
                    } catch (e) {}
                };
                playBeep();
                const intervalId = setInterval(playBeep, 2000);
                alarmIntervalsRef.current[item.id] = intervalId;
            });
        }
        previousCriticalIdsRef.current = currentCriticalIds;
    }, [infusions]);

    const stopAlarm = (id) => {
        if (alarmIntervalsRef.current[id]) {
            clearInterval(alarmIntervalsRef.current[id]);
            delete alarmIntervalsRef.current[id];
        }
        setActiveNotifications(prev => prev.filter(n => n.id !== id));
    };

    const { data, setData, post, processing, reset, errors } = useForm({
        patient_name: '', room_number: '', fluid_type: 'RL',
        total_volume: 500, flowrate: 60, drip_type: 'Makro',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/infusions', { 
            onSuccess: () => { setIsModalOpen(false); reset(); router.reload({ only: ['infusions'] }); },
            preserveScroll: true
        });
    };

    const totalPatients = infusions.length;
    const criticalCount = infusions.filter(i => i.status === 'warning').length;
    const formattedTime = currentTime.toLocaleTimeString('id-ID', { hour12: false });
    const formattedDate = currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-5 relative z-20">
                    <div className="flex items-center gap-5">
                        <ApplicationLogo className="w-12 h-12 object-contain drop-shadow-md" />
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="font-black text-3xl tracking-tighter text-slate-800 leading-none">RSUD BANTEN</h2>
                                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-black tracking-widest border border-emerald-100 uppercase">Live</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                                <Activity size={12} className="text-emerald-500" /> Smart Infusion Monitoring System
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/logs" className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] flex items-center gap-2 transition-all active:scale-95">
                            <Terminal size={14} className="sm:w-4 sm:h-4" /> Log
                        </Link>
                        <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.35)] flex items-center gap-2 transition-all active:scale-95">
                            <Plus size={14} className="sm:w-4 sm:h-4" /> Pasien Baru
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="bg-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs text-slate-700 shadow-sm border border-slate-200 flex items-center gap-2.5 transition-all hover:bg-slate-50 active:scale-95"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm">
                                    {auth.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span className="hidden sm:block max-w-[100px] truncate">{auth.user?.name || 'User'}</span>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                            )}

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-sm font-black text-slate-800">{auth.user?.name}</p>
                                        <p className="text-[11px] text-slate-500 font-medium truncate">{auth.user?.email}</p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <User size={16} /> Edit Profil
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors w-full text-left"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <LogOut size={16} /> Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Monitoring Center | RSUD BANTEN" />

            <div className="py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-3 sm:gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Monitoring Dashboard</h1>
                        <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">Pantau status cairan infus pasien secara real-time</p>
                    </div>
                    <div className="bg-white px-3 sm:px-4 py-1.5 rounded-full border border-slate-200 flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-slate-700 shadow-sm">
                        <Clock size={13} className="text-emerald-500" /> {formattedTime} <span className="text-[10px] text-slate-400">WIB</span>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-10">
                    <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl sm:rounded-[24px] border border-emerald-100 p-4 sm:p-6 flex flex-col justify-between h-28 sm:h-40 shadow-[0_4px_20px_rgba(16,185,129,0.08)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)] transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl sm:rounded-l-[24px]"></div>
                        <div className="flex justify-between items-start pl-2">
                            <div><p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1 sm:mb-2">Total Pasien</p><p className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tighter">{totalPatients}</p></div>
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)]"><Users size={18} className="sm:w-6 sm:h-6" /></div>
                        </div>
                        <div className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-100/60 w-max px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">Active Monitoring</div>
                    </div>

                    <div className={`bg-gradient-to-br from-white ${criticalCount > 0 ? 'to-rose-50/50 border-rose-200 shadow-[0_4px_20px_rgba(244,63,94,0.08)]' : 'to-slate-50/50 border-slate-200 shadow-sm'} rounded-2xl sm:rounded-[24px] border p-4 sm:p-6 flex flex-col justify-between h-28 sm:h-40 transition-shadow relative overflow-hidden`}>
                        <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${criticalCount > 0 ? 'from-rose-400 to-rose-600' : 'from-slate-300 to-slate-400'} rounded-l-2xl sm:rounded-l-[24px]`}></div>
                        <div className="flex justify-between items-start pl-2">
                            <div><p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 sm:mb-2 ${criticalCount > 0 ? 'text-rose-500' : 'text-slate-400'}`}>Status Kritis</p><p className={`text-3xl sm:text-5xl font-black tracking-tighter ${criticalCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{criticalCount}</p></div>
                            <div className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl ${criticalCount > 0 ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-[0_4px_12px_rgba(244,63,94,0.3)] animate-pulse' : 'bg-slate-100 text-slate-400'}`}><AlertCircle size={18} className="sm:w-6 sm:h-6" /></div>
                        </div>
                        <div className="text-[10px] sm:text-xs font-bold pl-2">{criticalCount > 0 ? <span className="text-rose-600">Butuh Perhatian!</span> : <span className="text-slate-500">Normal</span>}</div>
                    </div>
                </div>

                {/* PATIENT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {infusions.map((item) => (
                        <div key={item.id} className={`rounded-2xl sm:rounded-[32px] p-4 sm:p-6 border transition-all ${item.status === 'warning' ? 'bg-gradient-to-br from-rose-50 to-white border-rose-200 shadow-[0_4px_20px_rgba(244,63,94,0.1)]' : 'bg-gradient-to-br from-white to-slate-50/50 border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]'}`}>
                            <div className="flex justify-between items-start mb-4 sm:mb-6">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-base sm:text-lg shadow-md ${item.status === 'warning' ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-[0_4px_12px_rgba(244,63,94,0.3)]' : 'bg-gradient-to-br from-slate-700 to-slate-800 text-white'}`}>{item.room_number}</div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-slate-800 line-clamp-1">{item.patient_name}</h3>
                                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.fluid_type} • {item.drip_type}</p>
                                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[8px] sm:text-[9px] font-black tracking-widest border border-slate-200 uppercase">
                                                ID: {item.id}
                                            </span>
                                            {item.infusion_number > 1 && (
                                                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[8px] sm:text-[9px] font-black tracking-widest border border-amber-100 uppercase">
                                                    Infus ke-{item.infusion_number}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => confirm(`Hapus?`) && router.delete(`/infusions/${item.id}`)} className="p-1.5 sm:p-2 text-slate-300 hover:text-rose-500 transition-colors"><X size={16} className="sm:w-[18px] sm:h-[18px]" /></button>
                            </div>

                            <div className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border ${item.status === 'warning' ? 'bg-white border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    {/* Animasi Kantong Infus */}
                                    <div className="shrink-0">
                                        <InfusionBag percentage={item.percentage_remaining} status={item.status} size={60} />
                                    </div>
                                    {/* Info Volume & Rate */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-end mb-2 sm:mb-3">
                                            <div><p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-0.5 sm:mb-1">Volume Sisa</p><p className={`text-xl sm:text-2xl font-black ${item.status === 'warning' ? 'text-rose-600' : 'text-slate-800'}`}>{item.current_remaining} <span className="text-[10px] sm:text-xs">ml</span></p></div>
                                            <div className="text-right"><p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-0.5 sm:mb-1">Rate</p><p className="text-lg sm:text-xl font-black text-slate-800">{item.tpm_calculated} <span className="text-[10px] sm:text-xs">tpm</span></p></div>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="h-2 sm:h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-1000 ${item.status === 'warning' ? 'bg-gradient-to-r from-rose-400 to-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'}`} style={{ width: `${item.percentage_remaining}%` }}></div>
                                        </div>
                                        <div className="flex justify-between mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            <span><Clock size={10} className="inline mr-1" /> {item.estimated_time_remaining}</span>
                                            <span>{item.flowrate} ml/h</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TOMBOL LIHAT CHARTING */}
                            <Link href={`/recap/${item.id}`} className="w-full mt-3 sm:mt-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.35)] hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-[0.98]">
                                <FileText size={14} className="sm:w-4 sm:h-4" /> Lihat Charting
                            </Link>

                            {/* TOMBOL GANTI INFUS */}
                            <button onClick={() => {
                                if (confirm(`Ganti infus untuk ${item.patient_name}? Infus lama akan ditandai selesai.`)) {
                                    router.post(`/infusions/${item.id}/ganti`, {}, { preserveScroll: true });
                                }
                            }} className="w-full mt-2 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white border border-amber-200 flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-600 hover:bg-amber-50 hover:border-amber-300 hover:shadow-[0_4px_12px_rgba(245,158,11,0.15)] transition-all active:scale-[0.98]">
                                <RefreshCw size={14} className="sm:w-4 sm:h-4" /> Ganti Infus
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL INPUT FIXED SCROLL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-2xl sm:rounded-[32px] shadow-2xl w-full max-w-xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden animate-[popIn_0.3s_ease-out]">
                        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-6 text-center shrink-0 relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white rounded-full text-slate-400 hover:text-rose-600 border border-slate-200 shadow-sm"><X size={18} className="sm:w-5 sm:h-5" /></button>
                            <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">Setup Pasien Baru</h3>
                        </div>
                        <div className="p-4 sm:p-8 overflow-y-auto">
                            <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div><label className="text-[10px] font-bold text-slate-500 mb-1.5 sm:mb-2 block uppercase tracking-widest">Nama Pasien</label><input required type="text" value={data.patient_name} onChange={e => setData('patient_name', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm font-bold focus:bg-white outline-none" /></div>
                                    <div><label className="text-[10px] font-bold text-slate-500 mb-1.5 sm:mb-2 block uppercase tracking-widest">No Bed</label><input required type="text" value={data.room_number} onChange={e => setData('room_number', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm font-bold focus:bg-white outline-none" /></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div><label className="text-[10px] font-bold text-slate-500 mb-1.5 sm:mb-2 block uppercase tracking-widest">Jenis Cairan</label><select value={data.fluid_type} onChange={e => setData('fluid_type', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm font-bold outline-none"><option value="RL">RL</option><option value="NaCl">NaCl</option><option value="Dextrose">Dextrose</option></select></div>
                                    <div><label className="text-[10px] font-bold text-slate-500 mb-1.5 sm:mb-2 block uppercase tracking-widest">Rate (ml/h)</label><input required type="number" value={data.flowrate} onChange={e => setData('flowrate', e.target.value)} className="w-full bg-slate-50 border-slate-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm font-bold outline-none" /></div>
                                </div>
                                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-[24px] border border-slate-200">
                                    <label className="text-[10px] font-bold text-slate-500 mb-2 sm:mb-3 block text-center uppercase tracking-widest">Volume (ml)</label>
                                    <div className="flex gap-2 mb-2 sm:mb-3">{[100, 250, 500].map(v => (<button key={v} type="button" onClick={() => setData('total_volume', v)} className={`flex-1 py-2 rounded-lg sm:rounded-xl border-2 font-bold text-xs transition-all ${data.total_volume == v ? 'border-emerald-500 bg-white text-emerald-600' : 'bg-white border-slate-200 text-slate-500'}`}>{v}</button>))}</div>
                                    <input required type="number" value={data.total_volume} onChange={e => setData('total_volume', e.target.value)} className="w-full bg-white border-slate-200 rounded-lg sm:rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-center text-lg sm:text-xl font-black outline-none" />
                                </div>
                                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-[24px] border border-slate-200 text-center">
                                    <label className="text-[10px] font-bold text-slate-500 mb-2 sm:mb-3 block uppercase tracking-widest">Tipe Infus Set</label>
                                    <div className="flex gap-3 sm:gap-4">{['Makro', 'Mikro'].map(t => (<button key={t} type="button" onClick={() => setData('drip_type', t)} className={`flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl font-black text-xs uppercase transition-all border-2 ${data.drip_type === t ? 'bg-white border-emerald-500 text-emerald-600 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}>{t} Set</button>))}</div>
                                </div>
                                <button disabled={processing} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_8px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.4)] active:scale-95 transition-all disabled:opacity-70">Mulai Monitoring</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* NOTIFIKASI KRITIS — ATAS TENGAH */}
            <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 sm:gap-3 w-full max-w-lg px-3 sm:px-4">
                {activeNotifications.map(notif => (
                    <div key={notif.id} className="bg-white border-rose-200 border-2 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 w-full animate-[slideDown_0.4s_ease-out]">
                        <div className="bg-rose-100 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0 animate-pulse">
                            <Bell className="text-rose-500" size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] sm:text-[10px] font-black text-rose-500 uppercase tracking-widest">Peringatan Kritis!</p>
                            <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{notif.message}</p>
                        </div>
                        <button onClick={() => stopAlarm(notif.id)} className="bg-rose-500 hover:bg-rose-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shrink-0 active:scale-95 transition-all">
                            Matikan
                        </button>
                    </div>
                ))}
            </div>

            {/* INI PENGGANTI TAG STYLE JSX YANG BIKIN ERROR */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes popIn { 0% { opacity: 0; transform: scale(0.9) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
                @keyframes slideDown { 0% { opacity: 0; transform: translateY(-30px); } 100% { opacity: 1; transform: translateY(0); } }
            ` }} />
        </AuthenticatedLayout>
    );
}
import { Head, Link } from '@inertiajs/react';
import { Activity, Droplet, ShieldAlert, ArrowRight, HeartPulse, Clock, LineChart, Server } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useEffect, useState, useRef } from 'react';

const RevealOnScroll = ({ children, delay = 0, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.30 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, []);

    return (
        <div 
            ref={ref}
            className={`transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-95'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default function Welcome({ auth }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white text-slate-600 bg-emerald-50/30">
            <Head title="SIMS - RSUD Banten" />

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Background color base */}
                <div className="absolute inset-0 bg-emerald-50/40"></div>

                {/* Modern Dot/Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-[0.08] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"></div>
                
                {/* Top/Center Glow */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] rounded-[100%] bg-gradient-to-b from-emerald-200/60 via-teal-100/30 to-transparent blur-3xl"></div>
                
                {/* Animated Orbs */}
                <div className="absolute top-[5%] -left-20 w-[600px] h-[600px] rounded-full bg-emerald-300/30 blur-[120px] animate-blob mix-blend-multiply"></div>
                <div className="absolute top-[15%] -right-20 w-[600px] h-[600px] rounded-full bg-teal-300/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply"></div>
                <div className="absolute -bottom-40 left-1/3 w-[800px] h-[800px] rounded-full bg-emerald-200/40 blur-[150px] animate-blob animation-delay-4000 mix-blend-multiply"></div>

                {/* Abstract Tech Elements */}
                <div className="absolute top-1/4 left-[5%] w-[40vw] h-[40vw] border-[0.5px] border-emerald-500/20 rounded-full animate-[spin_120s_linear_infinite]"></div>
                <div className="absolute top-1/3 right-[5%] w-[30vw] h-[30vw] border-[0.5px] border-teal-500/20 rounded-full animate-[spin_90s_linear_infinite] border-dashed"></div>
                
                {/* Gradien overlay bawah agar smooth menyatu */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/50 to-emerald-50/80"></div>
            </div>

            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
                <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <ApplicationLogo className="w-12 h-12 object-contain drop-shadow-md" />
                        <div>
                            <h1 className="font-black text-2xl tracking-tight text-slate-800 leading-none">RSUD BANTEN</h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mt-1">Smart Infusion Monitoring System</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 py-2.5 rounded-full text-sm font-bold border border-emerald-200 hover:border-emerald-300 transition-all flex items-center gap-2 group backdrop-blur-md">
                                Ke Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-xs font-bold text-slate-600 hover:text-emerald-600 px-4 py-2 transition-colors uppercase tracking-widest hidden sm:block">
                                    Login Perawat
                                </Link>
                                <Link href={route('register')} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-7 py-3 rounded-full text-xs font-black shadow-[0_8px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)] transition-all uppercase tracking-widest">
                                    Daftar Akses
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="pt-40 pb-20 px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-[90vh]">
                    <div className="flex-1 text-center lg:text-left animate-slideRight">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] font-black uppercase tracking-widest mb-8 shadow-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                            Inovasi Medis Berbasis IoT
                        </div>
                        
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-800 tracking-tighter mb-8 leading-[1.1]">
                            Satu Langkah Lebih Maju untuk <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">
                                Keselamatan Pasien
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-500 font-medium mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Ucapkan selamat tinggal pada pengecekan infus manual yang memakan waktu. Pantau status infus pasien dari satu layar sentral, dapatkan peringatan otomatis sebelum cairan habis, dan hadirkan perawatan yang jauh lebih aman.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                            <Link href={auth.user ? route('dashboard') : route('login')} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-5 rounded-[20px] text-sm font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all flex items-center gap-3 w-full sm:w-auto justify-center group border border-emerald-400/30">
                                <Activity size={20} className="group-hover:animate-pulse" /> Mulai Pemantauan
                            </Link>
                            <a href="#fitur" className="px-10 py-5 rounded-[20px] text-sm font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 border border-emerald-200 hover:border-emerald-300 bg-white/80 hover:bg-emerald-50 transition-all w-full sm:w-auto text-center backdrop-blur-sm shadow-[0_4px_12px_rgba(16,185,129,0.08)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.15)]">
                                Jelajahi Fitur Unggulan
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-16 pt-10 border-t border-slate-200 max-w-2xl mx-auto lg:mx-0">
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100 shadow-[0_4px_16px_rgba(16,185,129,0.06)]">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3 shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                                    <Clock size={18} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-800 mb-1">24<span className="text-emerald-500">/7</span></h4>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Monitoring Berkelanjutan</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100 shadow-[0_4px_16px_rgba(16,185,129,0.06)]">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3 shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                                    <Activity size={18} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-800 mb-1">99<span className="text-emerald-500">%</span></h4>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Presisi Tingkat Medis</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100 shadow-[0_4px_16px_rgba(16,185,129,0.06)]">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-3 shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                                    <AlertCircle size={18} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-800 mb-1">0<span className="text-emerald-500">.5s</span></h4>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Respons Kritis Instan</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full max-w-lg lg:max-w-none animate-slideLeft mt-12 lg:mt-0">
                        {/* Mockup Monitor (Kaca/Glassmorphism 3D) */}
                        <div className="relative z-10 bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-[2.5rem] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.08)] overflow-hidden group">
                            {/* Efek kilap/glare */}
                            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/50 to-transparent skew-y-12 transform -translate-y-10 pointer-events-none"></div>
                            
                            {/* Titik Cahaya di background card */}
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors"></div>
                            
                            {/* Fake UI Dashboard */}
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                                        <HeartPulse size={24} />
                                    </div>
                                    <div>
                                        <div className="text-slate-800 font-black text-lg">Pasien Bed 204A</div>
                                        <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Monitoring Aktif</div>
                                    </div>
                                </div>
                                <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-200 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Stabil
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5 mb-8">
                                <div className="bg-white p-6 rounded-[20px] border border-slate-200 relative overflow-hidden group-hover:border-emerald-300 transition-colors shadow-sm">
                                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><Droplet size={12} className="text-emerald-500"/> Volume Sisa</div>
                                    <div className="text-4xl font-black text-slate-800">420 <span className="text-sm text-emerald-600 uppercase tracking-widest">ml</span></div>
                                    <div className="absolute bottom-0 left-0 h-1.5 bg-emerald-500 w-[84%] shadow-[0_0_15px_#10b981]"></div>
                                </div>
                                <div className="bg-white p-6 rounded-[20px] border border-slate-200 group-hover:border-emerald-300 transition-colors shadow-sm">
                                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><Activity size={12} className="text-emerald-500"/> Flow Rate</div>
                                    <div className="text-4xl font-black text-slate-800">60 <span className="text-sm text-emerald-600 uppercase tracking-widest">tpm</span></div>
                                </div>
                            </div>

                            {/* Fake EKG Wave Animasi */}
                            <div className="h-28 bg-white rounded-[20px] border border-slate-200 flex items-center justify-center overflow-hidden relative shadow-inner">
                                <svg className="w-[200%] h-14 stroke-emerald-500 animate-[dash_4s_linear_infinite]" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 1000 100" preserveAspectRatio="none">
                                    <path d="M0,50 L200,50 L230,10 L260,90 L290,50 L500,50 L530,10 L560,90 L590,50 L1000,50" />
                                </svg>
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-50 to-transparent opacity-50"></div>
                                <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white to-transparent"></div>
                            </div>
                        </div>

                        {/* Floating Action Cards */}
                        <div className="absolute -right-4 md:-right-10 -top-10 bg-white border border-slate-200 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-float delay-100 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center"><ShieldAlert size={20} /></div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Auto Alert</p>
                                    <p className="text-sm text-slate-800 font-bold">Deteksi Dini Cerdas</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -left-4 md:-left-12 bottom-10 bg-white border border-slate-200 p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-float delay-500 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center"><LineChart size={20} /></div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Log Otomatis</p>
                                    <p className="text-sm text-slate-800 font-bold">Sinkronisasi Cloud</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Detail Section */}
                <section id="fitur" className="py-32 relative">
                    <div className="absolute inset-0 bg-slate-50/50 border-y border-slate-200 backdrop-blur-sm"></div>
                    <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                        <RevealOnScroll>
                            <div className="text-center mb-24">
                                <div className="inline-flex px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6">MENGAPA MEMILIH SIMS?</div>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-6">Teknologi yang Memberdayakan Tenaga Medis</h2>
                                <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto leading-relaxed">Dikembangkan secara spesifik untuk lingkungan rumah sakit guna mengoptimalkan alur kerja klinis dan memastikan setiap tindakan termonitor dengan baik.</p>
                            </div>
                        </RevealOnScroll>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Activity, title: 'Pemantauan Sentral Terpadu', desc: 'Awasi laju tetesan dan sisa volume cairan untuk puluhan pasien secara bersamaan melalui satu dasbor interaktif yang komprehensif.', colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100 group-hover:border-emerald-200 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]' },
                                { icon: ShieldAlert, title: 'Sistem Peringatan Dini', desc: 'Dapatkan notifikasi visual dan audio seketika saat terdeteksi anomali pada laju infus atau saat volume cairan mencapai batas kritis.', colorClass: 'text-rose-500 bg-rose-50 border-rose-100 group-hover:bg-rose-100 group-hover:border-rose-200 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.1)]' },
                                { icon: Server, title: 'Dokumentasi Otonom', desc: 'Riwayat laju infus terekam secara otomatis setiap menit, memastikan pencatatan medis yang akurat dan mudah diekspor untuk audit.', colorClass: 'text-teal-600 bg-teal-50 border-teal-100 group-hover:bg-teal-100 group-hover:border-teal-200 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.1)]' },
                                { icon: Clock, title: 'Kalkulasi Prediktif', desc: 'Algoritma pintar kami menghitung estimasi sisa waktu cairan secara dinamis berdasarkan kecepatan aliran aktual, mencegah keterlambatan penanganan.', colorClass: 'text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-200 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]' },
                            ].map((feature, i) => (
                                <RevealOnScroll key={i} delay={i * 150} className="h-full">
                                    <div className="bg-white/80 backdrop-blur-xl p-8 lg:p-10 rounded-[2rem] border border-slate-200 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-xl group relative overflow-hidden h-full flex flex-col">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-[50px] group-hover:bg-slate-100 transition-colors"></div>
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border transition-all duration-300 shrink-0 ${feature.colorClass}`}>
                                            <feature.icon size={28} strokeWidth={2} />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 mb-4 tracking-tight">{feature.title}</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                                    </div>
                                </RevealOnScroll>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Full Width Section */}
                <section className="py-32 px-6 overflow-hidden">
                    <RevealOnScroll delay={200}>
                        <div className="max-w-[1200px] mx-auto bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(16,185,129,0.1)]">
                            {/* Glow Backgrounds */}
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/50 blur-[100px] rounded-full"></div>
                        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-200/50 blur-[100px] rounded-full"></div>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMDMpIi8+Cjwvc3ZnPg==')] opacity-50"></div>
                        
                        <div className="relative z-10">
                            <div className="mx-auto mb-8">
                                <ApplicationLogo className="w-28 h-28 object-contain drop-shadow-lg" />
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight mb-8">Transformasi Perawatan <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Dimulai dari Sini</span></h2>
                            <p className="text-slate-600 text-lg mb-12 max-w-2xl mx-auto font-medium">Tingkatkan efisiensi operasional rumah sakit dan berikan ketenangan pikiran bagi pasien dengan platform pemantauan infus yang inovatif.</p>
                            
                            <div className="flex flex-col sm:flex-row justify-center gap-5">
                                <Link href={route('register')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-[20px] text-sm font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] transition-all">
                                    Daftar Akses
                                </Link>
                                <Link href={route('login')} className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-10 py-5 rounded-[20px] text-sm font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md">
                                    Masuk Tenaga Medis
                                </Link>
                            </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </section>
            </main>

            {/* Premium Footer */}
            <footer className="border-t border-slate-200/80 bg-slate-50 pt-16 pb-8 relative z-10 overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                        <div className="flex items-center gap-4">
                            <ApplicationLogo className="w-11 h-11 object-contain drop-shadow-sm" />
                            <div>
                                <h3 className="font-black text-xl text-slate-800 tracking-tight">RSUD BANTEN</h3>
                                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">SIMS Dashboard</p>
                            </div>
                        </div>
                        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
                            <a href="#" className="hover:text-emerald-600 transition-colors">Tentang Kami</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">Panduan Sistem</a>
                            <a href="#" className="hover:text-emerald-400 transition-colors">Bantuan</a>
                        </div>
                    </div>
                    <div className="text-center pt-8 border-t border-slate-200/50">
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} Smart Infusion Monitoring System. Dikembangkan untuk Keperluan Medis RSUD.
                        </p>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes dash {
                    to { stroke-dashoffset: -1000; }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.2; transform: scale(1.05); }
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(40px, -60px) scale(1.05); }
                    66% { transform: translate(-30px, 30px) scale(0.95); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 25s infinite alternate ease-in-out; }
                .animation-delay-2000 { animation-delay: 5s; }
                .animation-delay-4000 { animation-delay: 10s; }
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(-100px) scale(0.95); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
                @keyframes slideLeft {
                    from { opacity: 0; transform: translateX(100px) scale(0.95); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
                .animate-float { animation: float 12s ease-in-out infinite; }
                .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
                .animate-slideRight { animation: slideRight 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-slideLeft { animation: slideLeft 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .delay-100 { animation-delay: 0.1s; }
                .delay-500 { animation-delay: 0.5s; }
                .delay-1000 { animation-delay: 1s; }
            `}</style>
        </div>
    );
}

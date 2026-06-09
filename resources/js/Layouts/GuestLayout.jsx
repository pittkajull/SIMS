import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 selection:bg-emerald-500 selection:text-white font-sans text-slate-600 bg-emerald-50/30">

            {/* Background Effects matching Welcome.jsx */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-emerald-50/40"></div>
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"></div>
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] rounded-[100%] bg-gradient-to-b from-emerald-200/60 via-teal-100/30 to-transparent blur-3xl"></div>
                <div className="absolute top-[5%] -left-20 w-[600px] h-[600px] rounded-full bg-emerald-300/50 blur-[120px] animate-blob mix-blend-multiply"></div>
                <div className="absolute top-[15%] -right-20 w-[600px] h-[600px] rounded-full bg-teal-300/40 blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply"></div>
                <div className="absolute -bottom-40 left-1/3 w-[800px] h-[800px] rounded-full bg-emerald-200/50 blur-[150px] animate-blob animation-delay-4000 mix-blend-multiply"></div>
                <div className="absolute top-1/4 left-[5%] w-[40vw] h-[40vw] border-[1px] border-emerald-500/15 rounded-full animate-[spin_120s_linear_infinite]"></div>
                <div className="absolute top-1/3 right-[5%] w-[30vw] h-[30vw] border-[1px] border-teal-500/15 rounded-full animate-[spin_90s_linear_infinite] border-dashed"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/50 to-emerald-50/80"></div>
            </div>

            {/* Slow moving EKG line - purely decorative */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.10] flex items-center justify-center">
                <svg className="w-[150%] h-64 animate-[dash_30s_linear_infinite]" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="20 10" d="M0,50 L200,50 L220,10 L240,90 L260,50 L1000,50" />
                </svg>
            </div>

            <div className="w-full max-w-[420px] relative z-10">
                <div className="text-center mb-10 flex flex-col items-center animate-fadeInDown">
                    <Link
                        href="/"
                        className="relative group mb-6"
                    >
                        <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                        <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                            <ApplicationLogo className="w-24 h-24 object-contain drop-shadow-lg" />
                        </div>
                    </Link>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tighter leading-none mb-2">RSUD BANTEN</h2>
                    <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span> Smart Infusion System
                    </p>
                </div>

                <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-slate-100 animate-fadeInUp relative overflow-hidden transition-all duration-300">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400"></div>
                    {children}
                </div>
            </div>

            <style jsx global>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.05); }
                }
                @keyframes dash {
                    to { stroke-dashoffset: -1000; }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
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
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                .animate-fadeInDown {
                    animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .delay-1000 { animation-delay: 1s; }
            `}</style>
        </div>
    );
}
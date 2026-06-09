import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register - RSUD BANTEN" />

            <div className="mb-8 text-center">
                <h3 className="text-2xl font-black tracking-tight text-slate-800">Daftar Akun Baru</h3>
                <p className="text-slate-500 text-sm mt-1.5 font-medium">Registrasi akses tenaga medis</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 ml-1 tracking-widest">Nama Lengkap</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pl-12 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 shadow-sm"
                            placeholder="Nama perawat"
                            required
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} strokeWidth={2.5} />
                    </div>
                    {errors.name && <div className="text-rose-500 text-[10px] uppercase tracking-wider mt-2 font-bold ml-1">{errors.name}</div>}
                </div>

                <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 ml-1 tracking-widest">Email Medis</label>
                    <div className="relative">
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pl-12 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 shadow-sm"
                            placeholder="nama@rsud.banten.go.id"
                            required
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} strokeWidth={2.5} />
                    </div>
                    {errors.email && <div className="text-rose-500 text-[10px] uppercase tracking-wider mt-2 font-bold ml-1">{errors.email}</div>}
                </div>

                <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 ml-1 tracking-widest">Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pl-12 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 shadow-sm"
                            placeholder="••••••••"
                            required
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} strokeWidth={2.5} />
                    </div>
                    {errors.password && <div className="text-rose-500 text-[10px] uppercase tracking-wider mt-2 font-bold ml-1">{errors.password}</div>}
                </div>

                <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 ml-1 tracking-widest">Konfirmasi Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pl-12 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 shadow-sm"
                            placeholder="••••••••"
                            required
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} strokeWidth={2.5} />
                    </div>
                    {errors.password_confirmation && <div className="text-rose-500 text-[10px] uppercase tracking-wider mt-2 font-bold ml-1">{errors.password_confirmation}</div>}
                </div>

                <button
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white py-4 rounded-[20px] font-black text-sm uppercase tracking-widest shadow-[0_8px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                >
                    {processing ? 'Mendaftarkan...' : (
                        <>
                            <UserPlus size={18} strokeWidth={2.5} /> Buat Akun
                        </>
                    )}
                </button>

                <div className="text-center pt-5 border-t border-slate-200 mt-5">
                    <p className="text-[11px] font-medium text-slate-500">
                        Sudah punya akun?{' '}
                        <Link href={route('login')} className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
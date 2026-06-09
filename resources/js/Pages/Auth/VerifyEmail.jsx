import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { MailCheck, LogOut, Send } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email - RSUD BANTEN" />

            <div className="mb-6 text-center">
                <div className="inline-flex p-4 bg-emerald-50 rounded-full mb-4 text-emerald-600 border border-emerald-100 shadow-sm">
                    <MailCheck size={32} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-800">Verifikasi Email Anda</h3>
                <p className="text-slate-500 text-sm mt-3 font-medium leading-relaxed">
                    Terima kasih telah mendaftar! Sebelum memulai, harap verifikasi alamat email Anda dengan mengeklik tautan yang baru saja kami kirimkan.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center font-bold">
                    Tautan verifikasi baru telah dikirimkan ke email Anda.
                </div>
            )}

            <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
                <button
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white py-4 rounded-[20px] font-black text-sm uppercase tracking-widest shadow-[0_8px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                >
                    {processing ? 'Mengirim Ulang...' : (
                        <>
                            <Send size={16} strokeWidth={2.5} /> Kirim Ulang Tautan
                        </>
                    )}
                </button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-4 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                    <LogOut size={16} strokeWidth={2.5} /> Keluar Sementara
                </Link>
            </form>
        </GuestLayout>
    );
}

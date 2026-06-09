import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-5">
                    <div className="relative bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200">
                        <User className="text-emerald-500" size={28} />
                    </div>
                    <div>
                        <h2 className="font-black text-3xl tracking-tighter text-slate-800 leading-none">Profil Saya</h2>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Kelola akun medis Anda</p>
                    </div>
                </div>
            }
        >
            <Head title="Profil" />

            <div className="py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1400px] space-y-6">
                    <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[24px] shadow-sm">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[24px] shadow-sm">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white border border-slate-200 p-5 sm:p-8 rounded-2xl sm:rounded-[24px] shadow-sm">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

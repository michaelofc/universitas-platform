'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { GraduationCap } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    senha: z.string().min(1, 'Senha é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        setError('');

        try {
            const response = await auth.login(data);
            const { user, token } = response.data;
            setAuth(user, token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Email ou senha incorretos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <GraduationCap className="w-10 h-10 text-primary-600" />
                        <h1 className="text-3xl font-bold">UNIVERSITAS</h1>
                    </div>
                    <p className="text-gray-600">Entre na sua conta</p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="joao@email.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Senha
                            </label>
                            <input
                                {...register('senha')}
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="••••••"
                            />
                            {errors.senha && (
                                <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Não tem uma conta?{' '}
                            <Link href="/signup" className="text-primary-600 font-semibold hover:underline">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

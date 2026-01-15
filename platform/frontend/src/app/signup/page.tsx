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

const signupSchema = z.object({
    nome_completo: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    telefone: z.string().optional(),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupForm) => {
        setLoading(true);
        setError('');

        try {
            const response = await auth.signup(data);
            const { user, token } = response.data;
            setAuth(user, token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <GraduationCap className="w-10 h-10 text-primary-600" />
                        <h1 className="text-3xl font-bold">UNIVERSITAS</h1>
                    </div>
                    <p className="text-gray-600">Crie sua conta e comece a aprender</p>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome Completo
                            </label>
                            <input
                                {...register('nome_completo')}
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="João Silva"
                            />
                            {errors.nome_completo && (
                                <p className="text-red-500 text-sm mt-1">{errors.nome_completo.message}</p>
                            )}
                        </div>

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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Telefone (opcional)
                            </label>
                            <input
                                {...register('telefone')}
                                type="tel"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="(11) 99999-9999"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Criando conta...' : 'Criar Conta'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="text-primary-600 font-semibold hover:underline">
                                Faça login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ciclos } from '@/lib/api';
import { ArrowLeft, Lock, CheckCircle, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore, useIsAuthenticated } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CicloDetailPage({ params }: { params: { id: string } }) {
    const isAuthenticated = useIsAuthenticated();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [inscrevendo, setInscrevendo] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    const { data, isLoading } = useQuery({
        queryKey: ['ciclo', params.id],
        queryFn: async () => {
            const res = await ciclos.get(params.id);
            return res.data;
        },
    });

    const inscreverMutation = useMutation({
        mutationFn: () => ciclos.inscrever(params.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['progresso'] });
            queryClient.invalidateQueries({ queryKey: ['ciclo', params.id] });
            alert('Inscrição realizada com sucesso! 🎉');
        },
        onError: (error: any) => {
            alert(error.response?.data?.error || 'Erro ao se inscrever');
        },
    });

    const handleInscrever = async () => {
        if (confirm('Deseja se inscrever neste ciclo?')) {
            setInscrevendo(true);
            try {
                await inscreverMutation.mutateAsync();
            } finally {
                setInscrevendo(false);
            }
        }
    };

    if (!isAuthenticated) return null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/ciclos"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar aos Ciclos
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Ciclo Header */}
                <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                    <div className="flex items-start gap-6 mb-6">
                        <div className="bg-primary-100 text-primary-700 w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl">
                            {data?.ciclo.numero_ciclo}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{data?.ciclo.nome}</h1>
                            <p className="text-gray-600 mb-4">{data?.ciclo.descricao}</p>
                            <div className="flex gap-6 text-sm">
                                <span className="text-gray-600">
                                    <strong>Nível:</strong> {data?.ciclo.perfil_entrada} → {data?.ciclo.perfil_saida}
                                </span>
                                <span className="text-gray-600">
                                    <strong>Duração:</strong> ~{data?.ciclo.duracao_estimada_meses} meses
                                </span>
                                <span className="text-gray-600">
                                    <strong>Aprovação:</strong> {data?.ciclo.pontuacao_minima_aprovacao}+ pontos
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleInscrever}
                            disabled={inscrevendo}
                            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                        >
                            {inscrevendo ? 'Inscrevendo...' : 'Inscrever-se'}
                        </button>
                    </div>
                </div>

                {/* Módulos */}
                <div className="bg-white rounded-xl shadow-sm border p-8">
                    <h2 className="text-2xl font-bold mb-6">
                        Módulos do Ciclo ({data?.modulos?.length || 0})
                    </h2>
                    <div className="space-y-4">
                        {data?.modulos?.map((modulo: any, index: number) => (
                            <ModuloCard key={modulo.id} modulo={modulo} index={index} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

function ModuloCard({ modulo, index }: { modulo: any; index: number }) {
    const isLocked = false; // TODO: verificar se está bloqueado
    const isCompleted = false; // TODO: verificar se está completo

    return (
        <Link
            href={isLocked ? '#' : `/modulos/${modulo.id}`}
            className={`block border rounded-lg p-6 transition ${isLocked
                ? 'bg-gray-50 cursor-not-allowed'
                : 'hover:border-primary-500 hover:shadow-md'
                }`}
        >
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    {isCompleted ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : isLocked ? (
                        <Lock className="w-8 h-8 text-gray-400" />
                    ) : (
                        <PlayCircle className="w-8 h-8 text-primary-600" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <span className="text-sm text-gray-500 font-medium">{modulo.codigo}</span>
                            <h3 className="text-lg font-semibold">{modulo.nome}</h3>
                        </div>
                        <div className="text-right">
                            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                {modulo.nivel_dificuldade}
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-3">{modulo.descricao}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                        <span>⏱️ ~{modulo.duracao_estimada_horas}h</span>
                        <span>🎯 {modulo.pontuacao_maxima} pontos</span>
                        <span>✅ Mínimo: {modulo.pontuacao_minima_aprovacao} pontos</span>
                    </div>
                    {modulo.tags && modulo.tags.length > 0 && (
                        <div className="flex gap-2 mt-3">
                            {modulo.tags.slice(0, 5).map((tag: string) => (
                                <span key={tag} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

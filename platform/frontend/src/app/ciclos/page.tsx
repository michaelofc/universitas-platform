'use client';

import { useQuery } from '@tanstack/react-query';
import { ciclos } from '@/lib/api';
import { GraduationCap, ArrowLeft, Clock, Target } from 'lucide-react';
import Link from 'next/link';

export default function CiclosPage() {

    const { data, isLoading } = useQuery({
        queryKey: ['ciclos'],
        queryFn: async () => {
            const res = await ciclos.list();
            return res.data.ciclos;
        },
    });


    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Dashboard
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Ciclos de Formação</h1>
                    <p className="text-gray-600">
                        5 ciclos que levam você de iniciante a Master em automação e sistemas.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-600 mt-4">Carregando ciclos...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {data?.map((ciclo: any) => (
                            <CicloDetailCard key={ciclo.id} ciclo={ciclo} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

function CicloDetailCard({ ciclo }: { ciclo: any }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
            <div className="flex items-start gap-6">
                <div className="bg-primary-100 text-primary-700 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
                    {ciclo.numero_ciclo}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">{ciclo.nome}</h3>
                            <p className="text-gray-600 mb-4">{ciclo.descricao}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <InfoItem
                            icon={<Target className="w-5 h-5" />}
                            label="Nível"
                            value={`${ciclo.perfil_entrada} → ${ciclo.perfil_saida}`}
                        />
                        <InfoItem
                            icon={<Clock className="w-5 h-5" />}
                            label="Duração Estimada"
                            value={`${ciclo.duracao_estimada_meses} meses`}
                        />
                        <InfoItem
                            icon={<GraduationCap className="w-5 h-5" />}
                            label="Aprovação"
                            value={`${ciclo.pontuacao_minima_aprovacao}+ pontos`}
                        />
                    </div>

                    <Link
                        href={`/ciclos/${ciclo.id}`}
                        className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
                    >
                        Ver Módulos
                    </Link>
                </div>
            </div>
        </div>
    );
}

function InfoItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-primary-600">{icon}</div>
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}

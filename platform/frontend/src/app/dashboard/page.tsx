'use client';

import { useQuery } from '@tanstack/react-query';
import { ciclos, progresso } from '@/lib/api';
import { GraduationCap, BookOpen, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: ciclosData } = useQuery({
        queryKey: ['ciclos'],
        queryFn: async () => {
            const res = await ciclos.list();
            return res.data.ciclos;
        },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-8 h-8 text-primary-600" />
                            <h1 className="text-2xl font-bold">UNIVERSITAS</h1>
                        </div>
                        <nav className="flex items-center gap-6">
                            <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium">
                                Dashboard
                            </Link>
                            <Link href="/ciclos" className="text-gray-700 hover:text-primary-600">
                                Ciclos
                            </Link>
                            <Link href="/chat-ia" className="text-gray-700 hover:text-primary-600">
                                Chat IA
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        Bem-vindo à UNIVERSITAS! 👋
                    </h2>
                    <p className="text-gray-600">
                        Continue sua jornada de aprendizado e evolução profissional.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<BookOpen className="w-6 h-6" />}
                        label="Ciclos Disponíveis"
                        value={ciclosData?.length || 0}
                        color="blue"
                    />
                    <StatCard
                        icon={<TrendingUp className="w-6 h-6" />}
                        label="Módulos Totais"
                        value="50+"
                        color="green"
                    />
                    <StatCard
                        icon={<Award className="w-6 h-6" />}
                        label="Horas de Conteúdo"
                        value="2000+"
                        color="purple"
                    />
                    <StatCard
                        icon={<GraduationCap className="w-6 h-6" />}
                        label="Formação Completa"
                        value="Júnior→Master"
                        color="orange"
                    />
                </div>

                {/* Available Ciclos */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-4">Ciclos Disponíveis</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {ciclosData?.map((ciclo: any) => (
                            <CicloCard key={ciclo.id} ciclo={ciclo} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
}) {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className={`inline-flex p-3 rounded-lg ${colors[color as keyof typeof colors]} mb-3`}>
                {icon}
            </div>
            <p className="text-2xl font-bold mb-1">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
        </div>
    );
}

function CicloCard({ ciclo }: { ciclo: any }) {
    return (
        <Link
            href={`/ciclos/${ciclo.id}`}
            className="border rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition group"
        >
            <div className="flex items-start gap-3">
                <div className="bg-primary-100 text-primary-700 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition">
                    {ciclo.numero_ciclo}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold mb-1 group-hover:text-primary-600 transition">
                        {ciclo.nome}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{ciclo.descricao}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                        <span>{ciclo.perfil_entrada} → {ciclo.perfil_saida}</span>
                        <span>~{ciclo.duracao_estimada_meses} meses</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

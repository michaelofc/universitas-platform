'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirecionar direto para dashboard (sem login)
        router.push('/dashboard');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
            <div className="text-white text-center">
                <h1 className="text-4xl font-bold mb-4">UNIVERSITAS</h1>
                <p className="text-xl opacity-90">Carregando...</p>
            </div>
        </div>
    );
}

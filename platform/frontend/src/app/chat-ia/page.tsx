'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ia } from '@/lib/api';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import Link from 'next/link';

type Modo = 'aluno' | 'mentor' | 'professor';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ChatIAPage() {
    const [modo, setModo] = useState<Modo>('aluno');
    const [mensagem, setMensagem] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content:
                'Olá! Sou a IA Educacional da UNIVERSITAS. Estou aqui para te ajudar a aprender. Como posso te auxiliar hoje?',
            timestamp: new Date(),
        },
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    const handleSend = async () => {
        if (!mensagem.trim() || loading) return;

        const userMessage: Message = {
            role: 'user',
            content: mensagem,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setMensagem('');
        setLoading(true);

        try {
            const res = await ia.chat({
                modo,
                mensagem: mensagem,
                contexto: {},
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: res.data.resposta,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link href="/dashboard" className="text-primary-600 hover:underline text-sm">
                                ← Voltar
                            </Link>
                            <h1 className="text-2xl font-bold mt-1">Chat com IA Educacional</h1>
                        </div>
                        <div className="flex gap-2">
                            <ModoButton
                                modo="aluno"
                                active={modo === 'aluno'}
                                onClick={() => setModo('aluno')}
                                label="Modo Aluno"
                            />
                            <ModoButton
                                modo="mentor"
                                active={modo === 'mentor'}
                                onClick={() => setModo('mentor')}
                                label="Modo Mentor"
                            />
                            <ModoButton
                                modo="professor"
                                active={modo === 'professor'}
                                onClick={() => setModo('professor')}
                                label="Modo Professor"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Info do modo */}
            <div className="bg-blue-50 border-b border-blue-200 py-2 px-4">
                <div className="container mx-auto text-sm">
                    {modo === 'aluno' && (
                        <p>
                            🎓 <strong>Modo Aluno:</strong> Tire dúvidas e aprenda conceitos. A IA vai te guiar com
                            perguntas, não dar respostas prontas.
                        </p>
                    )}
                    {modo === 'mentor' && (
                        <p>
                            👨‍🏫 <strong>Modo Mentor:</strong> Receba feedback sobre seu código e arquitetura.
                            Cole seu código para avaliação.
                        </p>
                    )}
                    {modo === 'professor' && (
                        <p>
                            🧑‍🏫 <strong>Modo Professor:</strong> Avalie seu conteúdo didático. A IA vai simular
                            alunos e dar feedback pedagógico.
                        </p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 py-6 max-w-4xl">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <MessageBubble key={index} message={msg} />
                        ))}
                        {loading && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-primary-600" />
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm max-w-2xl">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Input */}
            <div className="border-t bg-white">
                <div className="container mx-auto px-4 py-4 max-w-4xl">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !mensagem.trim()}
                            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ModoButton({
    modo,
    active,
    onClick,
    label,
}: {
    modo: string;
    active: boolean;
    onClick: () => void;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg font-medium transition ${active
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
        >
            {label}
        </button>
    );
}

function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-primary-600' : 'bg-primary-100'
                    }`}
            >
                {isUser ? (
                    <User className="w-5 h-5 text-white" />
                ) : (
                    <Bot className="w-5 h-5 text-primary-600" />
                )}
            </div>
            <div
                className={`rounded-lg p-4 shadow-sm max-w-2xl ${isUser ? 'bg-primary-600 text-white' : 'bg-white'
                    }`}
            >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${isUser ? 'text-primary-100' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>
        </div>
    );
}

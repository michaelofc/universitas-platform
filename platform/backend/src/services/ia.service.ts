import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export type ModoIA = 'aluno' | 'mentor' | 'professor';

export interface AvaliacaoCode {
    funcionalidade: number;
    qualidade_codigo: number;
    arquitetura: number;
    tratamento_erros: number;
    documentacao: number;
    total: number;
    aprovado: boolean;
    feedback: string;
    melhorias: string[];
    pontos_fortes: string[];
}

export interface FeedbackDidatico {
    clareza: number;
    adaptacao_nivel: number;
    uso_analogias: number;
    estrutura: number;
    feedback: string;
    sugestoes: string[];
}

export class IAEducacional {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    /**
     * MODO ALUNO: Assistente de aprendizagem
     * - NÃO dá código pronto
     * - Guia com perguntas socráticas
     * - Explica conceitos com analogias
     */
    async modoAluno(pergunta: string, contexto: any): Promise<string> {
        const systemPrompt = `Você é um ASSISTENTE DE APRENDIZAGEM da UNIVERSITAS.

SEU PAPEL:
- Ajudar o aluno a APRENDER, não dar respostas prontas
- Fazer perguntas socráticas que guiem o raciocínio
- Explicar conceitos com analogias do mundo real
- Ser encorajador e paciente

REGRAS RÍGIDAS:
❌ NUNCA dê código completo pronto
❌ NUNCA resolva o exercício pelo aluno
✅ Faça perguntas que guiem o aluno
✅ Dê dicas, não soluções
✅ Use analogias simples
✅ Seja didático e claro

EXEMPLO DE RESPOSTA BOA:
Aluno: "Como faço uma integração com API?"
Você: "Ótima pergunta! Vamos por partes:
1. Você já leu a documentação da API?
2. Sabe qual endpoint precisa chamar?
3. A API precisa de autenticação?
Me conte o que você já descobriu!"

EXEMPLO DE RESPOSTA RUIM:
Você: "Aqui está o código completo: [código]"`;

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Contexto: ${JSON.stringify(contexto)}\n\nPergunta: ${pergunta}` }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        return completion.choices[0].message.content || 'Desculpe, não consegui processar sua pergunta.';
    }

    /**
     * MODO MENTOR: Revisor e avaliador
     * - Avalia código e arquitetura
     * - Dá feedback estruturado
     * - Atribui pontuação
     */
    async modoMentor(codigo: string, requisitos: string): Promise<AvaliacaoCode> {
        const systemPrompt = `Você é um MENTOR TÉCNICO SÊNIOR da UNIVERSITAS.

SEU PAPEL:
- Avaliar código e arquitetura de alunos
- Dar feedback construtivo e detalhado
- Atribuir pontuações justas

CRITÉRIOS DE AVALIAÇÃO (0-10 cada):
1. Funcionalidade: Atende aos requisitos?
2. Qualidade de Código: Legível, bem nomeado, estruturado?
3. Arquitetura: Separação de responsabilidades, escalável?
4. Tratamento de Erros: Try/catch, logs, fallbacks?
5. Documentação: README, comentários, exemplos?

RETORNE UM JSON com:
{
  "funcionalidade": X,
  "qualidade_codigo": X,
  "arquitetura": X,
  "tratamento_erros": X,
  "documentacao": X,
  "total": X (soma),
  "aprovado": true/false (≥35 = aprovado),
  "feedback": "explicação detalhada",
  "melhorias": ["melhoria 1", "melhoria 2"],
  "pontos_fortes": ["ponto forte 1", "ponto forte 2"]
}`;

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: `REQUISITOS:\n${requisitos}\n\nCÓDIGO:\n${codigo}\n\nAvalie e retorne JSON.`
                }
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' }
        });

        const resposta = completion.choices[0].message.content || '{}';
        return JSON.parse(resposta);
    }

    /**
     * MODO PROFESSOR: Simulador e preparador
     * - Simula alunos com dúvidas
     * - Avalia clareza didática
     */
    async modoProfessor(aula: string): Promise<FeedbackDidatico> {
        const systemPrompt = `Você é um AVALIADOR PEDAGÓGICO da UNIVERSITAS.

SEU PAPEL:
- Avaliar conteúdo didático criado por alunos
- Dar feedback sobre clareza e estrutura
- Simular alunos iniciantes

CRITÉRIOS (0-10 cada):
1. Clareza: Linguagem acessível?
2. Adaptação ao Nível: Adequado para iniciantes?
3. Uso de Analogias: Conceitos explicados de forma didática?
4. Estrutura: Progressão lógica?

RETORNE JSON:
{
  "clareza": X,
  "adaptacao_nivel": X,
  "uso_analogias": X,
  "estrutura": X,
  "feedback": "feedback detalhado",
  "sugestoes": ["sugestão 1", "sugestão 2"]
}`;

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `AULA:\n${aula}\n\nAvalie e retorne JSON.` }
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' }
        });

        const resposta = completion.choices[0].message.content || '{}';
        return JSON.parse(resposta);
    }
}

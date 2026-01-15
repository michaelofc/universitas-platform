# 🤖 Arquitetura de IA Educacional — UNIVERSITAS

## 📋 Visão Geral

A UNIVERSITAS integra Inteligência Artificial de forma inovadora e estratégica para:
- ✅ Escalar mentoria 24/7
- ✅ Avaliar exercícios e projetos automaticamente
- ✅ Personalizar trilhas de aprendizagem
- ✅ Simular cenários reais (clientes, vendas, code review)
- ✅ Preparar alunos para serem professores

---

## 🏗️ Arquitetura da IA

### Stack Tecnológico
- **LLMs:** OpenAI GPT-4, Claude 3, Gemini 2.0
- **Embeddings:** OpenAI text-embedding-3, Cohere
- **Vector DB:** Pinecone, Chroma
- **Framework:** LangChain, LlamaIndex
- **Observability:** LangSmith, Helicone
- **Fine-tuning:** OpenAI Fine-tuning API (quando necessário)

### Componentes Principais
```
┌─────────────────────────────────────────┐
│         Interface do Aluno              │
│  (Chat, Exercícios, Dashboard)          │
└──────────────┬──────────────────────────┘
               │
        ┌──────▼──────┐
        │  Orquestrador│
        │  de Agentes  │
        └──────┬───────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐  ┌──▼───┐  ┌──▼─────┐
│ Agente│  │Agente│  │ Agente │
│ Aluno │  │Mentor│  │Professor│
└───────┘  └──────┘  └────────┘
    │          │          │
    └──────────┼──────────┘
               │
      ┌────────▼─────────┐
      │   Banco de       │
      │   Conhecimento   │
      │   (RAG)          │
      └─────────┬────────┘
                │
       ┌────────▼─────────┐
       │ Avaliador        │
       │ de Código        │
       └──────────────────┘
```

---

## 🎭 Modos de IA

### 1. Modo ALUNO (Assistente de Aprendizagem)

**Objetivo:** Ajudar o aluno a aprender, não dar respostas prontas.

**Comportamento:**
- ❌ **NÃO dá código pronto**
- ✅ **Guia com perguntas socráticas**
- ✅ **Explica conceitos com analogias**
- ✅ **Sugere recursos complementares**
- ✅ **Dá dicas, não soluções completas**

**Exemplo de Interação:**

**Aluno:** "Como faço uma integração com API?"

**IA Modo Aluno:**
*"Ótima pergunta! Antes de começar, você já leu a documentação da API que quer integrar? Vamos por partes:*

*1. Você sabe qual é o endpoint (URL) que precisa chamar?*
*2. A API precisa de autenticação? (API Key, OAuth...)*
*3. Qual método HTTP vai usar? (GET, POST...)*

*Me conte o que você já descobriu e te ajudo a ir para o próximo passo! 😊"*

**Casos de Uso:**
- Tirar dúvidas conceituais
- Debugar erros
- Entender mensagens de erro
- Escolher entre abordagens
- Encontrar recursos de estudo

---

### 2. Modo MENTOR (Revisor e Orientador)

**Objetivo:** Avaliar, dar feedback construtivo e orientar evolução técnica.

**Comportamento:**
- ✅ **Revisa código e arquitetura**
- ✅ **Identifica code smells e anti-patterns**
- ✅ **Sugere melhorias**
- ✅ **Avalia segundo critérios pedagógicos**
- ✅ **Dá feedback estruturado**

**Critérios de Avaliação:**
```json
{
  "funcionalidade": {
    "peso": 30,
    "criterios": ["Requisitos atendidos", "Funciona corretamente", "Casos de uso cobertos"]
  },
  "qualidade_codigo": {
    "peso": 20,
    "criterios": ["Legibilidade", "Naming", "Estrutura", "Comentários úteis"]
  },
  "arquitetura": {
    "peso": 20,
    "criterios": ["Separação de responsabilidades", "Escalabilidade", "Manutenibilidade"]
  },
  "tratamento_erros": {
    "peso": 15,
    "criterios": ["Try/catch", "Logs", "Mensagens claras", "Recuperação"]
  },
  "documentacao": {
    "peso": 15,
    "criterios": ["README completo", "Como usar", "Exemplos", "Troubleshooting"]
  }
}
```

**Exemplo de Feedback:**

```markdown
### Avaliação do Exercício C1M03-E01
**Pontuação:** 78/100

#### ✅ Pontos Fortes
- Código bem estruturado e legível
- Requisitos principais atendidos
- Bom uso de funções reutilizáveis

#### ⚠️ Pontos de Melhoria
1. **Tratamento de Erros (12/20):**
   - A requisição à API não está dentro de try/catch
   - Se a API cair, seu código vai quebrar
   - Sugestão: Adicione tratamento e um fallback

2. **Documentação (10/15):**
   - Falta explicar como configurar a API key
   - Adicione um exemplo de .env

#### 🚀 Próximos Passos
1. Implementar retry em caso de falha de API
2. Adicionar logs para debug
3. Criar testes básicos

**Aprovado:** Sim (≥70)
**Recomendação:** Refatorar para melhorar robustez antes do próximo módulo.
```

---

### 3. Modo PROFESSOR (Simulador e Preparador)

**Objetivo:** Treinar o aluno para ENSINAR, criando aulas e avaliando seu conteúdo.

**Comportamento:**
- ✅ **Simula alunos com dúvidas**
- ✅ **Avalia clareza didática**
- ✅ **Critica roteiros de aula**
- ✅ **Simula objeções e perguntas difíceis**
- ✅ **Avalia capacidade de simplificar**

**Casos de Uso:**
- Aluno cria uma aula e a IA simula alunos assistindo
- Aluno prepara mentoria e a IA faz perguntas difíceis
- Aluno cria curso e a IA revisa conteúdo pedagógico

**Exemplo de Simulação:**

**Contexto:** Aluno do Ciclo 3 está criando aula sobre "Webhooks"

**IA Modo Professor (simulando aluno iniciante):**

*"Professor, não entendi... Webhook é tipo uma API? Qual a diferença?"*

**Aluno responde...**

**IA avalia a resposta:**
```markdown
### Avaliação Didática
**Clareza:** 7/10
- Você usou termos técnicos demais
- A analogia entre "polling" e "webhook" ficou boa, mas poderia ser mais visual

**Sugestão:**
Use uma analogia do mundo real logo no início, tipo:
"API é você ligando para o restaurante toda hora perguntando 'a pizza ficou pronta?'
Webhook é o restaurante te avisar quando ficar pronta."

**Adaptação ao nível:** 6/10
- Você assumiu que o aluno sabe o que é polling
- Explique isso antes de comparar
```

---

## 🧠 Base de Conhecimento (RAG)

### Conteúdo Indexado
- ✅ Toda documentação dos módulos
- ✅ Exemplos e exercícios resolvidos de ciclos anteriores
- ✅ Documentações oficiais (APIs, frameworks)
- ✅ Casos reais de sucesso
- ✅ FAQs e dúvidas comuns

### Pipeline de RAG
```
Pergunta do Aluno
       ↓
Embedding da Pergunta
       ↓
Busca Semântica (Vector DB)
       ↓
Reranking (relevância)
       ↓
Contexto Relevante
       ↓
LLM + Contexto + Prompt
       ↓
Resposta Personalizada
```

### Otimização de Custos
- **Caching** de respostas comuns
- **Throttling** de chamadas (max 10 por minuto)
- **Modelos diferentes por complexidade:**
  - GPT-3.5-turbo: Dúvidas simples e rápidas
  - GPT-4: Avaliação de código e feedback complexo
  - Claude: Revisão de textos e aulas

---

## 📊 Avaliação Automática

### Tipos de Avaliação

#### 1. Avaliação de Código (Estática)
Ferramentas:
- **Linting:** ESLint, Pylint
- **Code Smells:** SonarQube
- **Security:** Snyk, Bandit

#### 2. Avaliação Funcional (Dinâmica)
- Testes automatizados
- Chamadas de API simuladas
- Validação de outputs esperados

#### 3. Avaliação Arquitetural (LLM)
Prompt para GPT-4:
```
Você é um arquiteto sênior revisando um projeto de aluno.

CÓDIGO:
{codigo}

REQUISITOS:
{requisitos}

Avalie segundo os critérios:
1. Arquitetura (0-10): Separação de responsabilidades, escalabilidade
2. Tratamento de Erros (0-10): Try/catch, logs, fallbacks
3. Segurança (0-10): Validação de inputs, secrets, autenticação
4. Performance (0-10): Queries otimizadas, caching, paginação

Retorne JSON:
{
  "pontuacoes": {...},
  "total": X,
  "aprovado": true/false,
  "feedback": "...",
  "melhorias": [...]
}
```

#### 4. Avaliação de Documentação (LLM)
Critérios:
- README completo?
- Como instalar e rodar está claro?
- Há exemplos?
- Troubleshooting?

---

## 🎮 Simulações Interativas com IA

### Simulação 1: Cliente em Reunião de Vendas
**Objetivo:** Treinar venda consultiva

**Cenário:**
Aluno deve vender uma automação para um cliente fictício (IA).

**IA comporta-se como:**
- Cliente cético
- Faz objeções ("muito caro", "não preciso disso")
- Pergunta ROI detalhado
- Questiona viabilidade técnica

**Avaliação:**
- Clareza na explicação (leigo entendeu?)
- Cálculo correto de ROI
- Resposta a objeções
- Fechamento

---

### Simulação 2: Code Review em Pair Programming
**Objetivo:** Treinar feedback técnico

**Cenário:**
IA apresenta um código com bugs e pede feedback.

**Aluno deve:**
- Identificar problemas
- Sugerir melhorias
- Explicar de forma não-agressiva
- Ensinar, não menosprezar

**IA avalia:**
- Quantos problemas identificou?
- Sugestões foram construtivas?
- Explicação foi didática?

---

## 📈 Personalização de Trilha

### Perfis de Aprendizagem
A IA identifica padrões e adapta:

**Aluno Visual:**
- Mais diagramas e vídeos
- Exemplos visuais

**Aluno Prático:**
- Mais exercícios, menos teoria
- Projetos hands-on

**Aluno Teórico:**
- Mais fundamentos e conceitos
- Leituras aprofundadas

### Ajuste de Dificuldade
Se aluno está:
- **Travado:** IA sugere conteúdo complementar, revisão de base
- **Voando:** IA desbloqueia conteúdo avançado, desafios extras
- **Desanimado:** IA envia mensagens de motivação, mostra progresso

---

## 🔐 Ética e Guardrails

### Regras da IA UNIVERSITAS
1. **Nunca dar código pronto** (exceto exemplos didáticos)
2. **Sempre verificar plágio** (compara com internet e outros alunos)
3. **Respeitar privacidade** (nunca vazar dados de alunos)
4. **Ser inclusiva** (linguagem respeitosa e acolhedora)
5. **Admitir limitações** ("não sei, vou pesquisar")

### Detecção de Trapaça
- Código copiado da internet (similarity search)
- Exercício muito avançado para nível do aluno (red flag)
- Entregas idênticas entre alunos

---

## 💰 Gestão de Custos de IA

### Estimativa de Custos Mensais
**Premissas:**
- 100 alunos ativos
- 50 interações IA/aluno/mês = 5.000 interações

**Breakdown:**
- 60% GPT-3.5-turbo (dúvidas simples): $50
- 30% GPT-4 (avaliações): $200
- 10% Embeddings (RAG): $10

**Total estimado:** ~$260/mês para 100 alunos = $2.60/aluno

---

## 🚀 Roadmap de Evolução

### v1.0 (Atual)
- ✅ Modo Aluno, Mentor, Professor
- ✅ Avaliação automatizada básica
- ✅ RAG com conteúdo da universidade

### v2.0 (Q2 2026)
- Fine-tuning de modelo específico UNIVERSITAS
- Speech-to-text para aulas gravadas
- Análise de sentimento (detectar frustração)

### v3.0 (Q4 2026)
- Multi-modal (analisar diagramas e fluxos)
- Co-piloto de automação (sugestões em tempo real)
- IA que cria exercícios personalizados

---

**© 2026 UNIVERSITAS — IA Educacional v1.0**

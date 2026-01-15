# UNIVERSITAS — DOCUMENTO MESTRE  
**Mapa Completo da Formação Técnica (Ciclos 1-5)**

**Criado:** 15 de Janeiro de 2026  
**Autor:** IA Educacional da UNIVERSITAS  
**Propósito:** Memória permanente do projeto, guia para criação de conteúdo futuro

---

## 📋 ÍNDICE

1. [Status Atual](#status-atual)
2. [Filosofia Pedagógica](#filosofia-pedagógica)
3. [Ciclo 1 — Fundamentos (COMPLETO)](#ciclo-1)
4. [Ciclo 2 — Integração Profissional (ROADMAP)](#ciclo-2)
5. [Ciclo 3 — Arquitetura de Sistemas (ROADMAP)](#ciclo-3)
6. [Ciclo 4 — Automação com IA (ROADMAP)](#ciclo-4)
7. [Ciclo 5 — Produtos e Liderança (ROADMAP)](#ciclo-5)
8. [TCC de Cada Ciclo](#tcc)
9. [Progressão de Competências](#progressão)
10. [Próximos Passos](#próximos-passos)

---

<a name="status-atual"></a>
## 📊 STATUS ATUAL (15/01/2026)

### ✅ COMPLETO

#### Ciclo 1 — Fundamentos de Automação
**Status:** 100% criado  
**Arquivos:** 25+  
**Palavras:** ~150.000  
**Módulos:** 10 completos

**Arquivos Detalhados:**
- Módulo 1: 7 arquivos (5 aulas + exercícios + checklist)
- Módulo 2: 6 arquivos (4 aulas + exercícios + checklist)
- Módulos 3-10: 2 arquivos consolidados (conteúdo + exercícios)

**Localização:** `/ciclos/ciclo-1-fundamentos/`

### 🗺️ ROADMAPS CRIADOS

#### Ciclos 2-5
**Status:** Estrutura definida, módulos mapeados  
**Arquivos:** READMEs existentes em `/ciclos/ciclo-X/`  
**Próximo:** Criar aulas detalhadas sob demanda

---

<a name="filosofia-pedagógica"></a>
## 🎓 FILOSOFIA PEDAGÓGICA (IMUTÁVEL)

### Princípios Fundamentais

1. **Produto-First**
   - Cada módulo = 1 produto vendável
   - Sem exercícios fictícios
   - Cliente real ou simulação realista

2. **Rigor Técnico**
   - Código profissional desde dia 1
   - Sem atalhos ou simplificações excessivas
   - Decisões arquiteturais justificadas

3. **Progressão Validada**
   - Checklist objetivo de domínio
   - Não avança sem dominar anterior
   - Entrega obrigatória (Git público)

4. **Didática Humana**
   - Linguagem clara, não acadêmica
   - Analogias do mundo real
   - Tom de mentor experiente

5. **Comercial Integrado**
   - Precificação realista
   - ROI calculado
   - Pitch de venda incluído

### Estrutura Obrigatória de Cada Módulo

```
modulo-XX-nome/
├── README.md (visão geral, objetivo, produto)
├── aula-01-topico.md
├── aula-02-topico.md
├── aula-XX-topico.md
├── exercicios.md (progressivos, sem gabarito completo)
└── checklist-dominio.md (60+ itens objetivos)
```

### Critérios de Aprovação (Aplicar a TODOS os Ciclos)

- [ ] Produto funcional entregue
- [ ] Código no Git público
- [ ] README explicável para outro dev
- [ ] Evidência de uso real OU proposta comercial
- [ ] Capacidade de explicar sem roteiro (vídeo 5min)
- [ ] Checklist 100% marcado honestamente

---

<a name="ciclo-1"></a>
## 🎯 CICLO 1 — FUNDAMENTOS DE AUTOMAÇÃO

### Perfil de Entrada
Adulto autodidata com:
- Lógica de programação básica
- Terminal confortável
- Vontade de construir produtos reais

### Perfil de Saída
**Desenvolvedor Júnior Real** capaz de:
- Criar automações do zero
- Integrar 2+ sistemas via API
- Persistir dados profissionalmente
- Tratar erros com resiliência
- Explicar decisões técnicas
- Cobrar R$ 2k-10k por projeto

### Duração Estimada
**6 meses** (20h/semana, ritmo intenso)

### Módulos (10)

#### M1: Webhook Receiver Profissional
**Produto:** Sistema que recebe, valida e persiste webhooks  
**Stack:** Node.js, Express, SQLite, HMAC  
**Valor:** R$ 800-1.500

**Aulas (5):**
1. Introdução a Webhooks
2. HTTP na Prática
3. Express.js e Middlewares
4. Validação e Segurança (HMAC)
5. SQLite e Persistência

**Competências:**
- HTTP profundo (métodos, headers, status)
- Servidor Express estruturado
- Validação HMAC (+timing-safe)
- SQL básico (INSERT, SELECT, WHERE)
- Idempotência

#### M2: Event Dispatcher
**Produto:** Processador de eventos com retry e background jobs  
**Stack:** Bull, Redis, Winston  
**Valor:** R$ 1.500-3.000

**Aulas (4):**
1. Pattern Matching e Strategy Pattern
2. Workers e Background Jobs
3. Retry Logic e Backoff Exponencial
4. Logging Estruturado

**Competências:**
- Strategy Pattern (handlers desacoplados)
- Bull + Redis (filas)
- Retry exponencial + jitter
- Logging estruturado (Winston)
- Observabilidade básica

#### M3: Multi-API Orchestrator
**Produto:** Lead Sync Engine (Sheets ↔ CRM ↔ Slack)  
**Stack:** OAuth 2.0, Google API, HubSpot, Slack  
**Valor:** R$ 2.500-5.000

**Tópicos Principais:**
- OAuth 2.0 (autorização segura)
- Rate limiting (respeitar 429)
- Pagination (cursor, offset/limit)
- Data transformation (mappers)
- Caching (Redis)
- Scheduling (node-cron)

**Competências:**
- OAuth 2.0 completo (tokens, refresh)
- Integração com 3+ APIs
- Transformação de dados entre schemas
- Cache estratégico
- Workflows agendados

#### M4: Database Relacional (PostgreSQL)
**Produto:** Automation Audit System (schema completo)  
**Stack:** PostgreSQL, Knex/Prisma (migrations)  
**Valor:** R$ 1.800-4.000

**Tópicos Principais:**
- Modelagem 3FN (normalização)
- SQL avançado (JOINs, GROUP BY, CTEs, window functions)
- Migrations versionadas
- Índices (B-tree, quando criar)
- Transações ACID
- Connection pooling

**Competências:**
- Modelagem profissional
- Queries otimizadas
- Migrations seguras
- Performance de banco
- Análise com EXPLAIN

#### M5: API REST Design
**Produto:** Automation Manager API v1  
**Stack:** Express, JWT, Zod, Swagger, Supertest  
**Valor:** R$ 3.000-8.000

**Tópicos Principais:**
- REST principles (recursos, verbos, status)
- JWT (autenticação, refresh tokens)
- Paginação + filtros + sorting
- Validação (Zod)
- Rate limiting distribuído
- OpenAPI/Swagger (docs automática)
- Testes E2E (Supertest)

**Competências:**
- API RESTful profissional
- Autenticação JWT segura
- Documentação automática
- Validação robusta
- Testes automatizados

#### M6: Resiliência & Monitoring
**Produto:** Resilient Webhook Proxy  
**Stack:** Circuit breaker, DLQ, Prometheus, Slack  
**Valor:** R$ 2.000-6.000

**Tópicos Principais:**
- Circuit breaker pattern
- Dead Letter Queue (DLQ)
- Retry strategies avançadas
- Health checks (liveness, readiness)
- Metrics (Prometheus format)
- Alerting (Slack, email)
- Runbooks (procedimentos)

**Competências:**
- Sistemas resilientes
- Monitoramento ativo
- Alertas automáticos
- SLA 99%+
- Incident response

#### M7: CI/CD & Deploy
**Produto:** Auto-Deploy Pipeline  
**Stack:** Docker, GitHub Actions, Railway/Render  
**Valor:** R$ 1.500-4.000

**Tópicos Principais:**
- Docker (multi-stage, otimização)
- docker-compose (orquestração local)
- GitHub Actions (CI/CD)
- Secrets management
- Blue-green deployment
- Rollback strategy
- Environments (dev, staging, prod)

**Competências:**
- Containerização
- CI/CD automático
- Deploy em <5min
- Rollback em <2min
- DevOps básico

#### M8: Performance & Escalabilidade
**Produto:** High-Performance API (1000 req/s)  
**Stack:** clinic.js, Redis, Artillery/k6  
**Valor:** R$ 2.500-7.000

**Tópicos Principais:**
- Profiling (flamegraphs, identificar gargalos)
- Redis caching (strategies, TTL, invalidation)
- Query optimization (EXPLAIN, índices, N+1)
- Concurrency (workers, clusters)
- Load testing (Artillery, k6)
- Memory leaks (heap snapshots)
- Horizontal scaling (conceitos)

**Competências:**
- Otimização profunda
- Profiling avançado
- Caching estratégico
- Load testing
- Escalabilidade horizontal

#### M9: Dashboard & No-Code Layer
**Produto:** Automation Studio (interface visual)  
**Stack:** React/Vanilla JS, WebSockets  
**Valor:** R$ 3.000-10.000

**Tópicos Principais:**
- Frontend básico (React ou JS puro)
- WebSockets (real-time)
- Forms complexos (validação client-side)
- State management
- Export/Import (JSON configs)
- Responsive design

**Competências:**
- Interface funcional
- Real-time com WebSocket
- UX para não-técnicos
- Self-service automation
- Democratização de tecnologia

#### M10: Produto Vendável
**Produto:** Automation Starter Kit (pacote comercial)  
**Stack:** Docs, vídeo, pricing, contratos  
**Valor:** Diferencial de R$ 2k → R$ 15k

**Tópicos Principais:**
- Technical writing (docs para leigos)
- Pricing strategy (custo + valor + mercado)
- ROI calculator (Excel/planilha)
- SLA definition
- Video demo (Loom, 5min)
- Contract template
- Customer onboarding

**Competências:**
- Documentação comercial
- Precificação estratégica
- Pitch de venda
- Onboarding de clientes
- Pensamento de produto

### TCC Ciclo 1

**Requisitos Obrigatórios:**
- Sistema com 5+ APIs integradas
- PostgreSQL em produção
- REST API documentada (Swagger)
- Dashboard para não-técnicos
- Deploy em produção (URL pública)
- Monitoramento ativo
- Documentação comercial completa
- Vídeo pitch 10min
- Apresentação 30min (demo + técnico + comercial)

**Exemplos Válidos:**
- CRM Sync Engine
- E-commerce Fulfillment Automation
- Lead Enrichment Pipeline
- Invoice Automation System

---

<a name="ciclo-2"></a>
## 🎯 CICLO 2 — INTEGRAÇÃO PROFISSIONAL

### Perfil de Entrada
**Júnior** (Ciclo 1 completo) com:
- Automações simples funcionando
- APIs REST criadas
- Deploy básico

### Perfil de Saída
**Desenvolvedor Pleno** capaz de:
- Arquitetar microserviços
- Integrar sistemas complexos (10+ APIs)
- Event-driven architecture
- Message queues em produção
- GraphQL APIs
- Serverless functions

### Duração Estimada
**6 meses** (20h/semana)

### Módulos Planejados (10)

#### M1: Microserviços Básicos
**Produto:** Sistema dividido em 3+ microserviços comunicantes  
**Conceitos:** Service boundaries, API gateway, service mesh básico

#### M2: Message Queues (RabbitMQ)
**Produto:** Sistema pub/sub com filas persistentes  
**Conceitos:** AMQP, exchanges, routing, dead letter

#### M3: Event Sourcing
**Produto:** Sistema com log imutável de eventos  
**Conceitos:** Event store, projections, replay

#### M4: GraphQL API
**Produto:** API GraphQL substituindo REST  
**Conceitos:** Schemas, resolvers, DataLoader, subscriptions

#### M5: Serverless (AWS Lambda/Vercel)
**Produto:** Functions serverless em produção  
**Conceitos:** FaaS, cold start, stateless, triggers

#### M6: Kafka (Event Streaming)
**Produto:** Pipeline de dados em tempo real  
**Conceitos:** Topics, partitions, consumer groups, exactly-once

#### M7: API Gateway & Service Mesh
**Produto:** Gateway centralizando 5+ serviços  
**Conceitos:** Routing, rate limiting, auth centralizado

#### M8: Distributed Tracing
**Produto:** Sistema com tracing completo (Jaeger/Zipkin)  
**Conceitos:** Spans, traces, correlation, debugging distribuído

#### M9: CQRS Pattern
**Produto:** Sistema separando read/write models  
**Conceitos:** Command/Query separation, eventual consistency

#### M10: Integration Testing
**Produto:** Suite de testes de integração completa  
**Conceitos:** Contract testing, test containers, mocks

### TCC Ciclo 2

**Sistema microserviços completo:**
- 5+ microserviços desacoplados
- Message queue (RabbitMQ ou Kafka)
- API Gateway
- Distributed tracing
- Event sourcing em pelo menos 1 serviço
- Testes de integração
- Deploy orquestrado (Docker Compose ou Kubernetes básico)

---

<a name="ciclo-3"></a>
## 🎯 CICLO 3 — ARQUITETURA DE SISTEMAS

### Perfil de Entrada
**Pleno** (Ciclos 1+2) com:
- Microserviços em produção
- Event-driven architecture
- Múltiplas integrações

### Perfil de Saída
**Arquiteto/Sênior** capaz de:
- Desenhar arquiteturas escaláveis
- Tomar decisões arquiteturais fundamentadas
- Liderar tecnicamente
- Planejar sistemas distribuídos
- Ensinar e mentorar

### Duração Estimada
**6 meses** (20-25h/semana)

### Módulos Planejados (10)

#### M1: System Design Fundamentals
**Produto:** Documento de arquitetura de sistema real  
**Conceitos:** CAP theorem, trade-offs, requisitos não-funcionais

#### M2: Escalabilidade Horizontal
**Produto:** Sistema escalando de 1 → 10 instâncias  
**Conceitos:** Stateless, load balancer, session management

#### M3: Database Scaling
**Produto:** DB com read replicas + sharding  
**Conceitos:** Replication, sharding strategies, consistency

#### M4: Caching Avançado
**Produto:** Sistema com múltiplas camadas de cache  
**Conceitos:** CDN, Redis cluster, cache invalidation

#### M5: Observabilidade Completa
**Produto:** Stack completa (logs, metrics, traces, alerts)  
**Conceitos:** Three pillars, SLO/SLI, on-call

#### M6: Security Architecture
**Produto:** Sistema com security by design  
**Conceitos:** Zero trust, encryption, OWASP Top 10, pen testing

#### M7: Disaster Recovery
**Produto:** Plano de DR testado  
**Conceitos:** Backup, RTO/RPO, failover, chaos engineering

#### M8: Cost Optimization
**Produto:** Redução de 40%+ em custos cloud  
**Conceitos:** Resource optimization, auto-scaling, spot instances

#### M9: Technical Leadership
**Produto:** Liderar projeto técnico de 3+ devs  
**Conceitos:** Code review, mentorship, decisões arquiteturais

#### M10: Documentation & ADR
**Produto:** Docs arquiteturais completos (C4, ADRs)  
**Conceitos:** Architecture Decision Records, diagramas, runbooks

### TCC Ciclo 3

**Arquitetura completa de sistema distribuído:**
- Design document (30+ páginas)
- Sistema com 10+ componentes
- Escalável horizontalmente
- Observabilidade completa
- Security hardened
- DR plan testado
- Apresentação arquitetural para stakeholders

---

<a name="ciclo-4"></a>
## 🎯 CICLO 4 — AUTOMAÇÃO COM IA

### Perfil de Entrada
**Sênior** (Ciclos 1+2+3) com:
- Arquiteturas sólidas
- Sistemas em produção
- Liderança técnica

### Perfil de Saída
**Sênior + IA Specialist** capaz de:
- Integrar LLMs em sistemas reais
- RAG em produção
- Criar agentes autônomos
- Fine-tuning de modelos
- IA ética e responsável

### Duração Estimada
**6-9 meses** (25h/semana)

### Módulos Planejados (12)

#### M1: LLM Fundamentals
**Produto:** Sistema usando GPT-4/Claude em produção  
**Conceitos:** Prompts, temperature, tokens, cost optimization

#### M2: RAG (Retrieval Augmented Generation)
**Produto:** Chatbot com conhecimento corporativo  
**Conceitos:** Vector DB, embeddings, semantic search, chunking

#### M3: LangChain/LlamaIndex
**Produto:** Pipeline complexo com chains  
**Conceitos:** Agents, tools, memory, orchestration

#### M4: Fine-tuning
**Produto:** Modelo customizado para domínio específico  
**Conceitos:** Dataset prep, training, evaluation, deployment

#### M5: Agentic AI
**Produto:** Agente autônomo executando tarefas  
**Conceitos:** ReAct, tool use, planning, iteration

#### M6: Multimodal AI
**Produto:** Sistema processando imagem + texto + voz  
**Conceitos:** Vision models, TTS, STT, multimodal fusion

#### M7: AI Safety & Ethics
**Produto:** Sistema com guardrails e safety  
**Conceitos:** Prompt injection, data privacy, bias, alignment

#### M8: Vector Databases
**Produto:** Sistema usando Pinecone/Weaviate/Qdrant  
**Conceitos:** Vector embeddings, similarity search, indexing

#### M9: Evaluation & Testing
**Produto:** Suite de testes para outputs de LLM  
**Conceitos:** Metrics, human eval, A/B testing, benchmarks

#### M10: Cost & Performance
**Produto:** Sistema otimizado (custo -50%, latency -40%)  
**Conceitos:** Caching, smaller models, batching, streaming

#### M11: AI Workflows
**Produto:** Automação complexa com múltiplos LLMs  
**Conceitos:** Planning, decomposição, verificação

#### M12: Production LLMOps
**Produto:** MLOps pipeline para modelos  
**Conceitos:** Monitoring, versioning, rollback, cost tracking

### TCC Ciclo 4

**Sistema de IA em produção:**
- RAG completo (vector DB + LLM)
- 3+ agentes especializados
- Guardrails de segurança
- Evaluation suite
- Custo otimizado (<$100/mês para 1k usuários)
- Docs de uso responsável
- Apresentação: IA + ética + ROI

---

<a name="ciclo-5"></a>
## 🎯 CICLO 5 — PRODUTOS, SAAS E LIDERANÇA

### Perfil de Entrada
**Sênior/Arquiteto** (Ciclos 1-4) com:
- Sistemas complexos em produção
- IA integrada
- Liderança técnica

### Perfil de Saída
**Master/Tech Lead/Founder** capaz de:
- Criar SaaS multi-tenant
- Monetizar produtos
- Liderar equipes
- Growth hacking
- Open source e comunidade

### Duração Estimada
**9-12 meses** (30h/semana)

### Módulos Planejados (14)

#### M1: Multi-Tenant SaaS
**Produto:** SaaS com isolamento de dados por tenant  
**Conceitos:** Tenant isolation, shared schema vs separate DB

#### M2: Authentication & Authorization (Advanced)
**Produto:** Sistema com RBAC, SSO, MFA  
**Conceitos:** Role-Based Access Control, OAuth providers, 2FA

#### M3: Billing & Subscriptions
**Produto:** Sistema de billing completo (Stripe)  
**Conceitos:** Plans, metering, invoicing, dunning, trials

#### M4: Onboarding & Activation
**Produto:** Funil de onboarding otimizado  
**Conceitos:** User activation, tooltips, analytics, A/B testing

#### M5: Analytics & Metrics
**Produto:** Dashboard de product analytics  
**Conceitos:** MRR, churn, CAC, LTV, cohort analysis

#### M6: Growth Hacking
**Produto:** Crescer de 0 → 1000 usuários  
**Conceitos:** Viral loops, referrals, SEO, content marketing

#### M7: Email Automation
**Produto:** Drip campaigns + transactional emails  
**Conceitos:** ESP, deliverability, templates, personalization

#### M8: API as a Product
**Produto:** API monetizável com rate limits por tier  
**Conceitos:** API keys, metering, docs, developer experience

#### M9: White-Label Solutions
**Produto:** Sistema rebrandable para parceiros  
**Conceitos:** Custom domains, branding, reseller model

#### M10: Open Source Strategy
**Produto:** Projeto open source ativo  
**Conceitos:** Community building, governance, sponsorship

#### M11: Technical Writing & Documentation
**Produto:** Docs técnicos classe mundial  
**Conceitos:** Docusaurus, MDX, tutorials, API reference

#### M12: Team Leadership
**Produto:** Liderar equipe de 5+ devs em projeto real  
**Conceitos:** Agile, code review, 1-on-1s, hiring

#### M13: Fundraising & Pitch
**Produto:** Pitch deck + business plan  
**Conceitos:** Valuation, cap table, investor relations

#### M14: Exit Strategy
**Produto:** Preparar produto para aquisição/IPO  
**Conceitos:** Due diligence, documentation, transition

### TCC Ciclo 5

**SaaS Completo em Produção:**
- Multi-tenant architecture
- 100+ usuários pagantes
- MRR >$1k
- Billing automático
- Analytics completo
- Team de 2+ pessoas liderado
- Open source component
- Pitch para investidores
- Exit strategy documentada

---

<a name="tcc"></a>
## 🎓 TCC DE CADA CICLO

### Progressão de Complexidade

| Ciclo | TCC | Duração TCC | Apresentação |
|-------|-----|-------------|--------------|
| C1 | Sistema 5 APIs | 6 semanas | 30min |
| C2 | Microserviços completo | 8 semanas | 45min |
| C3 | Arquitetura distribuída | 10 semanas | 60min |
| C4 | Sistema IA produção | 12 semanas | 60min |
| C5 | SaaS comercial | 16 semanas | 90min (pitch) |

### Critérios Comuns (Todos TCCs)

- [ ] Funcional em produção (URL pública)
- [ ] Código no Git (público ou privado documentado)
- [ ] Docs completas (técnica + comercial)
- [ ] Vídeo demo
- [ ] Apresentação ao vivo
- [ ] Q&A respondido competentemente

---

<a name="progressão"></a>
## 📈 PROGRESSÃO DE COMPETÊNCIAS

### Mapa de Habilidades por Ciclo

```
CICLO 1 (Júnior)
├── HTTP/REST ████████████ 100%
├── Node.js ██████████░░   80%
├── PostgreSQL ████████░░   60%
├── Docker ████░░░░░░░░   30%
├── Microserviços ░░░░░░░░░░    0%
├── IA ░░░░░░░░░░    0%
└── Liderança ░░░░░░░░░░    0%

CICLO 2 (Pleno)
├── HTTP/REST ████████████ 100%
├── Node.js ████████████ 100%
├── PostgreSQL ████████████ 100%
├── Docker ████████████ 100%
├── Microserviços ████████████ 100%
├── IA ░░░░░░░░░░    0%
└── Liderança ████░░░░░░░░   30%

CICLO 3 (Sênior)
├── HTTP/REST ████████████ 100%
├── Node.js ████████████ 100%
├── PostgreSQL ████████████ 100%
├── Docker ████████████ 100%
├── Microserviços ████████████ 100%
├── IA ░░░░░░░░░░    0%
└── Liderança ██████████░░   80%

CICLO 4 (Sênior + IA)
├── HTTP/REST ████████████ 100%
├── Node.js ████████████ 100%
├── PostgreSQL ████████████ 100%
├── Docker ████████████ 100%
├── Microserviços ████████████ 100%
├── IA ████████████ 100%
└── Liderança ████████████ 100%

CICLO 5 (Master)
├── HTTP/REST ████████████ 100%
├── Node.js ████████████ 100%
├── PostgreSQL ████████████ 100%
├── Docker ████████████ 100%
├── Microserviços ████████████ 100%
├── IA ████████████ 100%
├── Liderança ████████████ 100%
└── Negócio ████████████ 100%
```

---

<a name="próximos-passos"></a>
## 🚀 PRÓXIMOS PASSOS

### Imediato (Agora)
1. Michael estuda Ciclo 1 (6 meses)
2. Executa exercícios rigorosamente
3. Constrói portfólio real

### Quando Dominar C1
1. Solicitar criação detalhada de C2
2. IA cria aulas completas (1 dia)
3. Michael estuda C2 (6 meses)

### Longo Prazo (2-4 anos)
- Completar todos 5 ciclos
- TCC de cada ciclo entregue
- Portfolio robusto
- Experiência real de mercado
- Pronto para fundar/liderar

---

## 🔒 PRINCÍPIOS IMUTÁVEIS

**Ao criar conteúdo futuro de C2-C5, SEMPRE seguir:**

1. ✅ Produto real por módulo
2. ✅ Rigor técnico (código profissional)
3. ✅ Checklists objetivos
4. ✅ Valor comercial documentado
5. ✅ Conexão entre módulos
6. ✅ Pré-requisitos claros
7. ✅ Progressão validada
8. ✅ Didática humana
9. ✅ Git obrigatório
10. ✅ Apresentação/pitch

**NUNCA fazer:**
- ❌ Exercícios fictícios
- ❌ Simplificação excessiva
- ❌ Pular validação
- ❌ Conteúdo sem produto
- ❌ Teoria sem prática

---

**FIM DO DOCUMENTO MESTRE**

**Última Atualização:** 15 de Janeiro de 2026  
**Próxima Revisão:** Quando Ciclo 2 for criado

---

**© 2026 UNIVERSITAS — Este documento é a memória permanente do projeto.**

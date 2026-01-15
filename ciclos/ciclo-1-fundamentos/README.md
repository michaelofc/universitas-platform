# CICLO 1 — FUNDAMENTOS DE AUTOMAÇÃO

**Perfil de Entrada:** Técnico autodidata com lógica de programação básica  
**Perfil de Saída:** Profissional capaz de criar automações vendáveis e integrar sistemas  
**Duração Estimada:** 6-8 meses (ritmo intenso)  
**Aprovação Mínima:** 70% em cada módulo + TCC funcional

---

## OBJETIVO DO CICLO

Ao concluir este ciclo, você será capaz de:

1. **Criar automações do zero** usando Node.js e APIs REST
2. **Integrar múltiplos sistemas** via webhooks e integrações HTTP
3. **Persistir dados** em bancos relacionais com segurança
4. **Tratar erros** de forma profissional e debugar problemas complexos
5. **Documentar soluções** para clientes técnicos e leigos
6. **Precificar e vender** suas automações com confiança
7. **Arquitetar** soluções escaláveis (preparação para Ciclo 2)

---

## ESTRUTURA: 10 MÓDULOS PRÁTICOS

Cada módulo constrói um **produto real**. Sem exercícios fictícios.

---

## MÓDULO 1: FUNDAÇÕES — WEBHOOK RECEIVER PROFISSIONAL

### Objetivo Prático
Criar um servidor HTTP robusto que recebe webhooks, valida, persiste e responde adequadamente. Este é a base de 90% das automações profissionais.

### Produto Final Obrigatório
**"Webhook Logger Pro"** — Sistema que:
- Recebe POST requests de qualquer fonte
- Valida assinaturas HMAC (segurança)
- Salva payload em SQLite com timestamp
- Expõe API para consultar logs
- Retorna status codes corretos (200, 400, 401, 500)

### Competências Técnicas
- HTTP profundo (métodos, headers, status codes)
- Express.js ou Fastify (Node.js)
- Validação de entrada (joi/zod)
- SQLite (SQL básico: INSERT, SELECT, WHERE)
- Tratamento de erros (try/catch, middleware)
- Variáveis de ambiente (.env)

### Critérios Objetivos de Aprovação
- [ ] Servidor roda em `localhost:3000`
- [ ] Aceita POST em `/webhook`
- [ ] Valida signature HMAC-SHA256
- [ ] Retorna 401 se signature inválida
- [ ] Salva em DB com `id`, `timestamp`, `payload`, `source`
- [ ] GET `/logs` retorna últimos 100 eventos
- [ ] README com instruções de setup
- [ ] `.env.example` documentado

### Entrega Obrigatória (Git)
```
modulo-01-webhook-receiver/
├── server.js
├── db.js
├── middleware/validate.js
├── .env.example
├── package.json
└── README.md
```

### Critério de Domínio
**Teste prático:** Receber um webhook do Stripe/GitHub simulado e explicar linha por linha o que acontece no código.

### Conexão com Próximo Módulo
Este webhook receiver será a **entrada** do módulo 2, onde você vai **processar** os eventos recebidos.

---

## MÓDULO 2: PROCESSAMENTO — EVENT DISPATCHER

### Objetivo Prático
Transformar eventos recebidos em ações práticas. Aprender a tomar decisões baseadas em dados e executar workflows condicionais.

### Produto Final Obrigatório
**"Event Router Pro"** — Sistema que:
- Lê eventos do webhook logger (Módulo 1)
- Classifica por tipo (`payment`, `user_signup`, `order`)
- Executa ações diferentes por tipo:
  - `payment` → envia email de confirmação
  - `user_signup` → cria registro em outro DB
  - `order` → chama API externa de fulfillment
- Registra sucesso/falha de cada ação

### Competências Técnicas
- Pattern matching (switch/case, strategy pattern)
- Workers/background jobs (bull, agenda)
- Integração com APIs externas (fetch/axios)
- Idempotência (não reprocessar eventos)
- Retry logic (backoff exponencial)
- Logging estruturado (winston, pino)

### Critérios Objetivos de Aprovação
- [ ] Lê eventos da tabela do Módulo 1
- [ ] Classifica corretamente 3+ tipos de evento
- [ ] Executa ação específica por tipo
- [ ] Marca evento como `processed`/`failed` no DB
- [ ] Implementa retry automático (3x com backoff)
- [ ] Logs em JSON estruturado
- [ ] Testes unitários para cada handler

### Entrega Obrigatória (Git)
```
modulo-02-event-dispatcher/
├── dispatcher.js
├── handlers/
│   ├── payment.handler.js
│   ├── signup.handler.js
│   └── order.handler.js
├── utils/retry.js
├── tests/
└── README.md
```

### Critério de Domínio
**Teste prático:** Simular falha de API externa e demonstrar retry funcionando. Explicar quando escolher fila vs polling vs cron.

### Conexão com Próximo Módulo
Agora você processa eventos internos. No módulo 3, vai **orquestrar múltiplas APIs externas** em um único fluxo.

---

## MÓDULO 3: INTEGRAÇÃO — MULTI-API ORCHESTRATOR

### Objetivo Prático
Integrar 3+ APIs de serviços reais em um workflow coeso. Lidar com autenticação, rate limits e transformação de dados entre sistemas incompatíveis.

### Produto Final Obrigatório
**"Lead Sync Engine"** — Automação que:
- Pega leads de Google Sheets (via API)
- Enriquece com Clearbit/Hunter.io (email)
- Valida se já existe no CRM (HubSpot/Pipedrive)
- Se novo: cria + adiciona a sequência
- Se existente: atualiza campos
- Notifica Slack com resumo diário

### Competências Técnicas
- OAuth 2.0 (refresh tokens)
- API pagination (cursor, offset, limit)
- Rate limiting (respectar 429, backoff)
- Data transformation (mapper functions)
- Validação de schemas (JSON Schema)
- Caching (redis, memory)
- Scheduling (node-cron)

### Critérios Objetivos de Aprovação
- [ ] Conecta 3+ APIs com autenticação real
- [ ] Implementa refresh token automático
- [ ] Respeita rate limits (max 5 req/s por API)
- [ ] Transforma dados entre schemas diferentes
- [ ] Detecta duplicatas (email, telefone)
- [ ] Executa de hora em hora (cron)
- [ ] Dashboard HTML simples com últimos syncs

### Entrega Obrigatória (Git)
```
modulo-03-multi-api-orchestrator/
├── orchestrator.js
├── connectors/
│   ├── sheets.client.js
│   ├── hubspot.client.js
│   └── slack.client.js
├── transformers/
├── cache/
├── dashboard/index.html
└── README.md (com setup OAuth)
```

### Critério de Domínio
**Teste prático:** Adicionar uma 4ª API (escolha livre) em <30min. Explicar diferença entre OAuth, API Key e JWT.

### Conexão com Próximo Módulo
Você orquestrou APIs. Agora vai **persistir fluxos complexos** em banco relacional normalizado.

---

## MÓDULO 4: PERSISTÊNCIA — BANCO DE DADOS RELACIONAL

### Objetivo Prático
Modelar dados de automações de forma profissional. Aprender normalização, transações, índices e queries otimizadas.

### Produto Final Obrigatório
**"Automation Audit System"** — Schema PostgreSQL que:
- Armazena execuções de automações
- Relaciona: `automations`, `executions`, `steps`, `errors`
- Query: "Todas automações com >10% falha nos últimos 7 dias"
- Query: "Top 5 erros mais comuns por automação"
- Implementa soft delete (nunca DELETE, usa `deleted_at`)
- Migrations versionadas (Knex/Prisma)

### Competências Técnicas
- Modelagem relacional (3FN)
- SQL avançado (JOINs, GROUP BY, window functions)
- Indexes (B-tree, quando usar)
- Transactions (ACID)
- Migrations (versionamento de schema)
- ORM vs raw SQL (quando usar cada um)
- Connection pooling

### Critérios Objetivos de Aprovação
- [ ] Schema normalizado (3FN, diagrama ER)
- [ ] 4+ tabelas relacionadas corretamente
- [ ] 5+ queries complexas documentadas
- [ ] Migrations forward e rollback funcionando
- [ ] Seeds de dados de teste realistas
- [ ] Índices em colunas de busca frequente
- [ ] Query plan explicado (EXPLAIN ANALYZE)

### Entrega Obrigatória (Git)
```
modulo-04-database/
├── migrations/
│   ├── 001_create_automations.js
│   ├── 002_create_executions.js
│   └── ...
├── seeds/
├── queries/
│   ├── dashboards.sql
│   └── reports.sql
├── schema.png (diagrama ER)
└── README.md
```

### Critério de Domínio
**Teste prático:** Modelar schema de um e-commerce (produtos, pedidos, clientes) em 20min. Explicar CASCADE vs SET NULL.

### Conexão com Próximo Módulo
Dados estruturados prontos. Agora vai **expor via API REST** para outros consumirem.

---

## MÓDULO 5: API REST — DESIGN E IMPLEMENTAÇÃO

### Objetivo Prático
Criar API REST profissional, documentada, segura e escalável. Aprender convenções, versionamento e boas práticas.

### Produto Final Obrigatório
**"Automation Manager API v1"** — REST API que:
- CRUD completo de automações
- Autenticação JWT
- Paginação (`?page=1&limit=10`)
- Filtros (`?status=active&category=sales`)
- Sorting (`?sort=-created_at`)
- Validação de input (Zod)
- Rate limiting (100 req/15min)
- Swagger/OpenAPI spec completo
- Health checks (`/health`, `/ready`)

### Competências Técnicas
- REST principles (recursos, verbos, status codes)
- JWT (assinatura, expiração, refresh)
- Middleware chain (auth, validation, error)
- API versioning (URL, header)
- CORS (quando, como, why)
- API documentation (OpenAPI 3.0)
- Security headers (helmet.js)

### Critérios Objetivos de Aprovação
- [ ] 5+ endpoints RESTful corretos
- [ ] JWT auth funcionando
- [ ] Validação de todos inputs
- [ ] Paginação + filtros + sort
- [ ] Rate limit ativo
- [ ] Swagger UI acessível em `/docs`
- [ ] Testes E2E com Supertest
- [ ] Postman collection exportada

### Entrega Obrigatória (Git)
```
modulo-05-api-rest/
├── routes/
│   ├── automations.routes.js
│   └── auth.routes.js
├── controllers/
├── middleware/
├── swagger/openapi.yaml
├── tests/e2e/
├── postman/
└── README.md
```

### Critério de Domínio
**Teste prático:** Consumir sua própria API via cURL. Explicar diferença entre autenticação e autorização.

### Conexão com Próximo Módulo
API pronta. Agora vai **lidar com erros complexos** e implementar observabilidade.

---

## MÓDULO 6: RESILIÊNCIA — ERROR HANDLING & MONITORING

### Objetivo Prático
Transformar código "que funciona" em código **confiável em produção**. Aprender a prever, capturar e se recuperar de falhas.

### Produto Final Obrigatório
**"Resilient Webhook Proxy"** — Sistema que:
- Recebe webhooks
- Tenta entregar para múltiplos destinos
- Se falhar: retry com backoff (até 24h)
- Dead letter queue após 5 tentativas
- Alertas no Slack se taxa de falha >20%
- Dashboard de métricas (uptime, latência, erros)
- Log aggregation (estruturado, searchable)

### Competências Técnicas
- Circuit breaker pattern
- Retry strategies (linear, exponential, jitter)
- Dead letter queues
- Health checks (liveness, readiness)
- Structured logging (correlação com trace_id)
- Metrics (Prometheus format)
- Alerting (thresholds, escalation)

### Critérios Objetivos de Aprovação
- [ ] Circuit breaker implementado (fecha após 5 falhas)
- [ ] Retry com backoff exponencial
- [ ] DLQ funcional (eventos irrecuperáveis)
- [ ] Logs com trace_id em todas requisições
- [ ] Dashboard de métricas (HTML + Chart.js)
- [ ] Alerta automático no Slack
- [ ] Documentação de runbook (o que fazer quando...)

### Entrega Obrigatória (Git)
```
modulo-06-resiliencia/
├── proxy.js
├── patterns/
│   ├── circuit-breaker.js
│   └── retry.js
├── monitoring/
│   ├── metrics.js
│   └── alerts.js
├── dashboard/
├── RUNBOOK.md
└── README.md
```

### Critério de Domínio
**Teste prático:** Simular falha cascata em 3 serviços. Demonstrar circuit breaker salvando o sistema.

### Conexão com Próximo Módulo
Sistema resiliente. Agora vai **automatizar deploys** e infraestrutura.

---

## MÓDULO 7: DEPLOY — CI/CD E INFRAESTRUTURA

### Objetivo Prático
Colocar suas automações em produção de forma profissional. Aprender Docker, CI/CD e infraestrutura como código.

### Produto Final Obrigatório
**"Auto-Deploy Pipeline"** — Setup que:
- App dockerizado (Node.js + PostgreSQL)
- CI com testes automáticos (GitHub Actions)
- Deploy automático no Railway/Render/Fly.io
- Rollback em 1 comando
- Variáveis de ambiente por ambiente (dev, staging, prod)
- Health checks pré-deploy
- Notificação de deploy no Slack

### Competências Técnicas
- Docker (Dockerfile, compose, layers)
- CI/CD (GitHub Actions, GitLab CI)
- Secrets management
- Multi-stage deploys
- Blue-green deployment
- Infrastructure as Code (básico)
- Monitoring pós-deploy

### Critérios Objetivos de Aprovação
- [ ] Dockerfile multi-stage otimizado (<100MB)
- [ ] docker-compose para dev local
- [ ] CI roda testes em cada push
- [ ] Deploy automático em merge to main
- [ ] Rollback documentado e testado
- [ ] 3 ambientes (dev, staging, prod)
- [ ] Logs centralizados (stdout/stderr)

### Entrega Obrigatória (Git)
```
modulo-07-deploy/
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/
│   ├── test.yml
│   └── deploy.yml
├── infrastructure/
├── scripts/rollback.sh
└── README.md
```

### Critério de Domínio
**Teste prático:** Deploy uma mudança em <5min. Rollback em <2min. Explicar diferença entre imagem e container.

### Conexão com Próximo Módulo
Infra pronta. Agora vai **otimizar performance** e escalar.

---

## MÓDULO 8: PERFORMANCE — OTIMIZAÇÃO E ESCALABILIDADE

### Objetivo Prático
Fazer suas automações rodarem rápido e suportarem carga real. Aprender profiling, caching e concorrência.

### Produto Final Obrigatório
**"High-Performance API"** — API que:
- Serve 1000 req/s (medido com Artillery)
- Latência p95 <100ms
- Cache inteligente (Redis, 5min TTL)
- Connection pooling (DB)
- Bulk operations (processa 1000 items/vez)
- Rate limiting distribuído
- Graceful shutdown

### Competências Técnicas
- Profiling (clinic.js, flamegraphs)
- Caching strategies (TTL, invalidation)
- DB query optimization (EXPLAIN, índices)
- Concurrency (workers, clusters)
- Load testing (Artillery, k6)
- Memory leaks (heap snapshots)
- Horizontal scaling (stateless)

### Critérios Objetivos de Aprovação
- [ ] Load test: 1000 req/s sustentado por 1min
- [ ] p95 latency <100ms
- [ ] Redis cache funcionando (hit rate >80%)
- [ ] Connection pool configurado (min 5, max 20)
- [ ] Bulk insert de 10k registros <5s
- [ ] Flamegraph de CPU analisado
- [ ] Zero memory leaks após 10k requests

### Entrega Obrigatória (Git)
```
modulo-08-performance/
├── server.js (otimizado)
├── benchmarks/
│   ├── artillery-config.yml
│   └── results.json
├── profiling/
│   ├── flamegraph.svg
│   └── heap-snapshot.heapsnapshot
├── OPTIMIZATION.md
└── README.md
```

### Critério de Domínio
**Teste prático:** Identificar bottleneck em código lento (dado) e otimizar 10x.

### Conexão com Próximo Módulo
Performance resolvida. Agora vai **criar interface** para não-técnicos.

---

## MÓDULO 9: INTERFACE — DASHBOARD E NO-CODE LAYER

### Objetivo Prático
Permitir que não-programadores usem suas automações. Criar interfaces simples e poderosas.

### Produto Final Obrigatório
**"Automation Studio"** — Dashboard que:
- Lista todas automações (tabela sortável)
- Criar nova automação (formulário visual)
- Configurar triggers (dropdowns, não código)
- Testar automação (botão "Run Now")
- Ver logs de execução (timeline)
- Editar variáveis sem tocar código
- Exportar/importar configurações (JSON)

### Competências Técnicas
- Frontend básico (React/Vue ou Vanilla JS)
- Forms complexos (validação client-side)
- Websockets (real-time logs)
- Drag-and-drop (opcional, sortable)
- State management
- API integration (fetch)
- User experience (feedback, loading states)

### Critérios Objetivos de Aprovação
- [ ] CRUD completo via interface
- [ ] Formulário validado (frontend + backend)
- [ ] Logs em tempo real (WebSocket)
- [ ] Filtros e busca funcionais
- [ ] Exportar automação como JSON
- [ ] Importar JSON e recriar automação
- [ ] Mobile-friendly (responsive)

### Entrega Obrigatória (Git)
```
modulo-09-dashboard/
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── backend/
│   └── websocket-server.js
├── screenshots/
└── README.md
```

### Critério de Domínio
**Teste prático:** Explicar dashboard para não-técnico e fazê-lo criar uma automação sozinho.

### Conexão com Próximo Módulo
Interface pronta. Agora vai **vender** isso como produto.

---

## MÓDULO 10: PRODUTO — DOCUMENTAÇÃO, PRICING E VENDA

### Objetivo Prático
Transformar código em **produto comercializável**. Aprender a documentar, precificar e vender soluções técnicas.

### Produto Final Obrigatório
**"Automation Starter Kit"** — Pacote vendável que:
- README para cliente (não-técnico)
- Guia de instalação (1-click Heroku button)
- Vídeo de demonstração (5min, Loom)
- Documentação de API (Postman)
- Calculadora de ROI (planilha)
- 3 tier pricing (Básico, Pro, Enterprise)
- Contrato de serviço (SLA)
- FAQ de vendas

### Competências Técnicas
- Technical writing (docs para leigos)
- Pricing strategy (custo + valor + mercado)
- SLA definition (uptime, suporte)
- Video creation (screen recording)
- ROI calculation
- Licensing (MIT, comercial)
- Customer onboarding

### Critérios Objetivos de Aprovação
- [ ] README explicável para leigo
- [ ] 1-click deploy funcionando
- [ ] Vídeo demo <5min, claro
- [ ] Pricing baseado em valor entregue
- [ ] Calculadora ROI com 3 cenários
- [ ] SLA definido (99% uptime, <24h suporte)
- [ ] Contrato revisado por advogado (modelo)

### Entrega Obrigatória (Git)
```
modulo-10-produto/
├── docs/
│   ├── README-CLIENT.md
│   ├── INSTALLATION.md
│   └── API.md
├── pricing/
│   ├── tiers.md
│   └── roi-calculator.xlsx
├── legal/
│   ├── SLA.md
│   └── CONTRACT-TEMPLATE.md
├── demo.mp4
└── README.md
```

### Critério de Domínio
**Teste prático:** Pitch de 10min para "cliente" (role-play). Responder objeções técnicas e comerciais.

---

## TCC — TRABALHO DE CONCLUSÃO DE CICLO

### Requisitos Obrigatórios

Criar uma **automação comercial completa** que:

1. **Integre 5+ serviços** via API
2. **Persista dados** em PostgreSQL
3. **Exponha REST API** documentada
4. **Tenha dashboard** para não-técnicos
5. **Esteja em produção** (URL acessível)
6. **Tenha monitoramento** (uptime, erros)
7. **Documentação** comercial completa
8. **Vídeo pitch** de venda (10min)

### Exemplos Válidos de TCC

- **CRM Sync Engine**: Google Sheets ↔ HubSpot ↔ Slack
- **E-commerce Fulfillment**: Shopify → Shipping API → Email → Sheets
- **Lead Enrichment Pipeline**: Formulário → Clearbit → Validation → CRM
- **Invoice Automation**: Stripe → Contabilidade → Email → Drive
- **Social Media Scheduler**: Airtable → Buffer → Analytics → Slack

### Apresentação (Banca)

- **Duração:** 30 minutos
- **Formato:**
  - 10min: Demo ao vivo
  - 10min: Explicação técnica (arquitetura, decisões)
  - 10min: Pitch comercial (valor, pricing, ROI)
- **Critérios:** Funcionalidade (40%), Código (30%), Apresentação (30%)

---

## DIPLOMA

Ao concluir com ≥70% em cada módulo + TCC aprovado:

**TÉCNICO EM AUTOMAÇÃO E INTEGRAÇÃO DE SISTEMAS**

Você estará pronto para:
- Cobrar R$ 500-2000 por automação simples
- Trabalhar como freelancer em automações
- Evoluir para Ciclo 2 (Integrações Complexas)
- Ensinar outros desenvolvedores
- Arquitetar soluções maiores

---

## PRÓXIMOS PASSOS

**Após Ciclo 1, você pode:**

1. **Ciclo 2 — Integração Profissional**  
   Micro-SaaS, webhooks bidirecionais, arquiteturas event-driven

2. **Especialização em IA (Ciclo 4)**  
   LLMs, RAG, agentes inteligentes aplicados a automações

3. **Mercado de Trabalho**  
   Freelancer, consultor, ou emprego em empresa de automação

---

## FILOSOFIA PEDAGÓGICA

- **Aprenda fazendo** (não lendo)
- **Produtos reais** (não exercícios)
- **Rigor técnico** (código profissional desde dia 1)
- **Autonomia** (você é responsável pelo seu aprendizado)
- **Comunidade** (compartilhe, ensine, colabore)

---

**Este não é um curso. É uma formação técnica rigorosa.**

**Se você concluir, você é um profissional. Sem asteriscos.**

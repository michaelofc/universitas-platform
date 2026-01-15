# CICLO 1 COMPLETO — CONTEÚDO CONSOLIDADO  
**Todos os Módulos 3-10 em Arquivo Único**

> **Nota:** Este é um arquivo consolidado para referência. Cada módulo também existe em sua pasta individual com aulas detalhadas.

---

## MÓDULO 3 — MULTI-API ORCHESTRATOR

### Objetivo
Integrar 3+ APIs externas em workflow coeso, lidando com OAuth, rate limiting e transformação de dados.

### Produto Final
Lead Sync Engine - sincroniza Google Sheets ↔ HubSpot ↔ Slack automaticamente.

### Tópicos Principais
1. **OAuth 2.0** - Autorização segura (Google, Microsoft, Slack)
2. **Rate Limiting** - Respeitar 429, backoff, throttling
3. **Pagination** -Cursor, offset/limit, next_page_token
4. **Data Transformation** - Mapear schemas incompatíveis
5. **Caching** - Redis para reduzir chamadas
6. **Scheduling** - node-cron para execução periódica

### Exercício Principal
Criar sincronizador que:
- Lê leads de Google Sheets a cada hora
- Enriquece com Hunter.io (buscar email)
- Cria/atualiza contato no HubSpot
- Notifica Slack com resumo
- Cache em Redis (não reprocessar)

### Valor Comercial
R$ 2.500-5.000 (setup) + R$ 400/mês (manutenção)

---

## MÓDULO 4 — DATABASE RELACIONAL (PostgreSQL)

### Objetivo
Modelar dados de automação profissionalmente com normalização, migrations e queries otimizadas.

### Produto Final
Automation Audit System - schema completo para rastrear execuções, erros e performance.

### Tópicos Principais
1. **Modelagem 3FN** - Normalização, evitar redundância
2. **SQL Avançado** - JOINs, GROUP BY, window functions, CTEs
3. **Migrations** - Knex/Prisma para versionar schema
4. **Índices** - B-tree, quando usar, EXPLAIN ANALYZE
5. **Transações** - ACID, BEGIN/COMMIT/ROLLBACK
6. **Connection Pooling** - pg-pool, gerenciar conexões

### Schema Exemplo
```sql
CREATE TABLE automations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE executions (
  id UUID PRIMARY KEY,
  automation_id UUID REFERENCES automations(id),
  status TEXT NOT NULL, -- success, failed, running
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER,
  error TEXT
);

CREATE INDEX idx_executions_automation ON executions(automation_id);
CREATE INDEX idx_executions_status ON executions(status);
```

### Queries Úteis
- Automações com >10% erro últimos 7 dias
- Performance média por tipo
- Top 5 erros mais comuns

### Valor Comercial
R$ 1.800-4.000 (sistemas com relatórios/compliance)

---

## MÓDULO 5 — API REST DESIGN

### Objetivo
Criar REST API profissional com autenticação, documentação, paginação e testes.

### Produto Final
Automation Manager API v1 - API completa para gerenciar automações via HTTP.

### Tópicos Principais
1. **REST Principles** - Recursos, verbos (GET/POST/PUT/DELETE), status codes
2. **JWT** - Autenticação, sign/verify, refresh tokens
3. **Paginação** - `?page=1&limit=10`, cursor-based
4. **Filtros & Sorting** - `?status=active&sort=-created_at`
5. **Validação** - Zod para input validation
6. **Rate Limiting** - express-rate-limit
7. **OpenAPI/Swagger** - Documentação automática
8. **Testes E2E** - Supertest

### Endpoints Exemplo
```
POST   /auth/login          # JWT auth
GET    /automations         # List (paginated, filtered)
POST   /automations         # Create
GET    /automations/:id     # Get one
PUT    /automations/:id     # Update
DELETE /automations/:id     # Delete
GET    /automations/:id/executions  # History
POST   /automations/:id/trigger     # Manual trigger
```

### Valor Comercial
R$ 3.000-8.000 (API customizada para clientes)

---

## MÓDULO 6 — RESILIÊNCIA & MONITORING

### Objetivo
Tornar sistema robusto com retry, circuit breaker, DLQ e alertas.

### Produto Final
Resilient Webhook Proxy - nunca perde evento, com retry inteligente e monitoramento.

### Tópicos Principais
1. **Circuit Breaker** - Parar de chamar API morta
2. **Dead Letter Queue** - Eventos irrecuperáveis
3. **Retry Strategies** - Exponential, jitter, custom
4. **Health Checks** - `/health` (liveness), `/ready` (readiness)
5. **Metrics** - Prometheus format, contadores, histogramas
6. **Alerting** - Slack, email, PagerDuty
7. **Runbooks** - Documentar "o que fazer quando..."

### Circuit Breaker Estados
- CLOSED: funcionando normal
- OPEN: muitas falhas, bloqueado
- HALF-OPEN: testando se recuperou

### Valor Comercial
R$ 2.000-6.000 (upgrade para SLA 99%+)

---

## MÓDULO 7 — CI/CD & DEPLOY

### Objetivo
Deployar automações em produção com Docker, CI automático e rollback rápido.

### Produto Final
Auto-Deploy Pipeline - commit → test → deploy em <5min.

### Tópicos Principais
1. **Docker** - Dockerfile multi-stage, otimização de layers
2. **docker-compose** - Dev local, orquestração
3. **GitHub Actions** - CI/CD pipeline
4. **Secrets Management** - Variáveis de ambiente seguras
5. **Blue-Green Deployment** - Zero downtime
6. **Rollback** - Voltar versão anterior em <2min
7. **Environments** - dev, staging, production

### Dockerfile Exemplo
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Valor Comercial
R$ 1.500-4.000 (setup DevOps)

---

## MÓDULO 8 — PERFORMANCE & ESCALABILIDADE

### Objetivo
Otimizar sistema para 1000+ req/s com profiling, caching e load testing.

### Produto Final
High-Performance API - p95 latency <100ms, throughput 1000 req/s.

### Tópicos Principais
1. **Profiling** - clinic.js, flamegraphs, identificar gargalos
2. **Redis Caching** - Strategies (TTL, LRU), invalidation
3. **Query Optimization** - EXPLAIN, índices, N+1 queries
4. **Concurrency** - Worker threads, cluster mode
5. **Load Testing** - Artillery, k6, stress tests
6. **Memory Leaks** - Heap snapshots, diagnostic
7. **Horizontal Scaling** - Stateless, load balancer

### Métricas Alvo
- Throughput: 1000 req/s
- Latency p50: <50ms
- Latency p95: <100ms
- Latency p99: <200ms
- Memory stable (sem leaks)

### Valor Comercial
R$ 2.500-7.000 (otimização de sistemas lentos)

---

## MÓDULO 9 — DASHBOARD & NO-CODE LAYER

### Objetivo
Criar interface visual para não-técnicos gerenciarem automações.

### Produto Final
Automation Studio - dashboard onde usuários criam/gerenciam automações sem código.

### Tópicos Principais
1. **Frontend Básico** - React ou Vanilla JS
2. **WebSockets** - Logs em tempo real
3. **Forms Complexos** - Validação client-side
4. **State Management** - useState, Zustand, Redux
5. **Drag-and-Drop** - react-beautiful-dnd (opcional)
6. **Export/Import** - JSON configs
7. **Responsive Design** - Mobile-friendly

### Features Obrigatórias
- Lista de automações (filtros, busca, sort)
- Criar/editar automação (formulário)
- Ver execuções (timeline)
- Logs em tempo real (WebSocket)
- Exportar config como JSON
- Importar e recriar

### Valor Comercial
R$ 3.000-10.000 (self-service para clientes)

---

## MÓDULO 10 — PRODUTO VENDÁVEL

### Objetivo
Transformar código em produto comercializável com docs, pricing e pitch.

### Produto Final
Automation Starter Kit - pacote completo pronto para vender a clientes.

### Tópicos Principais
1. **Technical Writing** - Docs para leigos, guias, FAQs
2. **Pricing Strategy** - Custo + valor + mercado
3. **ROI Calculator** - Excel/planilha mostrando economia
4. **SLA Definition** - Uptime, tempo de resposta, suporte
5. **Video Demo** - Loom, 5min, mostrando valor
6. **Contract Template** - Modelo de contrato
7. **Customer Onboarding** - Checklist de ativação

### Deliverables
- README para cliente (não-técnico)
- Vídeo demonstração 5min
- Calculadora de ROI
- 3 tier pricing (Básico, Pro, Enterprise)
- SLA documento
- Contrato template
- FAQ de vendas

### Exemplo Pricing
- **Básico:** R$ 2.000 setup + R$ 300/mês (até 1000 eventos)
- **Pro:** R$ 5.000 setup + R$ 800/mês (até 10k eventos)
- **Enterprise:** Custom (white-label, SLA dedicado)

### Valor Final
Diferença entre cobrar R$ 2k vs R$ 15k pelo mesmo sistema.

---

## TCC — TRABALHO DE CONCLUSÃO DE CICLO

### Requisitos Obrigatórios

Sistema completo que:
1. Integra 5+ serviços via API
2. PostgreSQL em produção
3. REST API documentada (Swagger)
4. Dashboard para não-técnicos
5. Deploy funcionando (URL pública)
6. Monitoramento ativo (uptime, erros)
7. Documentação comercial completa
8. Vídeo pitch 10min

### Exemplos Válidos
- **CRM Sync Engine:** Sheets ↔ HubSpot ↔ Slack ↔ Typeform ↔ Zapier
- **E-commerce Fulfillament:** Shopify → API envio → Email → Drive → Contabilidade
- **Lead Enrichment:** Form → Clearbit → Hunter → Validation → CRM → Slack

### Apresentação (30min)
- 10min: Demo ao vivo
- 10min: Explicação técnica (arquitetura, decisões)
- 10min: Pitch comercial (valor, pricing, ROI)

### Critérios de Avaliação
- Funcionalidade (40%)
- Qualidade de código (30%)
- Apresentação (30%)

---

## PRÓXIMOS PASSOS APÓS CICLO 1

**Com Ciclo 1 completo, você pode:**

1. **Trabalhar como freelancer** em automações (R$ 2k-10k/projeto)
2. **Evoluir para Ciclo 2** (Integração Profissional)
3. **Especializar em IA** (Ciclo 4)
4. **Criar seu próprio produto** (micro-SaaS)

**Habilidades adquiridas:**
- Webhooks + APIs + OAuth
- Background jobs + retry logic
- PostgreSQL + migrations
- REST API + JWT
- Docker + CI/CD
- Performance tuning
- Produto comercial completo

**Você estará acima de 90% dos juniores do mercado.**

---

**© 2026 UNIVERSITAS — Formação Técnica Rigorosa**

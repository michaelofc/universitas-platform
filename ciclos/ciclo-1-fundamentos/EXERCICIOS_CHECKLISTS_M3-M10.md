# EXERCÍCIOS E CHECKLISTS — MÓD ULOS 3-10  
**Arquivo Consolidado de Todos os Exercícios Práticos**

---

## 📋 MÓDULO 3 — MULTI-API ORCHESTRATOR

### Exercícios

**Ex. 1:** OAuth Google Sheets ⭐⭐☆☆☆
- Implementar autorização OAuth 2.0
- Ler dados de planilha
- Salvar tokens no banco

**Ex. 2:** Rate Limiting ⭐⭐⭐☆☆
- Chamar API com limite 10 req/min
- Implementar throttling automático
- Log de requests throttled

**Ex. 3:** Data Transformation ⭐⭐⭐⭐☆
- Mapear schema Google Sheets → HubSpot
- Transformar campos (nome completo → first_name + last_name)
- Validar antes de enviar

**Ex. 4:** Lead Sync Completo ⭐⭐⭐⭐⭐
- Sistema completo: Sheets → Hunter → HubSpot → Slack
- Cache em Redis (não reprocessar)
- Cron job a cada hora
- Dashboard com estatísticas

### Checklist de Domínio

- [ ] Consigo implementar OAuth 2.0 do zero
- [ ] Sei lidar com refresh tokens
- [ ] Entendo rate limiting e como respeitar
- [ ] Consigo transformar dados entre schemas
- [ ] Sei usar Redis para caching
- [ ] Implementei sincronizador completo
- [ ] Sistema roda a cada hora sem falhas

---

## 📋 MÓDULO 4 — DATABASE RELACIONAL

### Exercícios

**Ex. 1:** Modelagem 3FN ⭐⭐⭐☆☆
- Modelar schema de e-commerce (produtos, pedidos, clientes)
- Normalizar até 3FN
- Desenhar diagrama ER

**Ex. 2:** Migrations ⭐⭐⭐⭐☆
- Criar 5 migrations progressivas
- Forward e rollback funcionando
- Documentar mudanças

**Ex. 3:** Queries Otimizadas ⭐⭐⭐⭐☆
- Criar query: automações com >10% falha em 7 dias
- Top 5 erros mais comuns
- Performance por tipo
- Otimizar com índices (EXPLAIN ANALYZE)

**Ex. 4:** Automation Audit System ⭐⭐⭐⭐⭐
- Schema completo (automations, executions, errors)
- Migrations versionadas
- 10+ queries úteis
- Connection pooling
- Testes de performance

### Checklist de Domínio

- [ ] Sei normalizar até 3FN
- [ ] Consigo criar migrations versionadas
- [ ] Entendo JOINs, GROUP BY, window functions
- [ ] Sei quando criar índices
- [ ] Consigo usar EXPLAIN ANALYZE
- [ ] Implementei connection pooling
- [ ] Schema pronto para produção

---

## 📋 MÓDULO 5 — API REST

### Exercícios

**Ex. 1:** CRUD Básico ⭐⭐☆☆☆
- GET, POST, PUT, DELETE para /users
- Validação com Zod
- Status codes corretos

**Ex. 2:** JWT Auth ⭐⭐⭐☆☆
- POST /auth/login (gera JWT)
- Middleware de autenticação
- Refresh token

**Ex. 3:** Paginação & Filtros ⭐⭐⭐⭐☆
- `?page=1&limit=10`
- `?status=active&sort=-created_at`
- Header com total de páginas

**Ex. 4:** API Completa ⭐⭐⭐⭐⭐
- CRUD de automações
- JWT auth
- Paginação, filtros, sorting
- Rate limiting
- Swagger docs
- Testes E2E (Supertest)

### Checklist de Domínio

- [ ] Sei criar REST API profissional
- [ ] Entendo JWT (sign, verify, refresh)
- [ ] Implementei paginação corretamente
- [ ] Consigo validar input com Zod
- [ ] Documentei com Swagger
- [ ] Testes E2E cobrindo endpoints principais
- [ ] API pronta para produção

---

## 📋 MÓDULO 6 — RESILIÊNCIA

### Exercícios

**Ex. 1:** Circuit Breaker ⭐⭐⭐⭐☆
- Implementar circuit breaker
- Testar 3 estados (CLOSED, OPEN, HALF-OPEN)
- Log de mudanças de estado

**Ex. 2:** DLQ ⭐⭐⭐⭐☆
- Dead Letter Queue para jobs falhados
- Dashboard para revisar manualmente
- Retry manual

**Ex. 3:** Health Checks ⭐⭐⭐☆☆
- `/health` (liveness)
- `/ready` (readiness - verifica DB, Redis)
- Usado por load balancer

**Ex. 4:** Sistema Resiliente Completo ⭐⭐⭐⭐⭐
- Circuit breaker em APIs externas
- Retry com backoff
- DLQ funcional
- Health checks
- Metrics (Prometheus format)
- Alertas no Slack
- Runbook documentado

### Checklist de Domínio

- [ ] Consigo implementar circuit breaker
- [ ] Sei criar DLQ
- [ ] Entendo health checks (liveness vs readiness)
- [ ] Implementei metrics (Prometheus)
- [ ] Alertas automáticos funcionando
- [ ] Runbook documentado
- [ ] Sistema nunca perde evento

---

## 📋 MÓDULO 7 — CI/CD & DEPLOY

### Exercícios

**Ex. 1:** Dockerfile ⭐⭐⭐☆☆
- Dockerfile multi-stage
- Imagem <100MB
- docker-compose para dev local

**Ex. 2:** GitHub Actions ⭐⭐⭐⭐☆
- CI que roda testes em cada push
- Deploy automático em merge to main
- Secrets gerenciados

**Ex. 3:** Rollback ⭐⭐⭐⭐☆
- Script de rollback
- Testar voltar versão
- Tempo <2min

**Ex. 4:** Pipeline Completo ⭐⭐⭐⭐⭐
- Docker otimizado
- CI/CD funcionando
- 3 ambientes (dev, staging, prod)
- Deploy em <5min
- Rollback em <2min
- Logs centralizados

### Checklist de Domínio

- [ ] Sei criar Dockerfile otimizado
- [ ] Consigo configurar GitHub Actions
- [ ] Implementei deploy automático
- [ ] Rollback funciona (<2min)
- [ ] 3 ambientes separados
- [ ] Secrets gerenciados corretamente
- [ ] Pipeline pronto para produção

---

## 📋 MÓDULO 8 — PERFORMANCE

### Exercícios

**Ex. 1:** Profiling ⭐⭐⭐⭐☆
- Usar clinic.js em API lenta
- Identificar gargalo
- Otimizar

**Ex. 2:** Redis Caching ⭐⭐⭐⭐☆
- Implementar cache de queries
- TTL de 5min
- Invalidação em updates
- Hit rate >80%

**Ex. 3:** Load Testing ⭐⭐⭐⭐☆
- Artillery config para 1000 req/s
- Rodar teste
- Identificar limite
- Otimizar até atingir meta

**Ex. 4:** High-Performance API ⭐⭐⭐⭐⭐
- API que aguenta 1000 req/s
- p95 latency <100ms
- Redis cache otimizado
- Connection pooling
- Profiling feito
- Load tests passando
- Zero memory leaks

### Checklist de Domínio

- [ ] Sei fazer profiling (clinic.js)
- [ ] Consigo identificar gargalos
- [ ] Implementei Redis caching
- [ ] Otimizei queries SQL
- [ ] Load testing configurado
- [ ] API atinge 1000 req/s
- [ ] p95 <100ms

---

## 📋 MÓDULO 9 — DASHBOARD

### Exercícios

**Ex. 1:** CRUD Interface ⭐⭐⭐☆☆
- Lista de automações
- Formulário criar/editar
- Busca e filtros

**Ex. 2:** WebSocket Real-Time ⭐⭐⭐⭐☆
- Logs em tempo real
- Conexão via WebSocket
- Scroll automático

**Ex. 3:** Export/Import ⭐⭐⭐⭐☆
- Exportar automação como JSON
- Importar e recriar
- Validação do JSON

**Ex. 4:** Automation Studio Completo ⭐⭐⭐⭐⭐
- CRUD completo via interface
- Logs em tempo real
- Export/Import funcionando
- Filtros e busca
- Mobile-friendly
- Não-técnico consegue usar sozinho

### Checklist de Domínio

- [ ] Consigo criar interface funcional
- [ ] Implementei WebSocket para real-time
- [ ] Export/Import funcionando
- [ ] Design responsivo
- [ ] Não-técnico consegue usar
- [ ] Dashboard pronto para produção

---

## 📋 MÓDULO 10 — PRODUTO VENDÁVEL

### Exercícios

**Ex. 1:** Documentação para Leigo ⭐⭐⭐☆☆
- README explicável para não-técnico
- Guia de instalação (1-click)
- FAQ com 10+ perguntas

**Ex. 2:** Vídeo Demo ⭐⭐⭐⭐☆
- Gravar demo de 5min
- Mostrar valor (não código)
- Exportar e publicar

**Ex. 3:** Pricing Strategy ⭐⭐⭐⭐⭐
- Definir 3 tiers (Básico, Pro, Enterprise)
- Calcular custo + margem
- Justificar preço com ROI
- Criar calculator Excel

**Ex. 4:** Starter Kit Completo ⭐⭐⭐⭐⭐
- Docs completa
- Vídeo demo
- Pricing definido
- ROI calculator
- SLA documento
- Contrato template
- Pitch de venda (10min)

### Checklist de Domínio

- [ ] Sei escrever docs para leigo
- [ ] Gravei vídeo demonstrativo
- [ ] Pricing justificado com ROI
- [ ] SLA definido
- [ ] Contrato template pronto
- [ ] Consigo fazer pitch de venda
- [ ] Produto pronto para vender

---

## 🎯 TCC — CHECKLIST FINAL

### Requisitos Técnicos
- [ ] Integra 5+ APIs
- [ ] PostgreSQL em produção
- [ ] REST API documentada
- [ ] Dashboard funcional
- [ ] Deploy em produção (URL)
- [ ] Monitoramento ativo
- [ ] Testes automatizados

### Requisitos Comerciais
- [ ] Documentação completa
- [ ] Vídeo pitch 10min
- [ ] Pricing definido
- [ ] ROI calculator
- [ ] Primeira venda feita (ou proposta enviada)

### Apresentação
- [ ] Demo ao vivo funciona
- [ ] Explicação técnica clara
- [ ] Pitch comercial convincente

**Se todos checkboxes:** ✅ Aprovado no Ciclo 1  
**Diploma:** Técnico em Automação e Integração de Sistemas

---

**Parabéns por completar o Ciclo 1!**  
**Próximo:** Ciclo 2 - Integração Profissional

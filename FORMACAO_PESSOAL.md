# 🎯 FORMAÇÃO PESSOAL — MICHAEL RODRIGUES

**Início:** 15 de Janeiro de 2026  
**Meta:** Técnico em Automação e Integração de Sistemas (UNIVERSITAS)  
**Status:** Em Progresso 🔄

---

## 🎓 OBJETIVO

Me formar como desenvolvedor capaz de:
- ✅ Criar automações reais do zero
- ✅ Integrar sistemas via APIs e webhooks
- ✅ Arquitetar soluções escaláveis
- ✅ Vender e precificar corretamente
- ✅ Sustentar financeiramente com isso

**Não aceito certificado de participação. Só vale se eu ENTREGAR.**

---

## 📜 REGRA DE OURO

**Nenhum módulo é considerado concluído sem:**

- [ ] Produto funcional (rodando, não "quase pronto")
- [ ] Repositório público no GitHub
- [ ] README explicando:
  - O que faz
  - Como rodar
  - Por que fiz cada decisão técnica
  - Quanto cobrar por isso
- [ ] Evidência de uso real OU proposta comercial completa
- [ ] Capacidade de explicar em vídeo (5min) sem roteiro

**Se faltar 1 item, o módulo NÃO CONTA.**

---

## 📅 CRONOGRAMA REALISTA

### FASE 1: FUNDAÇÕES (Semanas 1-4)

#### Módulo 1: Webhook Receiver Profissional
**Prazo:** 7 dias (15/01 - 22/01)  
**Esforço:** 3-4h/dia  
**Produto:** Sistema que recebe webhooks, valida HMAC, salva em SQLite

**Checklist de Conclusão:**
- [ ] Servidor Express rodando em localhost:3000
- [ ] Aceita POST em `/webhook`
- [ ] Valida signature HMAC-SHA256
- [ ] Retorna 401 se inválida, 200 se ok
- [ ] Salva em SQLite (`id`, `timestamp`, `payload`, `source`)
- [ ] GET `/logs` retorna últimos 100 eventos
- [ ] README com setup completo
- [ ] `.env.example` documentado
- [ ] Git push feito
- [ ] Vídeo de 5min explicando

**Status:** ⏳ Não iniciado

---

#### Módulo 2: Event Dispatcher
**Prazo:** 7 dias (23/01 - 30/01)  
**Esforço:** 3-4h/dia  
**Produto:** Processador de eventos com retry e logging

**Checklist de Conclusão:**
- [ ] Lê eventos da tabela do M1
- [ ] Classifica 3+ tipos (payment, signup, order)
- [ ] Executa ação específica por tipo
- [ ] Marca como `processed`/`failed` no DB
- [ ] Retry automático (3x com backoff exponencial)
- [ ] Logs estruturados em JSON
- [ ] Testes unitários para handlers
- [ ] Git push
- [ ] Vídeo explicativo

**Status:** 🔒 Bloqueado (precisa M1)

---

### FASE 2: INTEGRAÇÃO (Semanas 5-8)

#### Módulo 3: Multi-API Orchestrator
**Prazo:** 10 dias (31/01 - 10/02)  
**Esforço:** 4-5h/dia  
**Produto:** Lead Sync Engine (Sheets + CRM + Slack)

**Checklist:**
- [ ] Conecta 3+ APIs reais
- [ ] OAuth 2.0 com refresh token
- [ ] Rate limiting (max 5 req/s)
- [ ] Transforma dados entre schemas
- [ ] Detecta duplicatas
- [ ] Cron de hora em hora
- [ ] Dashboard HTML simples
- [ ] Git + vídeo

**Status:** 🔒 Bloqueado

---

#### Módulo 4: Banco Relacional
**Prazo:** 10 dias (11/02 - 21/02)  
**Esforço:** 4h/dia  
**Produto:** Schema PostgreSQL de Audit System

**Checklist:**
- [ ] Schema normalizado 3FN
- [ ] Diagrama ER desenhado
- [ ] 4+ tabelas relacionadas
- [ ] 5+ queries complexas documentadas
- [ ] Migrations (forward + rollback)
- [ ] Seeds realistas
- [ ] Índices otimizados
- [ ] EXPLAIN ANALYZE de queries críticas
- [ ] Git + vídeo

**Status:** 🔒 Bloqueado

---

### FASE 3: API E PRODUÇÃO (Semanas 9-14)

#### Módulo 5: API REST
**Prazo:** 10 dias (22/02 - 04/03)  
**Produto:** Automation Manager API v1

**Checklist:**
- [ ] 5+ endpoints RESTful
- [ ] JWT auth completo
- [ ] Paginação + filtros + sort
- [ ] Validação (Zod)
- [ ] Rate limiting ativo
- [ ] Swagger UI em `/docs`
- [ ] Testes E2E (Supertest)
- [ ] Postman collection
- [ ] Git + vídeo

**Status:** 🔒 Bloqueado

---

#### Módulo 6: Resiliência
**Prazo:** 10 dias (05/03 - 15/03)  
**Produto:** Resilient Webhook Proxy

**Checklist:**
- [ ] Circuit breaker (fecha após 5 falhas)
- [ ] Retry com backoff exponencial
- [ ] Dead Letter Queue
- [ ] Logs com trace_id
- [ ] Dashboard de métricas
- [ ] Alertas automáticos (Slack)
- [ ] Runbook documentado
- [ ] Git + vídeo

**Status:** 🔒 Bloqueado

---

#### Módulo 7: Deploy
**Prazo:** 7 dias (16/03 - 23/03)  
**Produto:** Auto-Deploy Pipeline

**Checklist:**
- [ ] Dockerfile multi-stage (<100MB)
- [ ] docker-compose funcional
- [ ] CI testa em cada push
- [ ] Deploy automático (Railway/Render)
- [ ] Rollback testado (<2min)
- [ ] 3 ambientes (dev, staging, prod)
- [ ] Secrets gerenciados
- [ ] Git + vídeo

**Status:** 🔒 Bloqueado

---

### FASE 4: OTIMIZAÇÃO E INTERFACE (Semanas 15-18)

#### Módulo 8: Performance
**Prazo:** 10 dias (24/03 - 03/04)  
**Produto:** High-Performance API

**Checklist:**
- [ ] Load test: 1000 req/s sustentado
- [ ] p95 latency <100ms
- [ ] Redis cache (hit rate >80%)
- [ ] Connection pool configurado
- [ ] Bulk insert: 10k registros <5s
- [ ] Flamegraph analisado
- [ ] Zero memory leaks
- [ ] Git + vídeo

**Status:** 🔒 Bloqueado

---

#### Módulo 9: Dashboard No-Code
**Prazo:** 10 dias (04/04 - 14/04)  
**Produto:** Automation Studio (interface)

**Checklist:**
- [ ] CRUD via interface
- [ ] Formulários validados
- [ ] Logs em tempo real (WebSocket)
- [ ] Filtros e busca
- [ ] Exportar/importar JSON
- [ ] Mobile-friendly
- [ ] Git + vídeo

**Status:** 🔒 Bloqueado

---

### FASE 5: PRODUTO COMERCIAL (Semanas 19-20)

#### Módulo 10: Produto Vendável
**Prazo:** 10 dias (15/04 - 25/04)  
**Produto:** Automation Starter Kit

**Checklist:**
- [ ] README para cliente leigo
- [ ] 1-click deploy (Heroku button)
- [ ] Vídeo demo 5min
- [ ] Pricing (3 tiers)
- [ ] ROI calculator (Excel)
- [ ] SLA definido
- [ ] Contrato template
- [ ] Git + vídeo

**Status:** 🔒 Bloqueado

---

### FASE 6: TCC (Semanas 21-26)

#### Trabalho de Conclusão de Ciclo
**Prazo:** 6 semanas (26/04 - 07/06)  
**Esforço:** 5-6h/dia  
**Produto:** Sistema Comercial Completo

**Requisitos Obrigatórios:**
- [ ] Integra 5+ serviços via API
- [ ] PostgreSQL em produção
- [ ] REST API documentada (Swagger)
- [ ] Dashboard para não-técnicos
- [ ] Deploy em produção (URL pública)
- [ ] Monitoramento ativo (uptime, erros)
- [ ] Documentação comercial completa
- [ ] Vídeo pitch 10min
- [ ] Apresentação 30min (demo + técnico + comercial)

**Exemplos Possíveis:**
1. CRM Sync Engine (Sheets ↔ HubSpot ↔ Slack)
2. E-commerce Fulfillment (Shopify → Shipping → Email)
3. Lead Enrichment Pipeline (Form → Clearbit → CRM)
4. Invoice Automation (Stripe → Contabilizad → Drive)

**Status:** 🔒 Bloqueado

---

## 📊 CRONOGRAMA VISUAL

```
JAN  |███████░░░░░░░░░░░░░░░░░░░░░░| M1-M2
FEV  |░░░░░███████████░░░░░░░░░░░░| M3-M4
MAR  |░░░░░░░░░░░░██████████████░░| M5-M7
ABR  |░░░░░░░░░░░░░░░░░░███████░░░| M8-M10
MAI  |░░░░░░░░░░░░░░░░░░░░░░████░░| TCC
JUN  |░░░░░░░░░░░░░░░░░░░░░░░░░█░░| Apresentação
```

**Conclusão Prevista:** 7 de Junho de 2026 (20 semanas)

---

## 🎯 CRITÉRIO DE DIPLOMA

**Não considero formado se não tiver:**

### 1. Produtos Entregues
- [ ] 10 repositórios públicos no GitHub
- [ ] Cada um com README profissional
- [ ] Código funcionando (não comentado)
- [ ] Evidência de testes

### 2. Sistema em Produção
- [ ] TCC rodando em URL pública
- [ ] Uptime >95% por 1 mês
- [ ] Monitoramento funcionando
- [ ] Sem erros críticos não tratados

### 3. Venda Real
- [ ] 1 automação vendida (mínimo R$ 300)
- [ ] Print/contrato como evidência
- [ ] Cliente satisfeito (depoimento)
- [ ] Valor recebido

### 4. Capacidade de Explicar
- [ ] Gravar aula de 15min sobre cada módulo
- [ ] Sem roteiro, olhando para câmera
- [ ] Explicar decisões técnicas
- [ ] Responder perguntas complexas

### 5. Autoavaliação Honesta
- [ ] Conseguiria ser contratado como júnior?
- [ ] Consigo debugar problemas sozinho?
- [ ] Entendo arquitetura do que fiz?
- [ ] Sei precificar com segurança?

**Se faltar 1 critério, NÃO estou formado.**

---

## 💰 META FINANCEIRA

**Objetivo paralelo:** Gerar renda enquanto estudo

### Marcos Financeiros:
- **Módulo 3:** Tentar vender diagnóstico (R$ 300-500)
- **Módulo 5:** Vender automação simples (R$ 800-1.500)
- **Módulo 8:** Vender sistema completo (R$ 2.000-4.000)
- **TCC:** Vender como produto (R$ 5.000+)

**Meta:** Pagar a própria formação até o final.

---

## 📈 KPIs DE PROGRESSO

Acompanhar semanalmente:

- **Commits no GitHub:** Mínimo 5/semana
- **Horas estudando:** Mínimo 20h/semana
- **Linhas de código:** >500/semana (no mínimo)
- **Bugs resolvidos:** Contar e documentar learnings
- **Propostas enviadas:** 1 por mês (pelo menos)

---

## ⚠️ REGRAS ANTI-PROCRASTINAÇÃO

### O Que NÃO Pode Acontecer:
- ❌ Ficar mais de 2 dias sem commitar
- ❌ Passar para próximo módulo sem concluir anterior
- ❌ "Quase terminar" e deixar pendente
- ❌ Assistir tutoriais sem implementar
- ❌ Desistir no primeiro erro difícil

### O Que DEVE Acontecer:
- ✅ Diário de aprendizado (5min/dia)
- ✅ Review semanal do progresso
- ✅ Pedir ajuda quando travar >3h
- ✅ Comemorar cada módulo concluído
- ✅ Compartilhar progresso publicamente

---

## 🔄 REVISÃO SEMANAL

**Toda Segunda-feira, perguntar:**

1. Quantos commits fiz semana passada?
2. Qual o maior aprendizado técnico?
3. Qual o maior erro/bug?
4. Estou no cronograma ou atrasado?
5. Preciso ajustar algo?

**Revisar este documento e ajustar metas.**

---

## 🎓 CONCLUSÃO

**Data Prevista de Formatura:** 7 de Junho de 2026

**Ao concluir, terei:**
- 10 produtos funcionais
- 1 sistema em produção
- Pelo menos 1 venda comprovada
- Portfolio melhor que 90% dos juniors
- Capacidade de ensinar o que aprendi

**E mais importante:**

**Terei PROVADO para mim mesmo que consigo.**

---

**Assinatura do Compromisso:**

Michael Rodrigues  
15 de Janeiro de 2026

_"Não aceito meio-termo. Ou faço direito ou não faço."_

---

## 📝 LOG DE PROGRESSO

### Semana 1 (15-21 Jan)
- [ ] Status: 
- [ ] Conquistas:
- [ ] Desafios:
- [ ] Próxima ação:

### Semana 2 (22-28 Jan)
- [ ] Status:
- [ ] Conquistas:
- [ ] Desafios:
- [ ] Próxima ação:

_(atualizar semanalmente)_

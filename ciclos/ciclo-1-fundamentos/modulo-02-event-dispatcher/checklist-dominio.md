# Checklist de Domínio — Módulo 2: Event Dispatcher

## 1. Conceitual

### Pattern Matching
- [ ] Sei explicar Strategy Pattern e por que é melhor que if-else
- [ ] Consigo desenhar arquitetura de dispatcher + handlers
- [ ] Entendo Open/Closed Principle
- [ ] Sei quando usar switch vs Strategy

### Background Jobs
- [ ] Consigo explicar por que processar assíncrono
- [ ] Entendo fila (queue) vs processamento direto
- [ ] Sei explicar Redis e por que é usado
- [ ] Entendo worker vs servidor

### Retry Logic
- [ ] Sei explicar backoff exponencial vs linear
- [ ] Entendo jitter e por que é necessário
- [ ] Consigo desenhar circuit breaker e seus estados
- [ ] Sei diferenciar erro temporário vs permanente

### Logging
- [ ] Entendo logging estruturado (JSON)
- [ ] Sei explicar níveis de log (debug, info, warn, error)
- [ ] Consigo explicar correlation ID
- [ ] Entendo observabilidade

---

## 2. Prático

### Implementação
- [ ] Consigo criar dispatcher com Strategy Pattern
- [ ] Sei configurar Bull + Redis
- [ ] Consigo implementar retry manager
- [ ] Sei configurar Winston

### Debugging
- [ ] Consigo debugar job que falha
- [ ] Sei identificar gargalo de performance via logs
- [ ] Consigo rastrear evento com correlation ID
- [ ] Sei usar Bull Dashboard

---

## 3. Arquitetural

### Escalabilidade
- [ ] Sei quando adicionar mais workers
- [ ] Entendo limitações do Bull
- [ ] Consigo estimar capacidade (jobs/segundo)
- [ ] Sei migrar SQLite → PostgreSQL se necessário

### Resiliência
- [ ] Consigo implementar circuit breaker
- [ ] Sei configurar Dead Letter Queue
- [ ] Entendo idempotência no contexto de retry
- [ ] Sei quando parar de fazer retry

---

## 4. Comercial

- [ ] Consigo explicar valor de processamento assíncrono para cliente
- [ ] Sei precificar sistema com background jobs
- [ ] Consigo calcular ROI de retry logic
- [ ] Sei vender observabilidade

---

## 5. Produto

- [ ] Tenho repositório com dispatcher funcional
- [ ] Sistema processa eventos em <500ms
- [ ] Workers processam assíncrono
- [ ] Logs estruturados funcionando
- [ ] Testes cobrindo handlers principais

---

## Prova Final

**Desafio 90 minutos:**

Do zero, criar:
1. Dispatcher com 3 handlers
2. Bull queue configurado
3. Worker processando jobs
4. Retry com backoff exponencial
5. Winston logging
6. README funcional

Se conseguir: ✅ Dominou Módulo 2

---

**Próximo:** Módulo 3 - Multi-API Orchestrator

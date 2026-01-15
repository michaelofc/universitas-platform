# Exercícios Práticos — Módulo 2: Event Dispatcher

## Objetivo

Consolidar conhecimento de processamento de eventos através de prática progressiva.

---

## Exercício 1: Handler Básico ⭐☆☆☆☆

### Requisitos

Criar sistema com 3 handlers:
1. `PaymentHandler` - loga pagamento recebido
2. `UserHandler` - loga novo usuário
3. `OrderHandler` - loga novo pedido

Dispatcher roteia evento para handler correto.

### Entregáveis

- Código funcional
- 3 handlers separados
- Dispatcher funcionando

---

## Exercício 2: Background Job Simples ⭐⭐☆☆☆

### Requisitos

1. Setup Redis + Bull
2. Endpoint `/webhook` que adiciona job à fila
3. Worker que processa job (apenas loga)
4. Teste com cURL

### Validação

Webhook deve responder em <300ms, processamento depois.

---

## Exercício 3: Retry com Backoff ⭐⭐⭐☆☆

### Requisitos

Implementar retry manager:
- Exponential backoff
- Máximo 5 tentativas
- Jitter de 30%
- Log de cada tentativa

Simular API que falha 3x e depois suce de.

---

## Exercício 4: Logging Estruturado ⭐⭐⭐⭐☆

### Requisitos

1. Winston configurado (console + arquivo)
2. Correlation ID em todas requisições
3. Logging de performance (duração)
4. Alerta no Slack para errors

### Entregáveis

- Logs em JSON
- Arquivo `combined.log`
- Print de alerta no Slack

---

## Exercício 5: Event Dispatcher Completo ⭐⭐⭐⭐⭐

### Requisitos

Sistema profissional completo:
1. Strategy pattern (5+ handlers)
2. Bull queue com retry
3. Logging estruturado com Winston
4. Circuit breaker para APIs externas
5. Dashboard Bull Board
6. Testes unitários de handlers

### Estrutura Esperada

```
event-dispatcher/
├── server.js
├── dispatcher.js
├── queue.js
├── worker.js
├── handlers/
│   ├── payment.handler.js
│   ├── user.handler.js
│   └── order.handler.js
├── utils/
│   ├── retry.js
│   ├── circuitBreaker.js
│   └── logger.js
├── tests/
│   └── handlers.test.js
└── README.md
```

### Validação

- [ ] Webhook responde <500ms
- [ ] Jobs processam assíncrono
- [ ] Retry funciona (testar falha)
- [ ] Logs estruturados em JSON
- [ ] Circuit breaker abre após 5 falhas
- [ ] Dashboard acessível

---

## Desafio Extra: DLQ com Review Manual

Sistema que move jobs falhados para Dead Letter Queue e permite retry manual via dashboard.

---

**Próximo:** Checklist de Domínio

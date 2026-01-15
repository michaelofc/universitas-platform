# Aula 02 — Workers e Background Jobs

## Abertura

Você já sabe classificar eventos por tipo e rotear para handlers. Mas tem um problema crítico:

**Webhook receiver precisa responder em <500ms.**

Se o processamento demora 5 segundos (enviar email, atualizar CRM, notificar), você tem 2 opções:

❌ **Ruim:** Processar síncrono (webhook demora, timeout, reenvio)  
✅ **Correto:** Processar assíncrono (responde rápido, processa depois)

Esta aula ensina **background jobs** - a forma profissional de processar tarefas demoradas.

---

## O Problema: Processamento Síncrono

```javascript
app.post('/webhook', async (req, res) => {
  const event = req.body;
  
  // Valida signature (100ms)
  validateSignature(event);
  
  // Salva no banco (50ms)
  await db.save(event);
  
  // 🔴 PROBLEMA: Processar agora
  await sendEmail(event.user);        // 2s
  await updateCRM(event);             // 3s
  await notifySlack(event);           // 1s
  await generatePDF(event);           // 4s
  // Total: 10 segundos!
  
  res.json({ received: true }); // Demora 10s para responder
});
```

**Consequências:**
- Sistema emissor (Stripe) espera 10s
- Pode dar timeout (geralmente 5-10s)
- Stripe acha que falhou e reenvia
- Você processa 2x (duplicata!)

---

## Solução: Fila de Processamento

### Conceito

```
┌──────────────┐         ┌──────────┐         ┌───────────┐
│   Webhook    │  salva  │  Fila    │ processa│  Worker   │
│   Receiver   │────────▶│  (Redis) │────────▶│ (Process) │
└──────────────┘ <300ms  └──────────┘ assínc  └───────────┘
     │                                              │
     │ Responde 200 OK                              │
     ▼                                              ▼
  Sistema emissor                            Email, CRM, etc
  (feliz, não reenvia)                      (processa tranquilo)
```

**Fluxo:**
1. Webhook chega
2. Valida + salva no banco (<300ms)
3. **Adiciona à fila** (Redis) (<50ms)
4. **Responde 200 OK** imediatamente
5. **Worker** pega job da fila e processa (pode demorar)

---

## Bull: Sistema de Filas para Node.js

### Instalação

```bash
npm install bull
npm install redis  # Servidor Redis
```

**Pré-requisito:** Redis rodando localmente ou remoto.

**Instalar Redis:**
- Windows: https://redis.io/docs/getting-started/installation/install-redis-on-windows/
- Mac: `brew install redis`
- Ubuntu: `sudo apt install redis-server`

**Rodar:**
```bash
redis-server
# Output: Redis is running on port 6379
```

---

### Setup Básico de Fila

**queue.js:**
```javascript
const Queue = require('bull');

// Criar fila
const eventQueue = new Queue('event-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  }
});

module.exports = eventQueue;
```

**Adicionar job à fila:**
```javascript
const eventQueue = require('./queue');

app.post('/webhook', async (req, res) => {
  const event = req.body;
  
  // 1. Validar
  validateSignature(event);
  
  // 2. Salvar no banco
  await db.save(event);
  
  // 3. Adicionar à fila (não processar agora!)
  await eventQueue.add('process-event', event, {
    attempts: 3,          // Tentar até 3 vezes
    backoff: {
      type: 'exponential',
      delay: 2000         // 2s, 4s, 8s
    }
  });
  
  // 4. Responder RÁPIDO
  res.json({ received: true });
});
```

**Total:** <350ms

---

### Worker: Processar Jobs

**worker.js:**
```javascript
const eventQueue = require('./queue');
const EventDispatcher = require('./dispatcher');

const dispatcher = new EventDispatcher();

// Processar jobs
eventQueue.process('process-event', async (job) => {
  const event = job.data;
  
  console.log(`Processing job ${job.id} for event ${event.id}`);
  
  try {
    await dispatcher.dispatch(event);
    console.log(`Job ${job.id} completed`);
    return { success: true };
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error);
    throw error; // Bull vai fazer retry automático
  }
});

console.log('Worker started, waiting for jobs...');
```

**Rodar worker:**
```bash
node worker.js
# Fica rodando esperando jobs
```

**Rodar servidor:**
```bash
node server.js
# Recebe webhooks, adiciona jobs
```

**Arquitetura:**
- 1 processo = servidor (recebe webhooks)
- 1+ processos = workers (processa jobs)
- Redis conecta os dois

---

## Múltiplos Workers

### Escalar Horizontalmente

```bash
# Terminal 1
node worker.js

# Terminal 2
node worker.js

# Terminal 3
node worker.js
```

**Resultado:** 3 workers pegam jobs em paralelo.

**Bull garante:** 1 job = 1 worker (não duplica).

---

## Jobs Complexos

### Job com Metadata

```javascript
await eventQueue.add('process-event', {
  event: event,
  priority: event.type === 'payment.success' ? 1 : 5, // 1 = alta
  user_id: event.user_id,
  timestamp: Date.now()
}, {
  priority: event.type === 'payment.success' ? 1 : 5,
  delay: event.schedule ? 60000 : 0, // Delay de 1min se agendado
  jobId: event.id, // Previne duplicatas
  removeOnComplete: 100, // Manter últimos 100 completos
  removeOnFail: 500      // Manter últimos 500 falhados
});
```

### Job Recorrente (Cron)

```javascript
// Executar a cada 1 hora
eventQueue.add('sync-crm', {}, {
  repeat: {
    cron: '0 * * * *' // Formato cron
  }
});

// Processar
eventQueue.process('sync-crm', async (job) => {
  console.log('Running hourly CRM sync...');
  await syncAllLeadsWithCRM();
  return { synced: true };
});
```

---

## Monitoramento de Filas

### Dashboard Bull Board

```bash
npm install @bull-board/express @bull-board/api
```

**dashboard.js:**
```javascript
const express = require('express');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const eventQueue = require('./queue');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(eventQueue)],
  serverAdapter: serverAdapter,
});

const app = express();
app.use('/admin/queues', serverAdapter.getRouter());

app.listen(3001, () => {
  console.log('Dashboard: http://localhost:3001/admin/queues');
});
```

**Acesse:** `http://localhost:3001/admin/queues`

**Veja:**
- Jobs ativos
- Completos
- Falhados
- Retry manual

---

## Padrões Avançados

### 1. Job Chaining

```javascript
// Job 1: Processar pagamento
eventQueue.add('process-payment', { payment_id: 123 });

// Quando completar, adiciona próximo
eventQueue.on('completed', (job, result) => {
  if (job.name === 'process-payment' && result.success) {
    eventQueue.add('send-receipt', {
      payment_id: job.data.payment_id,
      email: result.user_email
    });
  }
});
```

### 2. Priority Queue

```javascript
// Alta prioridade (processa primeiro)
await eventQueue.add('urgent-job', data, { priority: 1 });

// Baixa prioridade
await eventQueue.add('batch-job', data, { priority: 10 });
```

### 3. Rate Limiting

```javascript
eventQueue.process('send-email', { concurrency: 5 }, async (job) => {
  // Máximo 5 emails por vez
  await sendEmail(job.data);
});
```

---

## Error Handling

### Retry Automático

```javascript
eventQueue.add('risky-job', data, {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 1000 // 1s, 2s, 4s, 8s, 16s
  }
});
```

### Dead Letter Queue (DLQ)

```javascript
const dlq = new Queue('failed-jobs');

eventQueue.on('failed', async (job, error) => {
  console.error(`Job ${job.id} failed ${job.attemptsMade} times`);
  
  if (job.attemptsMade >= job.opts.attempts) {
    // Moveu para DLQ
    await dlq.add('manual-review', {
      original_job: job.data,
      error: error.message,
      attempts: job.attemptsMade
    });
  }
});
```

---

## Quando Usar Background Jobs

| Cenário | Síncrono | Assíncrono |
|---------|----------|------------|
| Validar webhook | ✅ | ❌ |
| Salvar no banco | ✅ | ❌ |
| Enviar email | ❌ | ✅ |
| Atualizar CRM | ❌ | ✅ |
| Gerar PDF | ❌ | ✅ |
| Processar imagem | ❌ | ✅ |
| Chamar API lenta | ❌ | ✅ |

**Regra:** Se > 500ms, assíncrono.

---

## Conexão com Produto Vendável

**Cliente paga por confiabilidade.**

Cenários:
- **E-commerce:** Pedido confirmado mas email não enviou? Job na fila, retry automático
- **Plataforma:** 1000 webhooks/min? Workers escaláveis
- **SaaS:** Processamento falhou? DLQ para análise

**Vender background jobs:**
> "Se processar síncrono, 1 falha = evento perdido. Com fila, temos retry automático, DLQ para análise e workers escaláveis. Zero perda de dados."

**Valor:** R$ 800-2.000 adicional

---

## Mini-Desafio Reflexivo

1. **Arquitetura:** Webhook de pagamento. O que processar síncrono vs assíncrono?

2. **Escalabilidade:** 10.000 jobs/hora. 1 worker aguenta? Como escalar?

3. **Falha:** Job falha 5x. O que fazer? Ignorar, alertar, DLQ?

---

**Próxima aula:** Retry Logic e Backoff Exponencial

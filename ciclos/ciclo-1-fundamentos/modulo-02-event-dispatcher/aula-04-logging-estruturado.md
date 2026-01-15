# Aula 04 — Logging Estruturado e Observ abilidade

## Abertura

Seu sistema está em produção. Cliente reclama: "Webhook não funcionou às 15h23 de ontem."

Você olha logs:

```
Server running
Event received
Processing...
Error
Done
```

**Inútil.** Qual evento? Qual erro? Por quê?

Logging profissional não é `console.log`. É **observabilidade** - capacidade de entender o que aconteceu, quando, por quê e como resolver.

Ao final desta aula:
- Logging estruturado (JSON)
- Níveis de log (debug, info, warn, error)
- Correlation IDs
- Winston na prática
- Monitoramento e alertas

---

## O Problema: Logging Caótico

```javascript
console.log('Processing event');
console.log('User ID:', userId);
console.log('Amount:', amount);
console.error('Failed!', error);
```

**Problemas:**
- Sem timestamp
- Sem contexto (qual evento?)
- Sem nível (info vs error)
- Não searchable (como achar?)
- Mistura tudo

**Em produção com 1000 eventos/min:** Impossível debugar.

---

## Logging Estruturado (JSON)

### Conceito

Ao invés de texto livre, log como **objeto estruturado:**

```json
{
  "timestamp": "2026-01-15T18:30:45.123Z",
  "level": "error",
  "message": "Payment processing failed",
  "event_id": "evt_abc123",
  "user_id": 456,
  "amount": 100,
  "error": "Insufficient funds",
  "stack": "Error: Insufficient funds\n  at processPayment...",
  "request_id": "req_xyz789"
}
```

**Vantagens:**
- Timestamp automático
- Filtrável por nível
- Searchable por qualquer campo
- Estrutura consistente

---

## Winston: Logger Profissional

### Instalação

```bash
npm install winston
```

### Setup Básico

**logger.js:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
```

**Uso:**
```javascript
const logger = require('./logger');

logger.info('Event received', { event_id: 'evt_123', type: 'payment' });
logger.error('Processing failed', { event_id: 'evt_123', error: error.message });
```

**Output (JSON):**
```json
{"timestamp":"2026-01-15T18:30:45.123Z", level":"info","message":"Event received","event_id":"evt_123","type":"payment"}
```

---

## Níveis de Log

### Hierarquia

```
DEBUG → INFO → WARN → ERROR → FATAL
  ↓       ↓      ↓       ↓       ↓
Muito  Normal  Atenção Problema Crítico
```

### Quando Usar

```javascript
// DEBUG: Detalhes de desenvolvimento
logger.debug('Calculating signature', { payload_length: 1234 });

// INFO: Eventos normais
logger.info('Event processed successfully', { event_id: 'evt_123', duration: 234 });

// WARN: Algo suspeito mas não crítico
logger.warn('Slow query detected', { query_time: 5000, table: 'events' });

// ERROR: Erro que precisa atenção
logger.error('Payment failed', { event_id: 'evt_123', error: error.message });

// FATAL: Sistema não pode continuar
logger.fatal('Database connection lost', { error: error.message });
process.exit(1);
```

### Configurar Nível

```bash
# Development
LOG_LEVEL=debug npm start  # Mostra tudo

# Production
LOG_LEVEL=info npm start   # Só info+
```

---

## Correlation ID (Request Tracing)

**Problema:** Um evento passa por 10 sistemas. Como rastrear toda jornada?

**Solução:** Correlation ID (ou Request ID)

```javascript
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

// Middleware que adiciona request_id
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  next();
});

app.post('/webhook', async (req, res) => {
  const requestId = req.id;
  
  logger.info('Webhook received', { request_id: requestId, event_type: req.body.type });
  
  try {
    await processEvent(req.body, requestId);
    logger.info('Event processed', { request_id: requestId });
    res.json({ received: true });
  } catch (error) {
    logger.error('Event processing failed', { request_id: requestId, error: error.message });
    res.status(500).json({ error: 'Processing failed' });
  }
});

async function processEvent(event, requestId) {
  logger.debug('Starting event processing', { request_id: requestId, event_id: event.id });
  
  await sendEmail(event.user, requestId);
  await updateCRM(event, requestId);
  
  logger.debug('Event processing complete', { request_id: requestId });
}

async function sendEmail(user, requestId) {
  logger.info('Sending email', { request_id: requestId, user_id: user.id });
  // ...
}
```

**Benefício:** Buscar todos logs de 1 request:

```bash
cat combined.log | grep '"request_id":"req_xyz789"'
```

Vê toda jornada do evento através do sistema.

---

## Contexto Padrão (Child Loggers)

Evitar repetir context em cada log:

```javascript
// Logger base
const baseLogger = require('./logger');

// Child logger com contexto
const eventLogger = baseLogger.child({ module: 'event-processor' });

eventLogger.info('Processing event', { event_id: 'evt_123' });
// Output: { module: 'event-processor', message: 'Processing event', event_id: 'evt_123' }
```

**Por handler:**

```javascript
class PaymentHandler {
  constructor() {
    this.logger = baseLogger.child({ handler: 'payment' });
  }
  
  async handle(event) {
    this.logger.info('Processing payment', { event_id: event.id, amount: event.amount });
    // ...
  }
}
```

Todos logs desse handler terão `handler: 'payment'`.

---

## Formato de Log (Development vs Production)

### Development (Legível)

```javascript
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}
```

**Output:**
```
info: Event received {"event_id":"evt_123"}
error: Processing failed {"error":"Network timeout"}
```

### Production (JSON)

```javascript
logger.add(new winston.transports.Console({
  format: winston.format.json()
}));
```

**Output:**
```json
{"level":"info","message":"Event received","event_id":"evt_123","timestamp":"..."}
```

---

## Logging de Performance

```javascript
async function processEvent(event) {
  const start = Date.now();
  
  logger.info('Event processing started', { event_id: event.id });
  
  try {
    await doProcessing(event);
    
    const duration = Date.now() - start;
    logger.info('Event processed', { event_id: event.id, duration });
    
    if (duration > 5000) {
      logger.warn('Slow event processing detected', { event_id: event.id, duration });
    }
  } catch (error) {
    const duration = Date.now() - start;
    logger.error('Event processing failed', { event_id: event.id, duration, error: error.message });
    throw error;
  }
}
```

**Benefício:** Detectar endpoints lentos.

---

## Alertas Automáticos

### Slack Webhook

```javascript
const axios = require('axios');

class SlackTransport extends winston.Transport {
  constructor(opts) {
    super(opts);
    this.webhookUrl = opts.webhook Hook;
  }
  
  log(info, callback) {
    setImmediate(() => this.emit('logged', info));
    
    // Só enviar errors para Slack
    if (info.level === 'error') {
      axios.post(this.webhookUrl, {
        text: `🚨 Error: ${info.message}`,
        attachments: [{
          color: 'danger',
          fields: [
            { title: 'Event ID', value: info.event_id || 'N/A' },
            { title: 'Error', value: info.error || info.message },
            { title: 'Stack', value: info.stack || 'N/A' }
          ]
        }]
      }).catch(err => console.error('Failed to send Slack alert:', err));
    }
    
    callback();
  }
}

logger.add(new SlackTransport({ webhookUrl: process.env.SLACK_WEBHOOK }));
```

Agora todo `logger.error()` notifica Slack automaticamente.

---

## Log Aggregation (Produção)

**Problema:** Múltiplos servidores, logs separados.

**Solução:** Centralizar (Datadog, Papertrail, Loggly, CloudWatch)

### Exemplo: Datadog

```bash
npm install winston-datadog-logs
```

```javascript
const DatadogWinston = require('winston-datadog-logs');

logger.add(new DatadogWinston({
  apiKey: process.env.DATADOG_API_KEY,
  service: 'webhook-receiver',
  ddsource: 'nodejs',
  ddtags: `env:${process.env.NODE_ENV}`
}));
```

Agora todos logs vão para Datadog. Busca centralizada, gráficos, alertas.

---

## Boas Práticas

### 1. Não Logar Dados Sensíveis

```javascript
// ❌ RUIM
logger.info('User logged in', { password: user.password, credit_card: user.card });

// ✅ CORRETO
logger.info('User logged in', { user_id: user.id, email: user.email });
```

### 2. Contextualizar Sempre

```javascript
// ❌ RUIM
logger.error('Failed');

// ✅ CORRETO
logger.error('Payment processing failed', {
  event_id: event.id,
  user_id: event.user_id,
  amount: event.amount,
  error: error.message,
  stack: error.stack
});
```

### 3. Log em Locais Estratégicos

- ✅ Início de operação importante
- ✅ Fim de operação (com duração)
- ✅ Antes/depois de chamadas externas
- ✅ Erros (sempre)
- ❌ Dentro de loops intensos (noise)

### 4. Rotação de Logs

Logs crescem infinitamente. Rotacionar:

```bash
npm install winston-daily-rotate-file
```

```javascript
logger.add(new winston.transports.DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d' // Manter 14 dias
}));
```

---

## Conexão com Produto Vendável

**Cliente paga por suporte rápido.**

Cenários:
- **Bug reportado:** Com logging estruturado, você identifica causa em 5min (não 2h)
- **Performance:** Logs mostram queries lentas, você otimiza
- **Auditoria:** Cliente pede "o que aconteceu com evento X?" → logs completos

**Vender observabilidade:**
> "Com logging profissional, quando algo falha, eu descubro o porquê em minutos e corrijo. Sem isso, pode levar horas debugando. Menos downtime = mais receita para você."

**Valor:** R$ 500-1.000 adicional

---

## Mini-Desafio Reflexivo

1. **Debug:** Cliente diz "webhook não funcionou ontem às 14h". Quais campos de log você precisa para identificar?

2. **Performance:** Como usar logs para detectar queries SQL lentas automaticamente?

3. **Alerta:** Você quer ser notificado quando >10 eventos falharem em 1min. Como implementar?

---

## Conclusão do Módulo 2

Você aprendeu:
- ✅ **Pattern Matching** (handlers desacoplados)
- ✅ **Workers** (processamento assíncrono com Bull)
- ✅ **Retry Logic** (backoff exponencial, circuit breaker)
- ✅ **Logging** (estruturado, observabilidade)

**Próximo:** Exercícios Práticos

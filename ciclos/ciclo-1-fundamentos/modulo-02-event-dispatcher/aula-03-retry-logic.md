# Aula 03 — Retry Logic e Backoff Exponencial

## Abertura

Sistemas falham. APIs caem. Bancos ficam lentos. Redes oscilam.

Se você não trata falhas com **retry inteligente**, seus eventos se perdem. Cliente paga,  mas não recebe produto. Lead entra, mas não vai pro CRM. Catastrófico.

Nesta aula você aprende:
- Por que retry é essencial
- Backoff exponencial vs linear vs fixo
- Jitter (aleatoriedade estratégica)
- Circuit breaker (quando parar de tentar)
- Implementação profissional

---

## O Problema: Falha Transitória

```javascript
async function sendEmail(user) {
  try {
    await emailService.send({
      to: user.email,
      subject: 'Bem-vindo!',
      body: '...'
    });
  } catch (error) {
    console.error('Email failed:', error);
    // E agora? Email perdido para sempre?
  }
}
```

**Tipos de falha:**

1. **Permanente:** Email inválido, API key errada  
   → **Não adianta retry**

2. **Transitória:** API temporariamente fora, timeout na rede  
   → **Retry resolve**

**Problema:** Como diferenciar?

---

## Retry Simples (Ingênuo)

```javascript
async function sendEmailWithRetry(user) {
  for (let i = 0; i < 3; i++) {
    try {
      await emailService.send({ to: user.email, ... });
      console.log('Email sent!');
      return; // Sucesso
    } catch (error) {
      console.log(`Attempt ${i + 1} failed`);
      if (i === 2) throw error; // Última tentativa
    }
  }
}
```

**Problema:**
- Tenta imediatamente (0s entre tentativas)
- Se API está sobrecarregada, você piora
- Não diferencia erro temporário vs permanente

---

## Backoff Strategies

### 1. Fixed Delay (Fixo)

```javascript
const RETRY_DELAY = 2000; // 2s

for (let i = 0; i < 3; i++) {
  try {
    return await doSomething();
  } catch (error) {
    if (i < 2) await sleep(RETRY_DELAY); // Espera 2s
  }
}
```

**Tentativas:** 0s → 2s → 2s → 2s

**Problema:** Se API precisa de 5s para recuperar, você fica batendo a cada 2s.

---

### 2. Linear Backoff

```javascript
for (let i = 0; i < 5; i++) {
  try {
    return await doSomething();
  } catch (error) {
    const delay = (i + 1) * 1000; // 1s, 2s, 3s, 4s, 5s
    if (i < 4) await sleep(delay);
  }
}
```

**Tentativas:** 0s → 1s → 2s → 3s → 4s

**Melhor**, mas ainda previsível e pode não ser suficiente.

---

### 3. Exponential Backoff (Profissional)

```javascript
for (let i = 0; i < 5; i++) {
  try {
    return await doSomething();
  } catch (error) {
    const delay = Math.pow(2, i) * 1000; // 2^i segundos
    if (i < 4) await sleep(delay);
  }
}
```

**Tentativas:** 0s → 1s → 2s → 4s → 8s → 16s

**Vantagem:**
- Dá tempo para sistema recuperar
- Reduz carga exponencialmente
- Usado por AWS, Google, Stripe

---

### 4. Jitter (Aleatoriedade)

**Problema com exponencial puro:**

10.000 clientes falham ao mesmo tempo → Todos tentam novamente em 1s → API morre de novo

**Solução:** Adicionar aleatoriedade

```javascript
for (let i = 0; i < 5; i++) {
  try {
    return await doSomething();
  } catch (error) {
    const baseDelay = Math.pow(2, i) * 1000;
    const jitter = Math.random() * 1000; // 0-1s aleatório
    const delay = baseDelay + jitter;
    
    if (i < 4) await sleep(delay);
  }
}
```

**Tentativas:** 0s → ~1.5s → ~3s → ~5.5s → ~9s

**Vantagem:** Distribui requisições no tempo.

---

## Implementação Profissional

```javascript
class RetryManager {
  constructor(options = {}) {
    this.maxAttempts = options.maxAttempts || 5;
    this.baseDelay = options.baseDelay || 1000; // 1s
    this.maxDelay = options.maxDelay || 30000; // 30s máximo
    this.jitter = options.jitter !== false; // True por padrão
  }
  
  calculateDelay(attempt) {
    // Exponencial: 2^attempt * baseDelay
    let delay = Math.pow(2, attempt) * this.baseDelay;
    
    // Cap no máximo
    delay = Math.min(delay, this.maxDelay);
    
    // Adicionar jitter
    if (this.jitter) {
      const jitterAmount = delay * 0.3; // 30% de variação
      delay += Math.random() * jitterAmount - (jitterAmount / 2);
    }
    
    return Math.floor(delay);
  }
  
  async execute(fn, options = {}) {
    const shouldRetry = options.shouldRetry || this.defaultShouldRetry;
    const onRetry = options.onRetry || (() => {});
    
    for (let attempt = 0; attempt < this.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        const isLastAttempt = attempt === this.maxAttempts - 1;
        
        if (isLastAttempt || !shouldRetry(error, attempt)) {
          throw error;
        }
        
        const delay = this.calculateDelay(attempt);
        console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
        
        onRetry(error, attempt, delay);
        
        await this.sleep(delay);
      }
    }
  }
  
  defaultShouldRetry(error, attempt) {
    // Não retry em erros client (4xx), só server (5xx) e network
    if (error.response) {
      const status = error.response.status;
      return status >= 500 || status === 429; // Server error ou rate limit
    }
    return true; // Network errors
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Uso
const retry = new RetryManager({
  maxAttempts: 5,
  baseDelay: 1000,
  maxDelay: 30000
});

await retry.execute(async () => {
  return await sendEmail(user);
}, {
  shouldRetry: (error) => {
    // Não retry em email inválido
    if (error.code === 'INVALID_EMAIL') return false;
    return true;
  },
  onRetry: (error, attempt, delay) => {
    console.log(`Email failed (${error.message}), retry ${attempt + 1} in ${delay}ms`);
  }
});
```

---

## Circuit Breaker Pattern

**Problema:** API está 100% fora. Você fica tentando infinitamente, desperdiçando recursos.

**Solução:** Circuit Breaker (disjuntor)

### Estados

```
┌─────────┐  Muitas falhas  ┌─────────┐  Timeout  ┌─────────┐
│ CLOSED  │────────────────▶│  OPEN   │──────────▶│HALF-OPEN│
│(normal) │                 │(blocked)│           │ (teste) │
└────▲────┘                 └─────────┘           └────┬────┘
     │                                                  │
     │ Sucesso                                          │
     └──────────────────────────────────────────────────┘
          Falha → volta OPEN
```

**Implementação:**

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 60000; // 1min
    this.state = 'CLOSED';
    this.failures = 0;
    this.nextAttempt = Date.now();
  }
  
  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF-OPEN';
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failures++;
    
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
      console.log(`Circuit breaker OPEN. Will retry after ${this.timeout}ms`);
    }
  }
}

// Uso
const breaker = new CircuitBreaker({ failureThreshold: 3, timeout: 60000 });

async function callAPI() {
  return await breaker.execute(async () => {
    return await externalAPI.call();
  });
}
```

**Benefício:** Para de desperdiçar recursos em API morta.

---

## Retry na Prática: Bull Queue

Bull já tem retry embutido:

```javascript
await eventQueue.add('send-email', { user_id: 123 }, {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 2000 // Base delay
  }
});

// Bull automaticamente:
// - Tenta 5 vezes
// - Delays: 2s, 4s, 8s, 16s
// - Move para "failed" após 5 falhas
```

**Customizar:**

```javascript
backoff: {
  type: 'custom',
  delay: (attemptsMade) => {
    return Math.pow(2, attemptsMade) * 1000 + Math.random() * 1000; // Com jitter
  }
}
```

---

## Quando NÃO Fazer Retry

❌ **Erro 400** (Bad Request)  
→ Payload inválido, retry não resolve

❌ **Erro 401** (Unauthorized)  
→ Credenciais erradas, retry não resolve

❌ **Erro 404** (Not Found)  
→ Recurso não existe, retry não resolve

❌ **Operação não-idempotente** sem proteção  
→ Pode duplicar (ex: criar pedido 2x)

✅ **Erro 429** (Rate Limit)  
→ Esperar e tentar novamente

✅ **Erro 500-503** (Server Error)  
→ Problema temporário

✅ **Network timeout**  
→ Tentar novamente

---

## Idempotência no Retry

**Problema:** Você tenta processar evento 3x. Não pode duplicar.

**Solução 1:** Idempotency Key

```javascript
async function processPayment(event, idempotencyKey) {
  // Verificar se já processado
  const existing = await db.query('SELECT * FROM processed WHERE key = ?', [idempotencyKey]);
  
  if (existing) {
    console.log('Already processed, skipping');
    return existing.result;
  }
  
  // Processar
  const result = await doPayment(event);
  
  // Salvar resultado
  await db.query('INSERT INTO processed (key, result) VALUES (?, ?)', [idempotencyKey, JSON.stringify(result)]);
  
  return result;
}

// Uso
await processPayment(event, event.id); // Mesmo event.id = não duplica
```

**Solução 2:** Unique Constraint

```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,  -- Garante unicidade
  ...
);
```

Retry vai tentar inserir, mas DB rejeita duplicata.

---

## Conexão com Produto Vendável

**Cliente paga por confiabilidade.**

Cenários:
- **Pagamento:** Email de confirmação falha → retry automático → cliente recebe
- **CRM:** API fora por 5min → retry exponencial → lead não se perde
- **Webhook:** Timeout pontual → retry com jitter → processamossem duplicar

**Vender retry logic:**
> "Sem retry, 5% dos eventos se perdem quando API oscila 30 segundos. Com retry exponencial + circuit breaker, zero perda. Seu cliente nunca fica sem resposta."

**Valor:** R$ 800-1.500 extra

---

## Mini-Desafio Reflexivo

1. **Backoff:** Por que exponencial é melhor que linear para APIs sobrecarregadas?

2. **Jitter:** 1000 usuários falham simultaneamente. Retry sem jitter vs com jitter. O que acontece?

3. **Circuit Breaker:** API externa morre por 1 hora. Com circuit breaker, quanto economiza em requisições inúteis?

---

**Próxima aula:** Logging Estruturado e Observabilidade

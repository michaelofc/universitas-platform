# Aula 04 — Validação e Segurança: HMAC na Prática

## Abertura

Você já sabe criar um servidor que recebe webhooks. Mas está **perigosamente inseguro**.

Qualquer pessoa na internet pode enviar dados falsos para sua URL e você vai processar como se fosse legítimo.

- Hackers podem simular pagamentos
- Fraudadores podem criar usuários falsos
- Ataques podem derrubar seu servidor

**Esta aula é crítica.** Segurança não é opcional. É obrigatória.

Ao final, você vai:
- Entender como signatures (assinaturas) funcionam
- Implementar valação HMAC profissionalmente
- Proteger seu servidor contra ataques
- Validar dados corretamente

---

## O Problema: Webhooks Não-Autenticados

### Cenário Sem Segurança

```javascript
app.post('/webhook/payment', (req, res) => {
  const { amount, customer_id } = req.body;
  
  // Libera acesso ao produto
  grantAccess(customer_id);
  
  res.json({ received: true });
});
```

### O Ataque

Hacker envia:
```bash
curl -X POST https://seusite.com/webhook/payment \
  -d '{"amount":10000,"customer_id":"hacker123"}'
```

**Resultado:** Hacker ganha acesso sem pagar.

**Você perde:** Produto entregue gratuitamente.

---

## Solução 1: API Keys (Não Recomendada para Webhooks)

```javascript
app.post('/webhook', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  
  if (apiKey !== process.env.VALID_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Processa...
});
```

**Problema:** API key pode vazar (logs, histórico, etc).

**Melhor:** HMAC (signature validation).

---

## HMAC: Como Funciona

### O Que É HMAC?

**HMAC (Hash-based Message Authentication Code)** é um método criptográfico de verificar que:
1. A mensagem vem de quem diz que vem
2. A mensagem não foi alterada no caminho

**Analogia:** Selo de carta com cera
- Só quem tem o anel (secret) pode selar
- Se quebrar (alterar), você percebe

### Funcionamento

**Quando Stripe envia webhook:**

1. Stripe tem um **secret compartilhado** (você configura no painel)
2. Stripe pega o **payload** (body da requisição)
3. Calcula: `hmac_sha256(secret, payload)`
4. Envia resultado no header `Stripe-Signature`

**Quando você recebe:**

1. Extrai signature do header
2. Calcula: `hmac_sha256(SEU_SECRET, payload_recebido)`
3. Compara: `header_sig === calculated_sig`
   - Se iguais: Legítimo ✅
   - Se diferentes: Fraude ❌

**Por que é seguro:**
- Só quem tem o secret pode gerar signature válida
- Se payload mudar 1 byte, signature não bate
- Secret nunca é transmitido (só usa para calcular)

---

## Implementação HMAC no Node.js

### Módulo crypto

Node.js tem `crypto` nativo para HMAC:

```javascript
const crypto = require('crypto');

function generateHMAC(secret, payload) {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

// Teste
const secret = 'meu_secret_super_secreto';
const payload = '{"event":"payment","amount":100}';
const signature = generateHMAC(secret, payload);

console.log(signature);
// Output: "a1b2c3d4e5f6..." (64 caracteres hex)
```

### Validação de Webhook

```javascript
const crypto = require('crypto');
const express = require('express');
const app = express();

// IMPORTANTE: Precisamos do raw body para HMAC
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));

function validateSignature(receivedSig, secret, payload) {
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return receivedSig === expectedSig;
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-signature'];
  const secret = process.env.WEBHOOK_SECRET;
  
  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' });
  }
  
  const isValid = validateSignature(signature, secret, req.rawBody);
  
  if (!isValid) {
    console.warn('Invalid signature detected!');
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Signature válida, processar
  console.log('Valid webhook:', req.body);
  res.json({ received: true });
});

app.listen(3000);
```

---

## Exemplo Real: Stripe

Stripe usa um formato mais complexo:

### Header Stripe-Signature
```
t=1614556800,v1=5257a869e7ecf4d40e4ee8b3c40e9f9db40e7dfe9b2c3f8e1d2c3b4a5d6e7f8g
```

**Decomposição:**
- `t=1614556800`: Timestamp Unix
- `v1=...`: Signature calculada

### Por Que Timestamp?

**Problema:** Replay attack
- Hacker captura webhook válido
- Reenvia 100x (todos com signature válida!)

**Solução:** Rejeitar se muito antigo
```javascript
const MAX_AGE = 5 * 60; // 5 minutos

const timestamp = parseInt(sigHeader.split('t=')[1].split(',')[0]);
const now = Math.floor(Date.now() / 1000);

if (now - timestamp > MAX_AGE) {
  return res.status(401).json({ error: 'Signature expired' });
}
```

### Implementação Stripe Completa

```javascript
function validateStripeSignature(req) {
  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  
  // Extrair timestamp e signature
  const [timestampPart, signaturePart] = sig.split(',');
  const timestamp = timestampPart.split('=')[1];
  const receivedSig = signaturePart.split('=')[1];
  
  // Verificar idade
  const now = Math.floor(Date.now() / 1000);
  if (now - parseInt(timestamp) > 300) { // 5min
    return false;
  }
  
  // Calcular signature esperada
  const payload = `${timestamp}.${req.rawBody}`;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return receivedSig === expectedSig;
}

app.post('/webhook/stripe', (req, res) => {
  if (!validateStripeSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const event = req.body;
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      handlePaymentSuccess(event.data.object);
      break;
    // ...
  }
  
  res.json({ received: true });
});
```

---

## Timing Attack Protection

### O Que É?

**Problema:** Comparação `===` pode vazar informação de timing
```javascript
// ❌ INSEGURO
if (receivedSig === expectedSig) {
  // ...
}
```

Hacker tenta milhões de combinações e mede tempo de resposta:
- 0.001ms = primeiro char errado
- 0.002ms = primeiros 2 chars corretos
- ... gradualmente descobre signature

### Solução: Timing-Safe Comparison

```javascript
const crypto = require('crypto');

function timingSafeCompare(a, b) {
  // Garante que Buffer tenham mesmo tamanho
  if (a.length !== b.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(a, 'hex'),
    Buffer.from(b, 'hex')
  );
}

function validateSignature(receivedSig, secret, payload) {
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return timingSafeCompare(receivedSig, expectedSig);
}
```

**Agora:** Sempre demora o mesmo tempo, independente de onde difere.

---

## Validação de Dados (Além de Signature)

Mesmo com signature válida, valide dados:

### 1. Schema Validation (Zod)

```bash
npm install zod
```

```javascript
const { z } = require('zod');

const PaymentSchema = z.object({
  event: z.literal('payment.success'),
  amount: z.number().positive(),
  currency: z.enum(['brl', 'usd']),
  customer_id: z.string().min(1),
  timestamp: z.number()
});

app.post('/webhook', (req, res) => {
  // 1. Validar signature
  if (!validateSignature(...)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // 2. Validar schema
  try {
    const validData = PaymentSchema.parse(req.body);
    processPayment(validData);
    res.json({ received: true });
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid payload schema',
      details: error.errors
    });
  }
});
```

### 2. Business Logic Validation

```javascript
if (req.body.amount < 100) {
  // Valor muito baixo, pode ser teste/fraude
  return res.status(400).json({ error: 'Amount too low' });
}

if (req.body.currency !== 'brl') {
  // Só aceitamos BRL
  return res.status(400).json({ error: 'Unsupported currency' });
}
```

---

## Rate Limiting

Proteger contra spam/DDoS:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // Max 100 requisições por minuto
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/webhook', webhookLimiter, (req, res) => {
  // ...
});
```

---

## Logging de Tentativas Suspeitas

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'warn',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' })
  ]
});

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-signature'];
  
  if (!validateSignature(signature, secret, req.rawBody)) {
    logger.warn('Invalid signature attempt', {
      ip: req.ip,
      headers: req.headers,
      body: req.body,
      timestamp: new Date()
    });
    
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Processar...
});
```

**Benefícios:**
- Detecta padrões de ataque
- Evidência para banir IPs
- Auditoria de segurança

---

## Checklist de Segurança

Antes de colocar webhook em produção:

- [ ] **Signature validation** implementada (HMAC)
- [ ] **Timing-safe comparison** usada
- [ ] **Timestamp check** (rejeitar >5min antigos)
- [ ] **Schema validation** (Zod ou similar)
- [ ] **Rate limiting** configurado
- [ ] **HTTPS** obrigatório (nunca HTTP em prod)
- [ ] **Secrets em .env** (nunca hardcoded)
- [ ] **Logging de falhas** implementado
- [ ] **Error handling** adequado (não vazar stack traces)
- [ ] **IP whitelist** (se possível)

---

## Testando Segurança

### Teste 1: Signature Inválida

```bash
# Sem signature
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"test"}'

# Deve retornar 401
```

### Teste 2: Signature Válida

```javascript
// Script de teste
const crypto = require('crypto');

const secret = 'meu_secret';
const payload = JSON.stringify({ event: 'test', amount: 100 });
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

console.log(`Signature: ${signature}`);
```

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -H "X-Signature: [COLE_SIGNATURE_AQUI]" \
  -d '{"event":"test","amount":100}'

# Deve retornar 200
```

### Teste 3: Payload Alterado

Mesmo com signature válida, altere 1 byte do payload.  
**Deve rejeitar (401)** porque signature não baterá.

---

## Conexão com Produto Vendável

**Cliente pagará mais por integração segura.**

Cenários reais:
- **E-commerce:** Webhook de pagamento mal protegido = prejuízo direto
- **CRM:** Dados de leads vazados = processo judicial
- **SaaS:** Webhook vulnerable = conta invadida

Você implementando segurança profissionalmente:
- Gera confiança
- Evita problemas futuros
- Justifica preço maior (R$ 2.000 vs R$ 800)

---

## Mini-Desafio Reflexivo

1. **Timing Attack:** Por que `crypto.timingSafeEqual()` é importante? O que hacker descobriria sem ela?

2. **Replay:** Webhook com signature válida é capturado e reenviado 1 hora depois. Como você previne?

3. **Venda:** Cliente pergunta "por que cobra R$ 500 a mais por validação de signature?". O que você responde?

---

**Próxima aula:** Banco de Dados SQLite - Persistindo Eventos

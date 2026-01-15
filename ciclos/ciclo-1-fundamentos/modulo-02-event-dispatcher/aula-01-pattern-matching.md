# Aula 01 — Pattern Matching e Strategy Pattern

## Abertura

No Módulo 1, você aprendeu a **receber** webhooks e salvá-los. No Módulo 2, você vai aprender a **processar** esses eventos e tomar decisões baseadas neles.

O desafio: Você recebe diferentes tipos de eventos (pagamento, cadastro, pedido) e cada um precisa de uma ação diferente. Como organizar isso profissionalmente?

**Resposta:** Pattern Matching + Strategy Pattern.

Ao final desta aula, você vai:
- Entender pattern matching (switch, if-else, map)
- Implementar Strategy Pattern profissionalmente
- Criar handlers desacoplados e testáveis
- Saber quando usar cada abordagem

---

## O Problema: Spaghetti Code

### Abordagem Ruim (If-Else Hell)

```javascript
app.post('/webhook', async (req, res) => {
  const event = req.body;
  
  if (event.type === 'payment.success') {
    await db.query('UPDATE users SET premium = true WHERE id = ?', [event.user_id]);
    await sendEmail(event.user_email, 'Pagamento confirmado!');
    await notifySlack(`Novo pagamento: R$ ${event.amount}`);
  } else if (event.type === 'payment.failed') {
    await sendEmail(event.user_email, 'Pagamento falhou');
    await db.query('INSERT INTO failed_payments VALUES (?, now())', [event.user_id]);
  } else if (event.type === 'user.created') {
    await sendEmail(event.email, 'Bem-vindo!');
    await db.query('INSERT INTO welcome_queue VALUES (?)', [event.user_id]);
    await crm.createContact(event);
  } else if (event.type === 'order.created') {
    // 50 linhas aqui...
  } else if (event.type === 'order.shipped') {
    // Mais 50 linhas...
  }
  // ... 500 linhas depois
  
  res.json({ received: true });
});
```

**Problemas:**
- 1 arquivo com 500+ linhas
- Impossível de testar cada tipo isoladamente
- Mudar 1 tipo afeta todos
- Difícil de entender fluxo
- Não escala

---

## Solução 1: Switch Pattern

### Melhoria Básica

```javascript
async function processEvent(event) {
  switch (event.type) {
    case 'payment.success':
      return handlePaymentSuccess(event);
    
    case 'payment.failed':
      return handlePaymentFailed(event);
    
    case 'user.created':
      return handleUserCreated(event);
    
    case 'order.created':
      return handleOrderCreated(event);
    
    default:
      console.warn(`Unknown event type: ${event.type}`);
      return null;
  }
}

// Handlers separados
async function handlePaymentSuccess(event) {
  await db.query('UPDATE users SET premium = true WHERE id = ?', [event.user_id]);
  await sendEmail(event.user_email, 'Pagamento confirmado!');
  await notifySlack(`Novo pagamento: R$ ${event.amount}`);
}

async function handlePaymentFailed(event) {
  await sendEmail(event.user_email, 'Pagamento falhou');
  await db.query('INSERT INTO failed_payments VALUES (?, now())', [event.user_id]);
}

// Uso
app.post('/webhook', async (req, res) => {
  await processEvent(req.body);
  res.json({ received: true });
});
```

**Melhoria:**
- Funções separadas (testáveis)
- Lógica mais clara
- Ainda centralizado no switch

**Problema:**
- Adicionar novo tipo = modificar switch
- Dificulta testes unitários por tipo

---

## Solução 2: Strategy Pattern (Profissional)

### Conceito

**Strategy Pattern:** Encapsular algoritmos (estratégias) em classes/objetos separados, permitindo trocar comportamento dinamicamente.

**Analogia:** Sistema de pagamento aceita cartão, PIX, boleto. Cada um é uma "estratégia" diferente.

### Implementação

**handlers/payment.handler.js:**
```javascript
class PaymentSuccessHandler {
  async handle(event) {
    console.log(`Processing payment success: ${event.id}`);
    
    // 1. Atualizar usuário
    await db.query('UPDATE users SET premium = true WHERE id = ?', [event.data.user_id]);
    
    // 2. Enviar email
    await sendEmail(event.data.user_email, {
      subject: 'Pagamento Confirmado!',
      body: `Seu pagamento de R$ ${event.data.amount} foi aprovado.`
    });
    
    // 3. Notificar equipe
    await notifySlack(`💰 Novo pagamento: R$ ${event.data.amount}`);
    
    return { success: true, action: 'payment_processed' };
  }
}

class PaymentFailedHandler {
  async handle(event) {
    console.log(`Processing payment failed: ${event.id}`);
    
    await sendEmail(event.data.user_email, {
      subject: 'Problema no Pagamento',
      body: 'Infelizmente seu pagamento não foi aprovado.'
    });
    
    await db.query('INSERT INTO failed_payments (user_id, reason, created_at) VALUES (?, ?, now())', 
      [event.data.user_id, event.data.failure_reason]
    );
    
    return { success: true, action: 'payment_failed_logged' };
  }
}

module.exports = {
  PaymentSuccessHandler,
  PaymentFailedHandler
};
```

**handlers/user.handler.js:**
```javascript
class UserCreatedHandler {
  async handle(event) {
    console.log(`Processing user created: ${event.id}`);
    
    // 1. Email de boas-vindas
    await sendEmail(event.data.email, {
      subject: 'Bem-vindo!',
      template: 'welcome',
      data: { name: event.data.name }
    });
    
    // 2. Criar no CRM
    await crm.createContact({
      email: event.data.email,
      name: event.data.name,
      tags: ['new_user']
    });
    
    // 3. Adicionar à fila de onboarding
    await db.query('INSERT INTO onboarding_queue (user_id) VALUES (?)', [event.data.user_id]);
    
    return { success: true, action: 'user_onboarded' };
  }
}

module.exports = { UserCreatedHandler };
```

**dispatcher.js:**
```javascript
const { PaymentSuccessHandler, PaymentFailedHandler } = require('./handlers/payment.handler');
const { UserCreatedHandler } = require('./handlers/user.handler');

class EventDispatcher {
  constructor() {
    // Registry de handlers
    this.handlers = new Map();
    this.registerHandlers();
  }
  
  registerHandlers() {
    this.handlers.set('payment.success', new PaymentSuccessHandler());
    this.handlers.set('payment.failed', new PaymentFailedHandler());
    this.handlers.set('user.created', new UserCreatedHandler());
    // Adicionar novos handlers aqui
  }
  
  async dispatch(event) {
    const handler = this.handlers.get(event.type);
    
    if (!handler) {
      console.warn(`No handler for event type: ${event.type}`);
      return { success: false, error: 'unknown_event_type' };
    }
    
    try {
      const result = await handler.handle(event);
      console.log(`Event ${event.id} processed successfully`);
      return result;
    } catch (error) {
      console.error(`Error processing event ${event.id}:`, error);
      throw error;
    }
  }
}

module.exports = EventDispatcher;
```

**Uso:**
```javascript
const EventDispatcher = require('./dispatcher');
const dispatcher = new EventDispatcher();

app.post('/webhook', async (req, res) => {
  const event = req.body;
  
  try {
    await dispatcher.dispatch(event);
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: 'Processing failed' });
  }
});
```

---

## Vantagens do Strategy Pattern

### 1. Testabilidade

Testar handler isoladamente:
```javascript
const { PaymentSuccessHandler } = require('./handlers/payment.handler');

describe('PaymentSuccessHandler', () => {
  it('should update user to premium', async () => {
    const handler = new PaymentSuccessHandler();
    const event = {
      id: 'evt_123',
      type: 'payment.success',
      data: { user_id: 456, amount: 100 }
    };
    
    const result = await handler.handle(event);
    
    expect(result.success).toBe(true);
    // Verificar DB, email, etc
  });
});
```

### 2. Extensibilidade

Adicionar novo tipo **sem modificar dispatcher**:

```javascript
// handlers/order.handler.js
class OrderCreatedHandler {
  async handle(event) {
    // Lógica específica
  }
}

// Registrar
dispatcher.handlers.set('order.created', new OrderCreatedHandler());
```

**Open/Closed Principle:** Aberto para extensão, fechado para modificação.

### 3. Manutenibilidade

Cada handler é independente:
- 1 arquivo por domínio (payment, user, order)
- Fácil de encontrar código
- Mudança em payment não afeta user

---

## Pattern Avançado: Dynamic Registration

### Auto-Discovery de Handlers

```javascript
const fs = require('fs');
const path = require('path');

class EventDispatcher {
  constructor() {
    this.handlers = new Map();
    this.autoRegister();
  }
  
  autoRegister() {
    const handlersDir = path.join(__dirname, 'handlers');
    const files = fs.readdirSync(handlersDir);
    
    files.forEach(file => {
      if (!file.endsWith('.handler.js')) return;
      
      const handlers = require(path.join(handlersDir, file));
      
      Object.values(handlers).forEach(HandlerClass => {
        // Convenção: class name = PaymentSuccessHandler
        // Event type = payment.success
        const eventType = this.classNameToEventType(HandlerClass.name);
        this.handlers.set(eventType, new HandlerClass());
      });
    });
    
    console.log(`Registered ${this.handlers.size} handlers`);
  }
  
  classNameToEventType(className) {
    // PaymentSuccessHandler → payment.success
    return className
      .replace('Handler', '')
      .replace(/([A-Z])/g, '.$1')
      .toLowerCase()
      .slice(1);
  }
}
```

**Benefício:** Criar novo handler = apenas adicionar arquivo. Zero configuração manual.

---

## Quando Usar Cada Abordagem

| Abordagem | Quando Usar |
|-----------|-------------|
| **If-Else** | ≤3 tipos de evento, lógica trivial |
| **Switch** | 3-10 tipos, handlers simples |
| **Strategy Pattern** | 10+ tipos, lógica complexa, produção |
| **Auto-Discovery** | Sistema grande, múltiplos devs |

---

## Conexão com Produto Vendável

**Cliente paga por flexibilidade.**

Cenários reais:
- **E-commerce:** 20 tipos de eventos (pedido, pagamento, estoque, envio...)
- **CRM:** Cada ação do lead = evento diferente
- **SaaS:** Onboarding multi-step com diferentes triggers

**Vender Strategy Pattern:**
> "Seu sistema processa 15 tipos de eventos diferentes. Se usar código desorganizado, qualquer mudança quebra tudo. Com arquitetura baseada em Strategy, adicionar novo evento = 15 minutos, não 2 horas."

**Valor:** R$ 1.500 extra por arquitetura limpa.

---

## Erros Comuns

### Erro 1: Handler Muito Genérico

```javascript
// ❌ RUIM
class GenericHandler {
  async handle(event) {
    // Tenta lidar com tudo
    if (event.type.includes('payment')) {
      // ...
    } else if (event.type.includes('user')) {
      // ...
    }
  }
}
```

**Correto:** 1 handler = 1 responsabilidade.

### Erro 2: Lógica no Dispatcher

```javascript
// ❌ RUIM
async dispatch(event) {
  const handler = this.handlers.get(event.type);
  
  // Lógica aqui! (não deveria estar)
  if (event.data.amount > 1000) {
    await notifyAdmin();
  }
  
  await handler.handle(event);
}
```

**Correto:** Dispatcher apenas roteia. Handler contém lógica.

### Erro 3: Não Retornar Resultado

```javascript
// ❌ RUIM
async handle(event) {
  await doStuff();
  // Não retorna nada
}

// ✅ CORRETO
async handle(event) {
  await doStuff();
  return {
    success: true,
    action: 'stuff_done',
    metadata: { ... }
  };
}
```

**Por quê:** Permite rastrear o que aconteceu.

---

## Mini-Desafio Reflexivo

1. **Arquitetura:** Você tem 30 tipos de eventos. Switch ou Strategy? Por quê?

2. **Extensão:** Cliente pede novo tipo de evento urgente. Com Strategy Pattern, quanto tempo leva?

3. **Teste:** Como você testaria `PaymentSuccessHandler` sem enviar email real?

---

**Próxima aula:** Workers e Background Jobs - Processando Assíncrono

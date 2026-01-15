# Aula 03 — Express.js: Criando Seu Primeiro Servidor

## Abertura

Agora você sabe **o que** são webhooks e **como** HTTP funciona. Hora de sujar as mãos.

Nesta aula, você vai criar seu primeiro servidor HTTP usando Express.js - o framework Node.js mais usado do mundo para criar APIs e receber webhooks.

Não vamos apenas copiar código. Você vai entender:
- Por que Express existe
- Como ele processa requisições
- O que são middlewares e por que são poderosos
- Como estruturar código profissionalmente

**Ao final:** Você terá um servidor rodando que aceita requisições POST.

---

## Por Que Express.js?

### Node.js Puro vs Express

**Node.js puro:**
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true }));
      } catch (e) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000);
```

**Express:**
```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  res.json({ received: true });
});

app.listen(3000);
```

**Diferença brutal:** 80% menos código, infinitamente mais legível.

---

## Setup Inicial

### 1. Criar Projeto

```bash
mkdir webhook-receiver
cd webhook-receiver
npm init -y
```

`npm init -y` cria `package.json` com defaults.

### 2. Instalar Express

```bash
npm install express
```

Isso adiciona Express ao seu `package.json`:
```json
{
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

### 3. Criar Arquivo Principal

`server.js`:
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 4. Rodar

```bash
node server.js
```

Acesse: `http://localhost:3000`  
Ver: "Hello World!"

**Parabéns, você tem um servidor HTTP funcionando.**

---

## Anatomia do Express

### 1. Criando App

```javascript
const express = require('express');
const app = express();
```

`app` é sua aplicação Express. Tudo passa por ele.

### 2. Definindo Rotas

**Sintaxe:**
```javascript
app.METODO('/caminho', (req, res) => {
  // Lógica
});
```

**Exemplos:**
```javascript
// GET /users
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'João' }]);
});

// POST /users
app.post('/users', (req, res) => {
  const newUser = req.body;
  res.status(201).json(newUser);
});

// DELETE /users/123
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id; // "123"
  res.status(204).send();
});
```

### 3. Parâmetros de Rota

**URL:** `/users/123/orders/456`

```javascript
app.get('/users/:userId/orders/:orderId', (req, res) => {
  const { userId, orderId } = req.params;
  // userId = "123", orderId = "456"
  res.json({ userId, orderId });
});
```

### 4. Query Parameters

**URL:** `/search?q=nodejs&limit=10`

```javascript
app.get('/search', (req, res) => {
  const { q, limit } = req.query;
  // q = "nodejs", limit = "10"
  res.json({ query: q, limit: parseInt(limit) });
});
```

---

## Middlewares: O Coração do Express

### O Que São?

**Middleware** é uma função que processa a requisição **antes** de chegar na rota final.

**Analogia:** Segurança em evento
- Portão 1: Verifica ticket (middleware de autenticação)
- Portão 2: Revista bolsa (middleware de validação)
- Portão 3: Carimba mão (middleware de logging)
- Entrada: Você entra no evento (sua rota)

### Middleware Básico

```javascript
// Middleware que loga todas requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // CRÍTICO: passar para próximo middleware
});

app.get('/', (req, res) => {
  res.send('Hello');
});
```

**Saída:**
```
GET /
```

**Se esquecer `next()`:** Requisição trava (timeout).

### Middleware de Third-Party

#### express.json()
Converte body JSON em objeto JavaScript:

```javascript
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log(req.body); // Objeto JS, não string
  res.json({ received: true });
});
```

**Sem este middleware:** `req.body` seria `undefined`.

#### express.urlencoded()
Para formulários HTML:

```javascript
app.use(express.urlencoded({ extended: true }));
```

### Ordem Importa!

```javascript
// ❌ ERRADO
app.post('/webhook', (req, res) => {
  console.log(req.body); // undefined!
});

app.use(express.json()); // Tarde demais

// ✅ CORRETO
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log(req.body); // Funciona!
});
```

**Regra:** Middlewares globais **sempre** antes de rotas.

---

## Servidor Webhook (Versão 1)

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(express.json());

// Middleware de log
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Rota de webhook
app.post('/webhook', (req, res) => {
  const payload = req.body;
  
  console.log('Webhook recebido:', payload);
  
  // TODO: Validar signature
  // TODO: Salvar no banco
  // TODO: Processar assíncrono
  
  res.status(200).json({
    received: true,
    event_id: payload.id || 'unknown'
  });
});

// Rota 404 (não encontrado)
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook receiver running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
```

### Testando

**Terminal 1:**
```bash
node server.js
```

**Terminal 2:**
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"test","data":{"amount":100}}'
```

**Resposta:**
```json
{"received":true,"event_id":"unknown"}
```

---

## Organizando Código Profissionalmente

### Problema: Tudo em 1 Arquivo

```javascript
// server.js - 500 linhas!
app.post('/webhooks/stripe', ...);
app.post('/webhooks/github', ...);
app.post('/webhooks/typeform', ...);
// ...
```

**Ruim porque:**
- Difícil de manter
- Impossível de testar
- Não escala

### Solução: Estrutura Modular

```
webhook-receiver/
├── server.js          # Entrada principal
├── routes/
│   ├── webhooks.js    # Rotas de webhooks
│   └── health.js      # Rotas de health
├── middleware/
│   ├── logger.js      # Log de requisições
│   └── validate.js    # Validação
└── package.json
```

**server.js:**
```javascript
const express = require('express');
const webhookRoutes = require('./routes/webhooks');
const healthRoutes = require('./routes/health');
const logger = require('./middleware/logger');

const app = express();

app.use(express.json());
app.use(logger);

app.use('/webhooks', webhookRoutes);
app.use('/health', healthRoutes);

app.listen(3000);
```

**routes/webhooks.js:**
```javascript
const express = require('express');
const router = express.Router();

router.post('/stripe', (req, res) => {
  // Lógica Stripe
  res.json({ received: true });
});

router.post('/github', (req, res) => {
  // Lógica GitHub
  res.json({ received: true });
});

module.exports = router;
```

**middleware/logger.js:**
```javascript
function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}

module.exports = logger;
```

**Benefícios:**
- Cada arquivo < 100 linhas
- Fácil de testar individualmente
- Equipe pode trabalhar em paralelo

---

## Errors e Error Handling

### Erro Síncrono

```javascript
app.post('/webhook', (req, res, next) => {
  try {
    if (!req.body.event) {
      throw new Error('Missing event field');
    }
    res.json({ received: true });
  } catch (error) {
    next(error); // Passa para error handler
  }
});
```

### Erro Assíncrono

```javascript
app.post('/webhook', async (req, res, next) => {
  try {
    await saveToDatabase(req.body);
    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});
```

### Error Handler Centralizado

```javascript
// SEMPRE no final, depois de todas as rotas
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Log completo em dev, resumido em prod
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});
```

---

## Variáveis de Ambiente

Nunca hardcode secrets no código!

### Má Prática
```javascript
const SECRET = 'abc123secreto'; // ❌ NO GIT
```

### Boa Prática

**Criar `.env`:**
```
PORT=3000
WEBHOOK_SECRET=abc123secreto
DATABASE_URL=postgresql://...
NODE_ENV=development
```

**Adicionar ao `.gitignore`:**
```
node_modules/
.env
```

**Instalar dotenv:**
```bash
npm install dotenv
```

**Usar no código:**
```javascript
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.WEBHOOK_SECRET;

if (!SECRET) {
  throw new Error('WEBHOOK_SECRET not defined!');
}
```

**`.env.example` (comitar no Git):**
```
PORT=3000
WEBHOOK_SECRET=your_secret_here
DATABASE_URL=your_database_url
```

---

## Auto-Reload em Desenvolvimento

**Problema:** Toda mudança precisa reiniciar servidor manualmente.

**Solução:** nodemon

```bash
npm install --save-dev nodemon
```

**package.json:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

**Rodar:**
```bash
npm run dev
```

Agora mudanças recarregam automaticamente!

---

## Conexão com Produto Vendável

**Express é a base de 80% das automações Node.js.**

Dominando Express, você pode:
1. **Criar webhooks receivers** para qualquer serviço
2. **Construir APIs** customizadas para clientes
3. **Integrar sistemas** via HTTP
4. **Cobrar R$ 1.000-3.000** por integrações simples

**Clientes pagam por:**
- Webhook que sincroniza CRM com e-commerce
- API que conecta sistema legado com novo
- Automação que processa pagamentos

Tudo construído com Express.

---

## Mini-Desafio Reflexivo

1. **Middleware:** Se você adicionar `app.use(express.json())` **depois** de `app.post('/webhook', ...)`, o que acontece? Por quê?

2. **Organização:** Você tem 10 rotas de webhooks diferentes. Como estruturaria pastas/arquivos?

3. **Erro:** Cliente reclama "webhook não funciona". Servidor retorna 500. Como você debugaria?

---

**Próxima aula:** Validação e Segurança - HMAC na Prática

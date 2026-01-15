# Aula 02 — HTTP na Prática: Métodos, Headers e Status Codes

## Abertura

Você já entendeu **por que** webhooks existem. Agora precisa entender **como** eles funcionam tecnicamente.

E para entender webhooks, você precisa dominar HTTP. Não superficialmente. Você precisa entender:
- O que acontece quando você faz uma requisição
- Por que headers existem
- O que cada status code significa
- Como ler e debugar requisições HTTP

Esta aula não é teórica. É **prática e aplicada**. Ao final, você vai saber exatamente o que está acontecendo quando um webhook chega no seu servidor.

---

## HTTP: A Linguagem da Web

### O Que É HTTP?

**HTTP (HyperText Transfer Protocol)** é o protocolo que permite navegadores, apps e sistemas conversarem pela internet.

**Analogia postal:**
- **Você (cliente)** escreve uma carta
- **Correio (internet)** entrega
- **Destinatário (servidor)** lê e responde

**No HTTP:**
- **Cliente** envia uma **requisição**
- **Servidor** processa e envia uma **resposta**

### Anatomia de uma Requisição HTTP

```
POST /webhook HTTP/1.1
Host: seusite.com
Content-Type: application/json
X-Signature: abc123...
Content-Length: 245

{
  "event": "payment.success",
  "amount": 5000
}
```

**Decomposição:**

1. **Linha de comando:** `POST /webhook HTTP/1.1`
   - `POST`: Método HTTP
   - `/webhook`: Caminho (endpoint)
   - `HTTP/1.1`: Versão do protocolo

2. **Headers:** Metadados da requisição
   - `Host`: Servidor destino
   - `Content-Type`: Formato do corpo (JSON)
   - `X-Signature`: Header customizado (validação)
   - `Content-Length`: Tamanho do corpo

3. **Body:** Dados enviados (payload)
   - JSON com informações do evento

---

## Métodos HTTP (Verbos)

### GET - Buscar Dados

**O Que Faz:** Solicita dados do servidor (sem modificá-los)

**Exemplo:**
```http
GET /users/123
Host: api.example.com
```

**Resposta:**
```json
{
  "id": 123,
  "name": "João",
  "email": "joao@email.com"
}
```

**Características:**
- Idempotente (pode repetir sem problemas)
- Não tem body
- Parâmetros na URL: `/users?status=active&limit=10`
- Pode ser cacheado

**Quando usar:** Buscar lista de pedidos, detalhes de cliente, consultar status

---

### POST - Criar Dados

**O Que Faz:** Envia dados para criar algo novo

**Exemplo:**
```http
POST /users
Host: api.example.com
Content-Type: application/json

{
  "name": "Maria",
  "email": "maria@email.com"
}
```

**Resposta:**
```http
HTTP/1.1 201 Created
Location: /users/124

{
  "id": 124,
  "name": "Maria"
}
```

**Características:**
- NÃO é idempotente (repetir = duplicar)
- Tem body com dados
- Retorna status 201 (Created)
- Header `Location` indica onde foi criado

**Quando usar:** Criar usuário, registrar pedido, enviar formulário

**Webhook usa POST:** Porque está "criando" um evento novo no seu sistema

---

### PUT/PATCH - Atualizar Dados

**PUT:** Substitui completamente
```http
PUT /users/123
{
  "name": "João Silva",
  "email": "joao.novo@email.com",
  "phone": "11999999999"
}
```
Se você não enviar `phone`, ele será removido.

**PATCH:** Atualiza parcialmente
```http
PATCH /users/123
{
  "phone": "11999999999"
}
```
Só muda o `phone`, resto permanece.

**Quando usar:** Atualizar status de pedido, editar perfil

---

### DELETE - Remover Dados

```http
DELETE /users/123
```

**Resposta:**
```http
HTTP/1.1 204 No Content
```

**Quando usar:** Cancelar pedido, remover item do carrinho

---

## Headers: Metadados Essenciais

Headers são informações **sobre** a requisição, não o conteúdo em si.

### Headers Comuns em Requisições

#### 1. Content-Type
Informa o formato do body:
```
Content-Type: application/json
Content-Type: application/x-www-form-urlencoded
Content-Type: multipart/form-data
```

**Critério:** Se você não declarar, servidor pode rejeitar (400 Bad Request)

#### 2. Authorization
Autenticação:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Authorization: Basic dXNlcjpwYXNzd29yZA==
```

#### 3. User-Agent
Identifica quem está fazendo a requisição:
```
User-Agent: Stripe/1.0 (+https://stripe.com/docs/webhooks)
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
```

#### 4. X-* (Headers Customizados)
Webhooks usam muito:
```
X-Stripe-Signature: t=1234567890,v1=abc123...
X-GitHub-Event: push
X-Hub-Signature: sha256=def456...
```

**Regra:** Prefixo `X-` indica header não-padrão

### Headers Comuns em Respostas

#### 1. Content-Type
Formato da resposta:
```
Content-Type: application/json; charset=utf-8
```

#### 2. Content-Length
Tamanho do body (em bytes):
```
Content-Length: 1234
```

#### 3. Cache-Control
Instruções de cache:
```
Cache-Control: no-cache
Cache-Control: max-age=3600
```

#### 4. Location
Onde recurso foi criado:
```
HTTP/1.1 201 Created
Location: /users/124
```

---

## Status Codes: A Linguagem de Respostas

### 2xx - Sucesso

#### 200 OK
```http
HTTP/1.1 200 OK
Content-Type: application/json

{"status": "success"}
```
**Uso:** Requisição processada com sucesso

#### 201 Created
```http
HTTP/1.1 201 Created
Location: /orders/456

{"id": 456}
```
**Uso:** Recurso criado (POST bem-sucedido)

#### 204 No Content
```http
HTTP/1.1 204 No Content
```
**Uso:** Sucesso, mas sem body (comum em DELETE)

---

### 4xx - Erro do Cliente

#### 400 Bad Request
```http
HTTP/1.1 400 Bad Request

{"error": "Field 'email' is required"}
```
**Uso:** Dados inválidos, faltando campos obrigatórios

**Webhook:** Se payload está mal-formado

#### 401 Unauthorized
```http
HTTP/1.1 401 Unauthorized

{"error": "Invalid signature"}
```
**Uso:** Sem autenticação ou autenticação inválida

**Webhook:** Signature não bate

#### 404 Not Found
```http
HTTP/1.1 404 Not Found

{"error": "Endpoint not found"}
```
**Uso:** Rota não existe

#### 429 Too Many Requests
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{"error": "Rate limit exceeded"}
```
**Uso:** Excedeu limite de requisições

---

### 5xx - Erro do Servidor

#### 500 Internal Server Error
```http
HTTP/1.1 500 Internal Server Error

{"error": "Database connection failed"}
```
**Uso:** Erro não tratado no servidor

**Webhook:** Sistema emissor vai **retentar**

#### 503 Service Unavailable
```http
HTTP/1.1 503 Service Unavailable
Retry-After: 120

{"error": "Under maintenance"}
```
**Uso:** Servidor temporariamente indisponível

---

## Webhook na Prática: Anatomia Completa

Vamos dissecar um webhook real do Stripe:

### Requisição que Chega

```http
POST /webhook HTTP/1.1
Host: seusite.com
Content-Type: application/json
User-Agent: Stripe/1.0
Stripe-Signature: t=1614556800,v1=5257a869e7...
Content-Length: 1234

{
  "id": "evt_1Abc123",
  "object": "event",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1Xyz789",
      "amount": 5000,
      "currency": "brl",
      "customer": "cus_ABC123"
    }
  },
  "created": 1614556789
}
```

### O Que Seu Servidor Deve Fazer

```javascript
// 1. Ler header de signature
const signature = req.headers['stripe-signature'];

// 2. Calcular signature esperada
const expectedSig = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(req.rawBody)
  .digest('hex');

// 3. Validar
if (signature !== expectedSig) {
  return res.status(401).json({ error: 'Invalid signature' });
}

// 4. Verificar idempotência
const eventId = req.body.id;
const exists = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);
if (exists) {
  return res.status(200).json({ received: true }); // Já processado
}

// 5. Salvar rapidamente
await db.query('INSERT INTO events (id, type, payload) VALUES (?, ?, ?)', [
  eventId,
  req.body.type,
  JSON.stringify(req.body)
]);

// 6. Responder RÁPIDO
res.status(200).json({ received: true });

// 7. Processar depois (assíncrono)
queue.add('process-event', { eventId });
```

### Resposta que Você Envia

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 18

{"received":true}
```

**Tempo total:** <300ms (crítico!)

---

## Ferramentas para Testar HTTP

### 1. cURL (Command Line)

```bash
# GET
curl https://api.example.com/users

# POST com JSON
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com"}'

# Com autenticação
curl -H "Authorization: Bearer TOKEN123" \
  https://api.example.com/protected

# Ver headers completos
curl -v https://api.example.com/users
```

### 2. Postman / Insomnia (GUI)

Interfaces gráficas para testar APIs:
- Salvar coleções de requests
- Variáveis de ambiente
- Testes automatizados
- Gerar código automático

### 3. Webhook.site (Testar Webhooks)

URL temporária que mostra requisições recebidas:
1. Acesse webhook.site
2. Copie URL única gerada
3. Configure no sistema emissor
4. Veja requisições chegando em tempo real

**Uso:** Testar webhook antes de implementar seu servidor

### 4. ngrok (Expor localhost)

```bash
ngrok http 3000
# Gera URL pública: https://abc123.ngrok.io
```

**Uso:** Testar webhooks localmente (Stripe manda para sua máquina)

---

## Erros Comuns e Como Debugar

### Erro 1: "Content-Type não especificado"

```javascript
// ❌ ERRADO
fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({name: 'João'})
});

// ✅ CORRETO
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({name: 'João'})
});
```

### Erro 2: "Retornar status code errado"

```javascript
// ❌ ERRADO - dados inválidos mas retorna 500
if (!req.body.email) {
  return res.status(500).json({ error: 'Email required' });
}

// ✅ CORRETO - retorna 400
if (!req.body.email) {
  return res.status(400).json({ error: 'Email required' });
}
```

**Regra:** 
- `400`: erro nos dados que cliente enviou
- `500`: erro interno do servidor (banco caiu, etc)

### Erro 3: "Não ler body corretamente"

```javascript
// ❌ ERRADO
app.post('/webhook', (req, res) => {
  console.log(req.body); // undefined
});

// ✅ CORRETO - usar middleware
app.use(express.json()); // Parser JSON
app.post('/webhook', (req, res) => {
  console.log(req.body); // Objeto JavaScript
});
```

---

## Conexão com Produto Vendável

**Dominar HTTP te permite:**

1. **Debugar integrações rapidamente**
   - Cliente reclama que webhook não funciona
   - Você analisa headers/status e identifica problema
   - Resolve em minutos (não horas)

2. **Comunicar com cliente técnico**
   - "O servidor está retornando 401 porque a signature está inválida"
   - Soa muito mais profissional que "não tá funcionando"

3. **Ler documentações de API**
   - 100% das APIs documentam via HTTP
   - Você lê e implementa sem dificuldade

4. **Cobrar mais**
   - Dev que entende HTTP profundamente > dev que copia tutorial
   - Diferença pode ser 2-3x no valor cobrado

---

## Mini-Desafio Reflexivo

1. **Cenário:** Webhook chegou, você salvou no banco, mas processamento demorou 8 segundos. O status code deve ser 200 ou 500? Por quê?

2. **Debug:** Cliente diz "webhook não funciona". Você curl para URL dele e recebe:
   ```
   HTTP/1.1 404 Not Found
   ```
   Qual o problema? Como você explica para ele?

3. **Arquitetura:** Se você recebe 100 webhooks/segundo, retornar 200 rápido é suficiente ou você precisa de algo mais?

---

**Próxima aula:** Express.js - Criando Seu Primeiro Servidor HTTP

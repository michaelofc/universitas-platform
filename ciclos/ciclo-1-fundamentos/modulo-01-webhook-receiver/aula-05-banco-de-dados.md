# Aula 05 — Banco de Dados SQLite: Persistindo Eventos

## Abertura

Até agora seu webhook receiver **recebe** dados, **valida** assinatura, e... perde tudo quando o servidor reinicia.

Não é aceitável profissionalmente.

Todo webhook precisa persistir dados:
- Para auditar o que aconteceu
- Para reprocessar se algo falhar
- Para gerar relatórios
- Para provar que evento ocorreu

Nesta aula você vai aprender:
- Por que SQLite é perfeito para começar
- Como criar tabelas e salvar dados
- SQL básico (INSERT, SELECT, WHERE)
- Como integrar banco com Express
- Idempotência (não duplicar eventos)

**Ao final:** Webhooks serão salvos permanentemente.

---

## Por Que Banco de Dados?

### Opção 1: Sem Banco (Memória)

```javascript
const events = []; // Array em memória

app.post('/webhook', (req, res) => {
  events.push(req.body);
  res.json({ received: true });
});
```

**Problemas:**
- Reinicia servidor = perde tudo
- Múltiplos servidores = dados separados
- Sem queries complexas
- Limite de RAM

### Opção 2: Arquivo JSON

```javascript
fs.writeFileSync('events.json', JSON.stringify(events));
```

**Problemas:**
- Lento com muitos dados
- Sem queries (precisa ler tudo)
- Risco de corrupção
- Sem concorrência

### Opção 3: Banco de Dados (Correto)

```sql
INSERT INTO events (id, type, payload) VALUES (?, ?, ?);
SELECT * FROM events WHERE type = 'payment' ORDER BY created_at DESC;
```

**Vantagens:**
- Persistente
- Indexado (rápido)
- Queries poderosas
- ACID (atomicidade, consistência)

---

## Por Que SQLite?

### SQLite vs PostgreSQL vs MySQL

| Aspecto | SQLite | PostgreSQL | MySQL |
|---------|--------|------------|-------|
| **Setup** | Zero (arquivo) | Instalar servidor | Instalar servidor |
| **Ideal para** | Protótipos, low-traffic | Produção séria | Produção geral |
| **Concorrência** | Baixa (locks) | Alta | Alta |
| **Tamanho** | <1MB | ~30MB | ~200MB |
| **Complexidade** | Mínima | Média | Média |

**Para Módulo 1:** SQLite é perfeito
- Sem configuração de servidor
- Um arquivo `.db`
- Aprende SQL de verdade
- Fácil de migrar depois

**Para Produção:** PostgreSQL (Módulo 4)

---

## SQL Básico: Os 4 Comandos

### CREATE TABLE - Criar Estrutura

```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  payload TEXT NOT NULL,
  source TEXT,
  created_at INTEGER NOT NULL
);
```

**Decomposição:**
- `id TEXT PRIMARY KEY`: Identificador único (string)
- `type TEXT NOT NULL`: Tipo de evento (obrigatório)
- `payload TEXT NOT NULL`: Dados JSON em texto
- `source TEXT`: De onde veio (opcional)
- `created_at INTEGER NOT NULL`: Timestamp Unix

**PRIMARY KEY:** Garante que `id` é único. Não pode duplicar.

### INSERT - Adicionar Dados

```sql
INSERT INTO events (id, type, payload, source, created_at) 
VALUES ('evt_123', 'payment.success', '{"amount":100}', 'stripe', 1614556789);
```

**Com variáveis** (prepared statement - SEGURO):
```javascript
db.run(
  'INSERT INTO events (id, type, payload, source, created_at) VALUES (?, ?, ?, ?, ?)',
  ['evt_123', 'payment.success', '{"amount":100}', 'stripe', Date.now()]
);
```

**Nunca faça:**
```javascript
// ❌ SQL INJECTION!
const sql = `INSERT INTO events VALUES ('${id}', '${type}')`;
```

### SELECT - Buscar Dados

```sql
-- Todos eventos
SELECT * FROM events;

-- Últimos 10
SELECT * FROM events ORDER BY created_at DESC LIMIT 10;

-- Só de pagamento
SELECT * FROM events WHERE type = 'payment.success';

-- Count
SELECT COUNT(*) FROM events WHERE source = 'stripe';
```

### DELETE - Remover (Cuidado!)

```sql
DELETE FROM events WHERE id = 'evt_123';
```

**Melhor:** Soft delete (marcar como deletado, não remover)
```sql
ALTER TABLE events ADD COLUMN deleted_at INTEGER;
UPDATE events SET deleted_at = 1614556789 WHERE id = 'evt_123';
```

---

## Setup SQLite no Node.js

### Instalação

```bash
npm install better-sqlite3
```

**Por que better-sqlite3?**
- Síncrono (mais simples)
- Mais rápido
- TypeScript support

### Criando Banco

**db.js:**
```javascript
const Database = require('better-sqlite3');
const db = new Database('webhooks.db');

// Criar tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    payload TEXT NOT NULL,
    source TEXT,
    created_at INTEGER NOT NULL
  )
`);

// Criar índice para buscas rápidas
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_type ON events(type);
  CREATE INDEX IF NOT EXISTS idx_created_at ON events(created_at);
`);

module.exports = db;
```

**Agora `webhooks.db` existe!**

---

## Integrando com Webhook Receiver

**server.js:**
```javascript
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  // 1. Validar signature (aula anterior)
  if (!validateSignature(...)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // 2. Extrair dados
  const eventId = req.body.id || `evt_${Date.now()}`;
  const eventType = req.body.type || 'unknown';
  const payload = JSON.stringify(req.body);
  const source = req.headers['user-agent'] || 'unknown';
  const createdAt = Date.now();
  
  // 3. Salvar no banco
  try {
    db.prepare(`
      INSERT INTO events (id, type, payload, source, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(eventId, eventType, payload, source, createdAt);
    
    console.log(`Event ${eventId} saved`);
    res.json({ received: true, event_id: eventId });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      // Evento duplicado (id já existe)
      console.warn(`Duplicate event: ${eventId}`);
      return res.json({ received: true, duplicate: true });
    }
    
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

app.listen(3000);
```

---

## Idempotência: Evitando Duplicatas

### O Problema

Stripe envia webhook. Você demora 6s para responder. Stripe acha que falhou e reenvia.

**Resultado:** 2 inserções no banco (duplicata).

### Solução 1: PRIMARY KEY

```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,  -- Isso impede duplicatas!
  ...
);
```

Se tentar inserir `id` duplicado, SQL retorna erro `SQLITE_CONSTRAINT`.

```javascript
try {
  db.prepare('INSERT INTO events...').run(...);
} catch (error) {
  if (error.code === 'SQLITE_CONSTRAINT') {
    // Já existe, ignora
    return res.json({ received: true });
  }
  throw error;
}
```

### Solução 2: INSERT OR IGNORE

```sql
INSERT OR IGNORE INTO events (id, type, payload, source, created_at)
VALUES (?, ?, ?, ?, ?);
```

**Diferença:**
- `INSERT`: Erro se duplicar
- `INSERT OR IGNORE`: Silenciosamente ignora duplicata

**Use quando:** Não precisa saber se era duplicata.

### Solução 3: UPSERT (INSERT OR REPLACE)

```sql
INSERT OR REPLACE INTO events (id, type, payload, source, created_at)
VALUES (?, ?, ?, ?, ?);
```

**Comportamento:** Se existe, atualiza. Se não, insere.

---

## Queries Úteis

### Endpoint: Listar Últimos Eventos

```javascript
app.get('/events', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const type = req.query.type;
  
  let query = 'SELECT * FROM events';
  const params = [];
  
  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);
  
  const events = db.prepare(query).all(...params);
  
  res.json({
    count: events.length,
    events: events.map(e => ({
      ...e,
      payload: JSON.parse(e.payload)
    }))
  });
});
```

**Uso:**
```bash
# Últimos 10 eventos
curl http://localhost:3000/events?limit=10

# Últimos 50 de pagamento
curl http://localhost:3000/events?type=payment.success&limit=50
```

### Endpoint: Estatísticas

```javascript
app.get('/stats', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM events').get();
  
  const byType = db.prepare(`
    SELECT type, COUNT(*) as count 
    FROM events 
    GROUP BY type 
    ORDER BY count DESC
  `).all();
  
  const bySource = db.prepare(`
    SELECT source, COUNT(*) as count 
    FROM events 
    GROUP BY source
  `).all();
  
  res.json({
    total: total.count,
    by_type: byType,
    by_source: bySource
  });
});
```

**Resposta:**
```json
{
  "total": 1234,
  "by_type": [
    {"type": "payment.success", "count": 800},
    {"type": "user.created", "count": 434}
  ],
  "by_source": [
    {"source": "Stripe/1.0", "count": 800},
    {"source": "GitHub-Hookshot", "count": 434}
  ]
}
```

---

## Transactions: Múltiplas Operações Atômicas

### Problema

Você precisa:
1. Salvar evento
2. Atualizar contador
3. Marcar como processado

Se 2 ou 3 falhar, 1 já foi commitado. **Inconsistência!**

### Solução: Transaction

```javascript
const saveEvent = db.transaction((event) => {
  // Tudo ou nada (atomicidade)
  db.prepare('INSERT INTO events...').run(event);
  db.prepare('UPDATE counters SET total = total + 1').run();
  db.prepare('INSERT INTO processing_queue...').run(event.id);
});

try {
  saveEvent(eventData);
  // Todas 3 operações sucederam
} catch (error) {
  // Nenhuma foi aplicada (rollback automático)
}
```

---

## Migrações: Evoluindo Schema

### Problema

Você lança versão 1 com:
```sql
CREATE TABLE events (id, type, payload);
```

Depois precisa adicionar `source`. Como?

### Solução: Migration Scripts

**migrations/001_initial.sql:**
```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
```

**migrations/002_add_source.sql:**
```sql
ALTER TABLE events ADD COLUMN source TEXT;
```

**migrate.js:**
```javascript
const fs = require('fs');
const db = require('./db');

// Tabela de controle
db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at INTEGER NOT NULL
  )
`);

// Aplicar migrações pendentes
const files = fs.readdirSync('migrations').sort();

files.forEach(file => {
  const exists = db.prepare('SELECT * FROM migrations WHERE name = ?').get(file);
  
  if (!exists) {
    console.log(`Applying migration: ${file}`);
    const sql = fs.readFileSync(`migrations/${file}`, 'utf8');
    db.exec(sql);
    db.prepare('INSERT INTO migrations (name, applied_at) VALUES (?, ?)').run(file, Date.now());
  }
});

console.log('Migrations complete');
```

**Rodar:**
```bash
node migrate.js
```

---

## Backup e Recuperação

### Backup Manual

```bash
# Copiar arquivo
cp webhooks.db webhooks_backup_2026-01-15.db
```

### Backup Programático

```javascript
const fs = require('fs');

function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupPath = `backups/webhooks_${timestamp}.db`;
  
  fs.copyFileSync('webhooks.db', backupPath);
  console.log(`Backup created: ${backupPath}`);
}

// Backup diário automático
setInterval(backupDatabase, 24 * 60 * 60 * 1000);
```

---

## Performance: Índices

### Sem Índice

```sql
SELECT * FROM events WHERE type = 'payment';
-- Full table scan: 10,000 linhas verificadas (lento)
```

### Com Índice

```sql
CREATE INDEX idx_type ON events(type);
SELECT * FROM events WHERE type = 'payment';
-- Index scan: 15 linhas verificadas (rápido)
```

**Regra:** Crie índice em colunas que você usa no `WHERE`.

### Mas Não Abuse

Índices ocupam espaço e tornam `INSERT` mais lento.

**Quando criar:**
- Busca frequente
- Tabela > 1000 linhas
- Performance medida e insatisfatória

---

## Conexão com Produto Vendável

**Cliente paga por histórico.**

Casos reais:
- "Preciso ver todos pagamentos de Dezembro"
- "Qual webhook causou erro ontem às 15h?"
- "Quantos leads capturamos por fonte?"

Sem banco: "Não consigo saber"  
Com banco: "Aqui está o relatório" (em 5 segundos)

**Valor agregado:** R$ 500-1.000 adicional

---

## Mini-Desafio Reflexivo

1. **SQL Injection:** Por que `db.prepare('... VALUES (?, ?)')` é seguro e string template não é?

2. **Idempotência:** Webhook com `id` duplicado tenta inserir. O que acontece? Como isso previne reprocessamento?

3. **Índice:** Você tem 100.000 eventos. Query `SELECT * FROM events WHERE type = 'payment' AND created_at > 1234567890` está lenta. Que índice criaria?

---

**Próximo:** Exercícios Práticos do Módulo 1

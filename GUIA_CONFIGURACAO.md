# 🔧 Guia de Configuração — UNIVERSITAS

## ⚙️ Configuração Passo a Passo

### 1️⃣ **PostgreSQL (Banco de Dados)**

#### Opção A: PostgreSQL Local (Windows)

1. **Instalar PostgreSQL:**
   - Download: https://www.postgresql.org/download/windows/
   - Durante a instalação, defina uma senha para o usuário `postgres`

2. **Criar banco de dados:**
   ```powershell
   # Abrir PowerShell como Administrador
   
   # Entrar no psql
   psql -U postgres
   
   # Criar banco
   CREATE DATABASE universitas;
   
   # Sair
   \q
   ```

3. **Executar schema:**
   ```powershell
   cd "C:\Users\Michael Rodrigues\universidade_sistemas"
   psql -U postgres -d universitas -f database\schema.sql
   ```

4. **Configurar .env:**
   ```env
   DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/universitas
   ```

#### Opção B: Supabase (Recomendado - Gratuito)

1. **Criar conta:** https://supabase.com
2. **Criar novo projeto**
3. **Copiar Connection String:**
   - Settings → Database → Connection String (URI)
4. **Executar schema:**
   - SQL Editor → Copiar conteúdo de `database/schema.sql`
   - Execute Query
5. **Configurar .env:**
   ```env
   DATABASE_URL=postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJETO].supabase.co:5432/postgres
   ```

---

### 2️⃣ **OpenAI API (IA Educacional)**

1. **Criar conta:** https://platform.openai.com
2. **Adicionar créditos:**
   - Mínimo $5 USD
   - Billing → Add Payment Method
3. **Criar API Key:**
   - API Keys → Create new secret key
   - Copiar a chave (começa com `sk-proj-...`)
4. **Configurar .env:**
   ```env
   OPENAI_API_KEY=sk-proj-sua-chave-aqui
   ```

⚠️ **IMPORTANTE:** 
- Nunca compartilhe sua API key
- Monitore uso em: https://platform.openai.com/usage
- Custo estimado: ~$0.01 por conversa com IA

---

### 3️⃣ **JWT Secret (Segurança)**

1. **Gerar secret aleatório:**
   ```powershell
   # PowerShell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```
   
   Ou use: https://randomkeygen.com/ (seção "256-bit key")

2. **Configurar .env:**
   ```env
   JWT_SECRET=sua-string-aleatoria-super-segura-aqui
   ```

---

### 4️⃣ **Verificar Configuração**

Seu arquivo `platform/backend/.env` deve estar assim:

```env
DATABASE_URL=postgresql://postgres:minhasenha@localhost:5432/universitas
JWT_SECRET=abc123xyz789supersecret
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxx
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

## 🚀 Testando a Configuração

### 1. **Testar Banco de Dados**

```powershell
cd "C:\Users\Michael Rodrigues\universidade_sistemas\platform\backend"

# Instalar dependências (se ainda não instalou)
npm install

# Criar arquivo de teste
New-Item -ItemType File -Path test-db.js -Force
```

Conteúdo do `test-db.js`:
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Banco conectado com sucesso!');
    console.log('Hora do servidor:', res.rows[0].now);
    
    // Testar se tabelas existem
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📊 Tabelas encontradas:', tables.rows.length);
    tables.rows.forEach(t => console.log('  -', t.table_name));
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao conectar:', err.message);
    process.exit(1);
  }
}

testConnection();
```

Rodar teste:
```powershell
node test-db.js
```

### 2. **Testar OpenAI API**

```javascript
// test-openai.js
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function testOpenAI() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Diga olá!' }],
      max_tokens: 10
    });
    
    console.log('✅ OpenAI conectada!');
    console.log('Resposta:', completion.choices[0].message.content);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

testOpenAI();
```

```powershell
node test-openai.js
```

### 3. **Rodar Backend**

```powershell
npm run dev
```

Você deve ver:
```
🎓 UNIVERSITAS API running on port 3001
📚 Environment: development
🔗 Health check: http://localhost:3001/health
✅ Database connected successfully
```

### 4. **Testar Endpoints**

```powershell
# Health check
curl http://localhost:3001/health

# Criar usuário
curl -X POST http://localhost:3001/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"nome_completo\":\"Teste User\",\"email\":\"teste@email.com\",\"senha\":\"senha123\"}'
```

---

## 🐛 Troubleshooting

### ❌ Erro: "connect ECONNREFUSED"
**Causa:** PostgreSQL não está rodando

**Solução:**
```powershell
# Verificar se PostgreSQL está rodando
Get-Service -Name postgresql*

# Se não estiver, iniciar
Start-Service postgresql-x64-15
```

### ❌ Erro: "password authentication failed"
**Causa:** Senha incorreta no DATABASE_URL

**Solução:** Verificar senha do PostgreSQL e atualizar `.env`

### ❌ Erro: "Incorrect API key"
**Causa:** API key da OpenAI inválida

**Solução:** 
1. Verificar se copiou a chave completa
2. Criar nova chave em https://platform.openai.com/api-keys

### ❌ Erro: "relation does not exist"
**Causa:** Schema não foi executado

**Solução:**
```powershell
psql -U postgres -d universitas -f database\schema.sql
```

---

## ✅ Checklist Final

Antes de rodar o projeto, verifique:

- [ ] PostgreSQL instalado e rodando
- [ ] Banco `universitas` criado
- [ ] Schema executado (15 tabelas criadas)
- [ ] OpenAI API key configurada com créditos
- [ ] JWT_SECRET gerado
- [ ] Arquivo `.env` criado no backend
- [ ] Arquivo `.env.local` criado no frontend
- [ ] Dependências instaladas (`npm install`)
- [ ] Testes de conexão passando

---

## 🚀 Próximo Passo

Quando tudo estiver configurado:

```powershell
# Terminal 1 - Backend
cd platform\backend
npm run dev

# Terminal 2 - Frontend
cd platform\frontend
npm run dev
```

Acesse: http://localhost:3000

---

**© 2026 UNIVERSITAS**

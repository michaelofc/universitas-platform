# 🔐 ÚLTIMA ETAPA: Pegar a Senha do Supabase

Você já tem todas as informações de conexão! Falta apenas a **senha**.

## 📋 Credenciais que você tem:

```
Host: aws-1-sa-east-1.pooler.supabase.com
Porta: 6543
Database: postgres
User: postgres.knmarndwmziwpmrllnlk
Pool Mode: Transaction
```

## 🔑 Como pegar a senha:

### Método 1: Connection String completa (RECOMENDADO)

1. Acesse: https://app.supabase.com/project/knmarndwmziwpmrllnlk/settings/database

2. Role até **"Connection string"**

3. Selecione **"Transaction"** (não Session)

4. A string aparecerá assim:
   ```
   postgresql://postgres.knmarndwmziwpmrllnlk:SUA_SENHA_AQUI@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
   ```

5. Copie **tudo**!

6. Cole no arquivo `.env`, substituindo toda a linha `DATABASE_URL=...`

---

### Método 2: Copiar apenas a senha

Se você vir a connection string acima, a senha é a parte entre os dois pontos (`:`) e o arroba (`@`).

Por exemplo, se a string for:
```
postgresql://postgres.knmarndwmziwpmrllnlk:abc123xyz789@aws-1-sa...
```

A senha é: `abc123xyz789`

Então substitua `[SUA-SENHA]` por ela:
```env
DATABASE_URL=postgresql://postgres.knmarndwmziwpmrllnlk:abc123xyz789@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
```

---

## ✅ Depois de configurar:

1. Salve o arquivo `.env`

2. Vá ao Supabase SQL Editor:
   - https://app.supabase.com/project/knmarndwmziwpmrllnlk/sql/new
   - Cole o conteúdo de `database/schema.sql`
   - Clique em **"Run"**

3. Teste a conexão:
   ```powershell
   cd platform\backend
   npm install
   node test-db.js
   ```

---

**Me envie a connection string completa que você copiar, que eu atualizo o .env para você! 👍**

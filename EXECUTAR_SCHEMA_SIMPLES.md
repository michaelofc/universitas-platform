# ✅ EXECUTAR SCHEMA - GUIA RÁPIDO

## 📋 Passos:

### 1️⃣ Fazer Login no Supabase
1. Acesse: https://app.supabase.com
2. Faça login com sua conta

### 2️⃣ Abrir SQL Editor
1. Selecione o projeto **knmarndwmziwpmrllnlk**
2. No menu lateral, clique em **SQL Editor** (ícone </> )
3. Clique em **"New Query"**

### 3️⃣ Executar o Schema
1. Abra o arquivo: `database/schema.sql` no seu editor de código
2. Selecione TODO o conteúdo (Ctrl+A)
3. Copie (Ctrl+C)
4. Cole no SQL Editor do Supabase
5. Clique em **"Run"** (ou Ctrl+Enter)

**Aguarde a execução** (pode demorar ~10-30 segundos)

### 4️⃣ Verificar Resultado
Você deve ver uma mensagem de sucesso e:
- ✅ 15 tabelas criadas
- ✅ 5 ciclos inseridos
- ✅ 2 views criadas
- ✅ 2 triggers criados
- ✅ 3 roles criados

### 5️⃣ Testar Conexão
Volte aqui e rode:
```powershell
cd platform\backend
node test-db.js
```

Deve aparecer:
```
✅ Banco conectado com sucesso!
📊 Tabelas encontradas: 15
  ✓ avaliacoes
  ✓ aulas
  ✓ ciclos
  ✓ desafios
  ...
📚 Ciclos cadastrados: 5
✅ Configuração do banco OK!
```

---

## ⚠️ Se der erro durante execução

**Erro comum:** "role already exists"
- Ignore, isso é normal se você já executou antes

**Erro:** "permission denied"  
- Use a aba **Database** → **Tables** → **New table** → **SQL Editor**

**Schema não executa completo:**
- Execute em 2 partes:
  1. Até a linha 476 (antes das roles)
  2. Depois as roles (linhas 481-490)

---

## 📞 Me avise quando executar!

Depois de rodar o schema e o teste, me diga se apareceu:
- ✅ 15 tabelas
- ✅ 5 ciclos

Aí podemos rodar o backend! 🚀

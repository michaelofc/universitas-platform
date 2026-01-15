# 🚀 GUIA DE DEPLOY NA VERCEL

## Pré-requisitos

1. Conta no GitHub (gratuita)
2. Conta na Vercel (gratuita) - https://vercel.com
3. Código no Git

---

## Passo 1: Preparar o Código

### 1.1 Inicializar Git (se ainda não fez)

```bash
cd C:\Users\Michael Rodrigues\universidade_sistemas
git init
git add .
git commit -m "Initial commit - UNIVERSITAS platform"
```

### 1.2 Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome: `universitas-platform`
3. Privado: Sim (recomendado)
4. Criar repositório

### 1.3 Enviar Código

```bash
git remote add origin https://github.com/SEU_USUARIO/universitas-platform.git
git branch -M main
git push -u origin main
```

---

## Passo 2: Deploy na Vercel

### 2.1 Conectar Vercel ao GitHub

1. Acesse: https://vercel.com/login
2. Login com GitHub
3. Autorizar Vercel

### 2.2 Importar Projeto

1. Click "Add New..." → "Project"
2. Selecione `universitas-platform`
3. Click "Import"

### 2.3 Configurar Build

**Framework Preset:** Next.js

**Root Directory:** `platform/frontend`

**Build Command:**
```bash
npm run build
```

**Output Directory:** `.next`

**Install Command:**
```bash
npm install
```

### 2.4 Variáveis de Ambiente

Adicione estas variáveis no painel Vercel:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]/postgres

# API Keys
GEMINI_API_KEY=sua_chave_gemini
JWT_SECRET=sua_chave_jwt_secreta

# Next.js
NEXT_PUBLIC_API_URL=https://seu-projeto.vercel.app/api
```

**Onde encontrar DATABASE_URL:**
1. Acesse Supabase: https://supabase.com
2. Seu projeto → Settings → Database
3. Copie "Connection string" (mode: Session)

---

## Passo 3: Deploy do Backend

**IMPORTANTE:** Vercel suporta Next.js API Routes. Vamos migrar o backend Express para API Routes.

### 3.1 Criar API Routes no Frontend

Arquivo: `platform/frontend/src/app/api/ciclos/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function GET() {
  const result = await pool.query('SELECT * FROM ciclos ORDER BY numero_ciclo');
  return NextResponse.json({ ciclos: result.rows });
}
```

**Repita para todas rotas:**
- `/api/ciclos/route.ts`
- `/api/auth/login/route.ts`
- `/api/auth/signup/route.ts`
- Etc.

---

## Passo 4: Verificar Deploy

Após deploy:

1. Vercel mostrará URL: `https://seu-projeto.vercel.app`
2. Acesse pelo navegador
3. Teste no smartphone

---

## 🎯 ATALHO RÁPIDO (Recomendado)

**Se quiser deploy AGORA sem migrar backend:**

### Opção A: Frontend-Only (Mais Rápido)

1. Deploy só frontend na Vercel
2. Backend continua rodando local ou em outro serviço

```bash
cd platform/frontend
vercel
```

Quando perguntar:
- Link to existing project? **No**
- Project name? **universitas**
- Directory? **.**  (enter)
- Framework? **Next.js** (detecta automático)

### Opção B: Usar Supabase Edge Functions (Backend)

Supabase tem funções serverless gratuitas:

1. Criar funções em `supabase/functions/`
2. Deploy via `supabase functions deploy`
3. Frontend aponta para essas funções

---

## 📱 Acesso Mobile

Após deploy na Vercel:

✅ Funciona em **qualquer smartphone**  
✅ URL pública: `https://universitas-xxx.vercel.app`  
✅ HTTPS automático  
✅ PWA-ready (pode instalar como app)

---

## 🆘 Troubleshooting

### Erro: "Build failed"
- Verificar dependências no `package.json`
- Verificar variáveis de ambiente
- Logs: Vercel Dashboard → Deployments → Ver logs

### Erro: "Database connection"
- Verificar DATABASE_URL está correta
- Supabase deve permitir conexões externas
- IP da Vercel pode precisar ser whitelisted

### Frontend funciona mas API não
- Verificar NEXT_PUBLIC_API_URL
- Criar API Routes dentro de `app/api/`
- Backend Express não funciona na Vercel (use API Routes)

---

## 🎓 Próximos Passos

Depois de funcionar:

1. **Custom Domain** (opcional)
   - Comprar domínio (.com.br ~R$40/ano)
   - Configurar na Vercel
   - Exemplo: `universitas.com.br`

2. **Analytics**
   - Vercel Analytics (gratuito)
   - Ver acessos, performance

3. **CI/CD Automático**
   - Já está ativo!
   - `git push` → auto-deploy

---

## 💰 Custos

**Vercel Free Tier:**
- ✅ 100GB bandwidth/mês
- ✅ Deploys ilimitados
- ✅ HTTPS grátis
- ✅ Domínio `.vercel.app` grátis

**Supabase Free Tier:**
- ✅ 500MB database
- ✅ 2GB bandwidth/mês
- ✅ 50k MAU (usuários ativos)

**Total: R$ 0,00/mês** 🎉

---

**Quer que eu faça o deploy agora ou prefere fazer você mesmo seguindo este guia?**

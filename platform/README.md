# 🎓 UNIVERSITAS — Plataforma Técnica

## 📁 Estrutura do Projeto

```
platform/
├── backend/          # API REST Node.js + TypeScript
├── frontend/         # Next.js 14 + TypeScript
├── shared/           # Código compartilhado (types, utils)
└── README.md         # Este arquivo
```

## 🚀 Quick Start

### 1. Backend (API)
```bash
cd backend
npm install
npm run dev
# API rodando em http://localhost:3001
```

### 2. Frontend (Web App)
```bash
cd frontend
npm install
npm run dev
# App rodando em http://localhost:3000
```

### 3. Banco de Dados
Criar banco PostgreSQL e executar:
```bash
psql -U postgres -d universitas < ../database/schema.sql
```

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express + TypeScript
- **ORM:** Prisma (opcional) ou SQL direto
- **Auth:** JWT
- **IA:** OpenAI SDK
- **Validation:** Zod

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS + Shadcn/ui
- **State:** Zustand + React Query
- **Forms:** React Hook Form + Zod

### Database
- **SGBD:** PostgreSQL 15+
- **Migrations:** SQL manual ou Prisma Migrate
- **Hosting:** Supabase (recomendado) ou self-hosted

## 📦 Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/universitas
JWT_SECRET=seu-secret-super-seguro
OPENAI_API_KEY=sk-...
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🎯 Próximos Passos

1. [x] Estrutura de pastas criada
2. [ ] Backend: Setup inicial
3. [ ] Backend: API autenticação
4. [ ] Backend: Endpoints de ciclos/módulos
5. [ ] Frontend: Setup Next.js
6. [ ] Frontend: Autenticação
7. [ ] Frontend: Dashboard do aluno
8. [ ] Integração IA

## 📚 Documentação

Ver documentação completa em: `../INDICE.md`

---

**© 2026 UNIVERSITAS**

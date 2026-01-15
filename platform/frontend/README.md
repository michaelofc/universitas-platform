# UNIVERSITAS Frontend

## 🚀 Quick Start

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
# O arquivo .env.local já está criado com:
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Rodar em desenvolvimento
```bash
npm run dev
```

Aplicação estará rodando em: `http://localhost:3000`

## 📱 Páginas Criadas

### Públicas
- `/` — Landing page
- `/login` — Login
- `/signup` — Cadastro

### Autenticadas (em desenvolvimento)
- `/dashboard` — Dashboard do aluno
- `/ciclos` — Lista de ciclos
- `/modulos/:id` — Detalhes do módulo
- `/chat-ia` — Chat com IA

## 🛠️ Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State:**
  - Zustand (autenticação)
  - React Query (cache de API)
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios
- **Icons:** Lucide React

## 📦 Estrutura de Pastas

```
src/
├── app/
│   ├── page.tsx           # Landing page
│   ├── login/page.tsx     # Login
│   ├── signup/page.tsx    # Cadastro
│   ├── dashboard/         # (a criar)
│   ├── layout.tsx         # Layout principal
│   ├── providers.tsx      # React Query Provider
│   └── globals.css        # CSS global
├── lib/
│   └── api.ts             # Cliente Axios + endpoints
└── store/
    └── auth.ts            # Store Zustand de autenticação
```

## 🎨 Design System

### Cores Principais
- **Primary:** Blue (#0ea5e9)
- **Secondary:** Purple (#a855f7)

### Componentes
- Formulários com validação Zod
- Cards responsivos
- Layout com Tailwind

## 🔒 Autenticação

O sistema usa:
1. JWT armazenado em `localStorage`
2. Zustand para gerenciar estado de auth
3. Interceptor Axios que adiciona token automaticamente
4. Redirect automático para `/login` se token expirar

## ✅ Teste o Frontend

1. Acesse `http://localhost:3000`
2. Clique em "Começar Agora"
3. Crie uma conta
4. Faça login
5. Será redirecionado para `/dashboard` (criar)

## 📝 Próximos Passos

- [ ] Criar página `/dashboard`
- [ ] Criar listagem de ciclos
- [ ] Criar visualização de módulos
- [ ] Implementar chat com IA
- [ ] Adicionar submissão de exercícios

---

**© 2026 UNIVERSITAS**

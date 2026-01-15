# MÓDULO 3 — MULTI-API ORCHESTRATOR  
**Integrando Múltiplos Sistemas via APIs**

## Visão Geral

**Objetivo:** Orquestrar 3+ APIs em um workflow coeso, lidando com OAuth, rate limiting, transformação de dados e diferentes schemas.

**Produto Final:** Lead Sync Engine - sincroniza leads entre Google Sheets, CRM (HubSpot/Pipedrive) e Slack automaticamente.

**Duração:** 10 dias

## O Que Você Vai Construir

Sistema que:
- Busca leads de Google Sheets (API)
- Enrichece com dados externos (Clearbit/Hunter)
- Valida se já existe no CRM
- Cria ou atualiza contato
- Notifica equipe no Slack
- Roda a cada hora (cron job)

## Pré-requisitos

✅ Módulo 2 concluído  
✅ Entende promises e async/await  
✅ Sabe trabalhar com JSON

## Conceitos Principais

- **OAuth 2.0** (autorização segura)
- **Rate Limiting** (respeitar limites de API)
- **Data Transformation** (converter schemas)
- **Pagination** (cursor, offset, limit)
- **Caching** (Redis para performance)
- **Scheduling** (node-cron)

## Valor Comercial

Cobrar: R$ 2.500-5.000 (setup) + R$ 400/mês

Use cases:
- Sincronizador de leads
- Integrador de vendas
- Automação de marketing

## Estrutura de Aulas

1. **OAuth 2.0 na Prática** - Conectar APIs com segurança
2. **Rate Limiting & Pagination** - Lidar com limites e grandes volumes
3. **Data Transformation** - Mapear schemas incompatíveis
4. **Caching & Performance** - Otimizar com Redis

**Ver arquivos de aula para conteúdo completo.**

---

# Aula 01 — OAuth 2.0 na Prática

## O Problema

APIs modernas não aceitam "usuário e senha". Usam **OAuth 2.0** - protocolo que permite apps acessarem recursos sem expor credenciais.

**Cenário:** Você quer ler Google Sheets do usuário. Como?

❌ **Errado:** Pedir usuário/senha do Google (inseguro)  
✅ **Correto:** OAuth 2.0 (usuário autoriza, você recebe token)

## Fluxo OAuth 2.0

```
[Seu App] ──1. Redirect──▶ [Google]
               "Autorizar?"
                    │
                    │ 2. Usuário aceita
                    ▼
[Google] ──3. Callback──▶ [Seu App]
           with code
                    │
                    │ 4. Troca code por token
                    ▼
[Seu App] ◀──5. Access Token── [Google]

Agora você usa token para chamar API
```

## Implementação (Google Sheets)

### 1. Setup no Google Cloud

1. Acesse: https://console.cloud.google.com
2. Crie projeto
3. Habilite Google Sheets API
4. Criar credenciais OAuth 2.0
5. Configure redirect URI: `http://localhost:3000/auth/callback`
6. Copie Client ID e Client Secret

### 2. Instalar Biblioteca

```bash
npm install googleapis
```

### 3. Código de Autenticação

```javascript
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/callback'
);

// Gerar URL de autorização
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline', // Recebe refresh token
  scope: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

console.log('Autorize: ', authUrl);

// Callback (recebe code)
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  
  // Salvar tokens no banco
  await db.query('INSERT INTO tokens (access_token, refresh_token) VALUES (?, ?)',
    [tokens.access_token, tokens.refresh_token]
  );
  
  res.send('Autorizado! Pode fechar.');
});
```

### 4. Usar API

```javascript
async function readSheet(spreadsheetId) {
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: 'A1:D100'
  });
  
  return response.data.values;
}
```

## Refresh Token

Access token expira (geralmente 1h). Refresh token renova:

```javascript
async function getValidToken() {
  const tokens = await db.query('SELECT * FROM tokens LIMIT 1');
  
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token
  });
  
  // Automaticamente renova se expirado
  const { credentials } = await oauth2Client.refreshAccessToken();
  
  // Salvar novo access_token
  await db.query('UPDATE tokens SET access_token = ?', [credentials.access_token]);
  
  return credentials.access_token;
}
```

## Conexão com Produto

OAuth permite integrar qualquer API moderna:
- Google (Sheets, Calendar, Gmail)
- Microsoft (Outlook, OneDrive)
- Slack, HubSpot, Salesforce...

Cliente paga R$ 1.500-3.000 por integrações OAuth bem feitas.

---

*Continue nas próximas aulas para aprender rate limiting, pagination, transformation e caching.*

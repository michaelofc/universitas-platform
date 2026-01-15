-- ============================================
-- SEED DATA - Ciclo 1: Fundamentos de Automação
-- ============================================

-- Pegar o ID do Ciclo 1
DO $$
DECLARE
    ciclo1_id UUID;
    modulo1_id UUID;
    modulo2_id UUID;
    modulo3_id UUID;
BEGIN
    -- Buscar ID do Ciclo 1
    SELECT id INTO ciclo1_id FROM ciclos WHERE numero_ciclo = 1;

    -- ============================================
    -- MÓDULO 1: Python e Fundamentos
    -- ============================================
    INSERT INTO modulos (
        ciclo_id, codigo, nome, descricao, objetivos, ordem_no_ciclo,
        pontuacao_maxima, pontuacao_minima_aprovacao, duracao_estimada_horas,
        nivel_dificuldade, tags
    ) VALUES (
        ciclo1_id,
        'C1M01',
        'Python e Fundamentos de Programação',
        'Aprenda Python do zero e crie sua primeira automação',
        ARRAY['Dominar sintaxe Python', 'Criar scripts básicos', 'Automatizar tarefas simples'],
        1,
        100,
        70,
        20,
        'iniciante',
        ARRAY['python', 'programacao', 'automacao']
    ) RETURNING id INTO modulo1_id;

    -- Aulas do Módulo 1
    INSERT INTO aulas (modulo_id, ordem_na_aula, titulo, tipo_conteudo, conteudo_markdown, duracao_minutos) VALUES
    (modulo1_id, 1, 'Bem-vindo à UNIVERSITAS', 'video', 
     '# Bem-vindo ao Ciclo 1!
     
Você está prestes a iniciar uma jornada transformadora. Ao final deste ciclo, você terá:
- Criado 10+ produtos vendáveis
- Dominado Python para automação
- Gerado suas primeiras vendas

## O que você vai aprender
- Python do zero
- APIs e integrações
- Automação de processos
- Como vender seus produtos

Vamos começar!', 
     10),
    
    (modulo1_id, 2, 'Instalando Python e VS Code', 'pratica',
     '# Setup do Ambiente
     
## Passo 1: Instalar Python
1. Acesse python.org
2. Baixe Python 3.11+
3. **IMPORTANTE:** Marque "Add Python to PATH"
4. Instale

## Passo 2: Instalar VS Code
1. Acesse code.visualstudio.com
2. Baixe e instale
3. Instale extensão Python

## Passo 3: Testar
```python
print("Olá, UNIVERSITAS!")
```

Execute e veja o resultado!',
     30),
    
    (modulo1_id, 3, 'Variáveis e Tipos de Dados', 'video',
     '# Variáveis em Python
     
```python
# Strings (texto)
nome = "João"
produto = "Automação de WhatsApp"

# Números
preco = 297.00
clientes = 50

# Booleanos
ativo = True
pago = False

# Listas
tecnologias = ["Python", "API", "Automação"]

# Dicionários
cliente = {
    "nome": "Maria",
    "email": "maria@email.com",
    "plano": "premium"
}
```

## Exercício
Crie variáveis para seu primeiro produto vendável!',
     45),
    
    (modulo1_id, 4, 'Seu Primeiro Script de Automação', 'pratica',
     '# Automação: Gerador de Mensagens
     
Vamos criar um script que gera mensagens personalizadas para WhatsApp:

```python
# gerador_mensagens.py
def gerar_mensagem_vendas(nome_cliente, produto, preco):
    mensagem = f"""
Olá {nome_cliente}! 👋

Vi que você tem interesse em {produto}.

🎯 **Oferta Especial:**
- Preço: R$ {preco}
- Suporte incluso
- Atualizações vitalícias

Quer garantir? Responda SIM!
    """
    return mensagem

# Teste
print(gerar_mensagem_vendas("João", "Bot de WhatsApp", 197))
```

## Desafio
Modifique para adicionar um desconto de 20%!', 
     60);

    -- Exercícios do Módulo 1
    INSERT INTO exercicios (
        modulo_id, ordem_no_modulo, titulo, descricao, instrucoes_markdown,
        criterios_avaliacao, pontuacao_maxima, tempo_estimado_minutos
    ) VALUES
    (modulo1_id, 1, 'Calculadora de ROI', 
     'Crie uma calculadora que mostra o retorno de investimento de uma automação',
     '# Calculadora de ROI
     
## Objetivo
Criar um script que calcula quanto o cliente economiza ao comprar sua automação.

## Requisitos
1. Perguntar: horas gastas por mês na tarefa manual
2. Perguntar: valor da hora do profissional
3. Calcular economia anual
4. Mostrar ROI em meses

## Exemplo de saída:
```
Horas gastas: 20h/mês
Valor hora: R$ 50
Economia anual: R$ 12.000
ROI: Retorno em 0.5 meses!
```',
     '{"criterios": ["Código funcional", "Cálculos corretos", "Output formatado"]}'::jsonb,
     30,
     45);

    -- ============================================
    -- MÓDULO 2: APIs e Integrações
    -- ============================================
    INSERT INTO modulos (
        ciclo_id, codigo, nome, descricao, objetivos, ordem_no_ciclo,
        pontuacao_maxima, pontuacao_minima_aprovacao, duracao_estimada_horas,
        nivel_dificuldade, tags, desbloqueado_por, pontuacao_minima_desbloqueio
    ) VALUES (
        ciclo1_id,
        'C1M02',
        'APIs e Integrações Simples',
        'Conecte sistemas e crie integrações valios as',
        ARRAY['C onsumir APIs REST', 'Integrar WhatsApp', 'Criar webhooks'],
        2,
        100,
        70,
        25,
        'iniciante',
        ARRAY['api', 'integracao', 'whatsapp'],
        modulo1_id,
        70
    ) RETURNING id INTO modulo2_id;

    -- Aulas do Módulo 2
    INSERT INTO aulas (modulo_id, ordem_na_aula, titulo, tipo_conteudo, conteudo_markdown, duracao_minutos) VALUES
    (modulo2_id, 1, 'O que são APIs?', 'video',
     '# APIs - Conectando Sistemas
     
## O que é uma API?
API = Interface de Programação de Aplicações

É como um garçom em um restaurante:
- Você (seu código) faz o pedido
- O garçom (API) leva para a cozinha
- A cozinha (servidor) prepara
- O garçom traz de volta

## Exemplos de APIs que você vai usar:
- WhatsApp Business API
- Google Sheets API
- Notion API
- OpenAI API (ChatGPT)

Vamos integrar tudo!',
     30),
    
    (modulo2_id, 2, 'Sua Primeira Integração: Google Sheets', 'pratica',
     '# Integração com Google Sheets
     
## Por que Google Sheets?
- Banco de dados gratuito
- Interface visual
- Fácil de compartilhar

## Código:
```python
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Conectar
scope = ["https://spreadsheets.google.com/feeds"]
creds = ServiceAccountCredentials.from_json_keyfile_name("creds.json", scope)
client = gspread.authorize(creds)

# Abrir planilha
sheet = client.open("Clientes").sheet1

# Adicionar cliente
sheet.append_row(["João", "joao@email.com", "Pago"])

print("Cliente adicionado!")
```

## Produto Vendável
Um CRM simples que gerencia clientes no Sheets!',
     60);

    -- ============================================
    -- MÓDULO 3: Primeiro Produto Vendável
    -- ============================================
    INSERT INTO modulos (
        ciclo_id, codigo, nome, descricao, objetivos, ordem_no_ciclo,
        pontuacao_maxima, pontuacao_minima_aprovacao, duracao_estimada_horas,
        nivel_dificuldade, tags, desbloqueado_por, pontuacao_minima_desbloqueio
    ) VALUES (
        ciclo1_id,
        'C1M03',
        'Criando Seu Primeiro Produto Vendável',
        'Transforme seu conhecimento em um produto que vende',
        ARRAY['Criar automação vendável', 'Precificar corretamente', 'Fazer primeira venda'],
        3,
        100,
        70,
        30,
        'intermediário',
        ARRAY['produto', 'vendas', 'pricing'],
        modulo2_id,
        70
    ) RETURNING id INTO modulo3_id;

    -- Aulas do Módulo 3
    INSERT INTO aulas (modulo_id, ordem_na_aula, titulo, tipo_conteudo, conteudo_markdown, duracao_minutos) VALUES
    (modulo3_id, 1, 'Escolhendo Seu Nicho', 'video',
     '# Como Escolher o Produto Certo
     
## Critérios de um bom produto:
1. **Dor clara**: Resolve um problema específico
2. **ROI evidente**: Economiza tempo/dinheiro
3. **Fácil de vender**: Cliente entende o valor
4. **Recorrência**: Pode gerar MRR

## Exemplos de produtos iniciantes:
- Gerador de relatórios automáticos
- Bot de respostas WhatsApp
- Integração Sheets + API
- Automação de e-mails

## Exercício
Escolha 3 nichos que você conhece e liste suas dores!',
     40),
    
    (modulo3_id, 2, 'Precificação: Quanto Cobrar?', 'video',
     '# Estratégias de Precificação
     
## Fórmula Simples:
```
Preço = (Horas economizadas × Valor hora do cliente) × 12 meses ÷ 10
```

## Exemplo:
- Cliente gasta 10h/mês em tarefa manual
- Valor hora: R$ 100
- Economia anual: R$ 12.000
- **Preço sugerido: R$ 1.200** (10% da economia)

## Modelos de cobrança:
1. **One-time**: R$ 500 - R$ 2.000
2. **Mensal**: R$ 97 - R$ 497/mês
3. **Setup + Mensal**: R$ 300 + R$ 197/mês

Comece com one-time, evolua para recorrente!',
     45),
    
    (modulo3_id, 3, 'Fazendo Sua Primeira Venda', 'pratica',
     '# Script de Vendas

## Outreach (Mensagem inicial):
```
Oi [Nome]!

Vi que você [CONTEXTO]. Desenvolvi uma automação que economiza [X HORAS] por mês nessa tarefa.

Empresas similares já economizaram R$ [VALOR] no primeiro mês.

Posso te mostrar como funciona em 10 minutos?
```

## Pitch (Apresentação):
1. Problema atual (2 min)
2. Demonstração ao vivo (5 min)
3. ROI e resultados (2 min)
4. Oferta e próximos passos (1 min)

## Fechamento:
```
Investimento: R$ [PREÇO]
Garantia: 7 dias
Setup: 48h

Quer garantir?
```

Pratique com 5 pessoas essa semana!',
     50);

    -- Desafio do Módulo 3
    INSERT INTO desafios (
        modulo_id, titulo, descricao_problema, cenario_real,
        requisitos_minimos, requisitos_bonus, criterios_avaliacao,
        pontuacao_maxima, produto_esperado, valor_mercado_estimado, tempo_estimado_horas
    ) VALUES
    (modulo3_id, 
     'Crie e Venda Seu Primeiro Produto',
     'Desenvolva uma automação completa e faça pelo menos 1 venda',
     'Você identificou que donos de e-commerce gastam 15h/mês respondendo dúvidas repetitivas no WhatsApp.',
     ARRAY[
         'Código Python funcional',
         'Documentação de uso',
         'Cálculo de ROI apresentável',
         'Script de vendas',
         'Comprovante de 1 venda ou proposta enviada'
     ],
     ARRAY[
         'Vídeo de demonstração',
         '3+ vendas',
         'Depoimento de cliente',
         'Setup automático'
     ],
     '{
         "funcionalidade": 40,
         "documentacao": 20,
         "apresentacao": 20,
         "venda": 20
     }'::jsonb,
     40,
     'Bot de Respostas Automáticas para WhatsApp',
     'R$ 297 - R$ 997',
     40
    );

END $$;

-- Mensagem de confirmação
SELECT 'Seed data inserido com sucesso! 3 módulos criados para o Ciclo 1.' AS status;

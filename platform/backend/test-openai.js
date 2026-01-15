const OpenAI = require('openai');
require('dotenv').config();

async function testOpenAI() {
    try {
        console.log('🤖 Testando conexão com OpenAI API...\n');

        if (!process.env.OPENAI_API_KEY) {
            console.error('❌ OPENAI_API_KEY não configurada no .env');
            process.exit(1);
        }

        if (process.env.OPENAI_API_KEY.startsWith('sk-proj-sua-chave')) {
            console.error('❌ Configure uma API key real no .env');
            console.error('Obtenha em: https://platform.openai.com/api-keys');
            process.exit(1);
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        console.log('📤 Enviando mensagem de teste...');

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'user',
                    content: 'Responda apenas: "Conexão OK"'
                }
            ],
            max_tokens: 10
        });

        const resposta = completion.choices[0].message.content;

        console.log('✅ OpenAI conectada com sucesso!');
        console.log('📩 Resposta:', resposta);
        console.log('💰 Tokens usados:', completion.usage.total_tokens);
        console.log('\n✅ IA Educacional está pronta para uso!');

        process.exit(0);
    } catch (err) {
        console.error('\n❌ Erro ao conectar com OpenAI:');
        console.error('Mensagem:', err.message);

        if (err.message.includes('Incorrect API key')) {
            console.error('\nVerifique:');
            console.error('1. API key está correta?');
            console.error('2. Tem créditos na conta OpenAI?');
            console.error('   → https://platform.openai.com/usage');
        }

        process.exit(1);
    }
}

testOpenAI();

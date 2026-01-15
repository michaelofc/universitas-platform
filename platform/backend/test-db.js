const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function testConnection() {
    try {
        console.log('🔍 Testando conexão com PostgreSQL...\n');

        // Test connection
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Banco conectado com sucesso!');
        console.log('⏰ Hora do servidor:', res.rows[0].now, '\n');

        // Check tables
        const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

        console.log('📊 Tabelas encontradas:', tables.rows.length);

        if (tables.rows.length === 0) {
            console.log('\n⚠️  ATENÇÃO: Nenhuma tabela encontrada!');
            console.log('Execute o schema: psql -U postgres -d universitas -f ..\\..\\database\\schema.sql\n');
        } else {
            console.log('\nTabelas:');
            tables.rows.forEach(t => console.log('  ✓', t.table_name));

            // Check ciclos data
            const ciclos = await pool.query('SELECT COUNT(*) FROM ciclos');
            console.log('\n📚 Ciclos cadastrados:', ciclos.rows[0].count);

            if (ciclos.rows[0].count === '0') {
                console.log('⚠️  Execute o schema completo para inserir os 5 ciclos iniciais');
            }
        }

        console.log('\n✅ Configuração do banco OK!');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Erro ao conectar ao banco:');
        console.error('Mensagem:', err.message);
        console.error('\nVerifique:');
        console.error('1. PostgreSQL está rodando?');
        console.error('2. DATABASE_URL está correto no .env?');
        console.error('3. Banco "universitas" foi criado?');
        process.exit(1);
    }
}

testConnection();

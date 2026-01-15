const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function verificarSchema() {
    try {
        console.log('🔍 Verificando schema completo...\n');

        // Contar tabelas
        const tabelas = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

        console.log(`✅ Tabelas criadas: ${tabelas.rows.length}`);
        console.log('\n📋 Lista de tabelas:');
        tabelas.rows.forEach(t => console.log(`  ✓ ${t.table_name}`));

        // Contar ciclos
        const ciclos = await pool.query('SELECT * FROM ciclos ORDER BY numero_ciclo');
        console.log(`\n📚 Ciclos cadastrados: ${ciclos.rows.length}`);

        if (ciclos.rows.length > 0) {
            console.log('\n🎓 Detalhes dos ciclos:');
            ciclos.rows.forEach(c => {
                console.log(`  ${c.numero_ciclo}. ${c.nome}`);
                console.log(`     → ${c.perfil_entrada} → ${c.perfil_saida}`);
            });
        }

        // Verificar views
        const views = await pool.query(`
      SELECT table_name 
      FROM information_schema.views 
      WHERE table_schema = 'public'
    `);

        console.log(`\n👁️  Views criadas: ${views.rows.length}`);
        views.rows.forEach(v => console.log(`  ✓ ${v.table_name}`));

        console.log('\n🎉 SCHEMA EXECUTADO COM SUCESSO!');
        console.log('✅ Banco de dados pronto para uso!\n');

        process.exit(0);
    } catch (err) {
        console.error('\n❌ Erro:', err.message);
        process.exit(1);
    }
}

verificarSchema();

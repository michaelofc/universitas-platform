import { Router } from 'express';
import { query } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/ciclos - Listar todos os ciclos
router.get('/', async (req, res, next) => {
    try {
        const result = await query(
            `SELECT id, numero_ciclo, nome, descricao, perfil_entrada, perfil_saida,
              duracao_estimada_meses, pontuacao_minima_aprovacao, ordem_exibicao
       FROM ciclos
       WHERE ativo = true
       ORDER BY ordem_exibicao`
        );

        res.json({ ciclos: result.rows });
    } catch (error) {
        next(error);
    }
});

// GET /api/ciclos/:id - Detalhes de um ciclo
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const cicloResult = await query(
            `SELECT id, numero_ciclo, nome, descricao, perfil_entrada, perfil_saida,
              duracao_estimada_meses, pontuacao_minima_aprovacao
       FROM ciclos
       WHERE id = $1 AND ativo = true`,
            [id]
        );

        if (cicloResult.rows.length === 0) {
            return res.status(404).json({ error: 'Ciclo not found' });
        }

        // Get modules
        const modulosResult = await query(
            `SELECT id, codigo, nome, descricao, ordem_no_ciclo, pontuacao_maxima,
              pontuacao_minima_aprovacao, duracao_estimada_horas, nivel_dificuldade, tags
       FROM modulos
       WHERE ciclo_id = $1 AND ativo = true
       ORDER BY ordem_no_ciclo`,
            [id]
        );

        res.json({
            ciclo: cicloResult.rows[0],
            modulos: modulosResult.rows
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/ciclos/:id/inscrever - Inscrever-se em um ciclo
router.post('/:id/inscrever', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const { id: cicloId } = req.params;
        const userId = req.userId;

        // Check if already enrolled
        const existing = await query(
            'SELECT id FROM inscricoes WHERE usuario_id = $1 AND ciclo_id = $2',
            [userId, cicloId]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Already enrolled in this ciclo' });
        }

        // Create inscription
        const inscricaoResult = await query(
            `INSERT INTO inscricoes (usuario_id, ciclo_id, data_inicio, status)
       VALUES ($1, $2, CURRENT_TIMESTAMP, 'em_andamento')
       RETURNING id`,
            [userId, cicloId]
        );

        const inscricaoId = inscricaoResult.rows[0].id;

        // Get first module to unlock
        const firstModuloResult = await query(
            `SELECT id FROM modulos 
       WHERE ciclo_id = $1 AND desbloqueado_por IS NULL AND ativo = true
       ORDER BY ordem_no_ciclo
       LIMIT 1`,
            [cicloId]
        );

        if (firstModuloResult.rows.length > 0) {
            await query(
                `INSERT INTO progresso_modulos (inscricao_id, modulo_id, status, data_desbloqueio)
         VALUES ($1, $2, 'desbloqueado', CURRENT_TIMESTAMP)`,
                [inscricaoId, firstModuloResult.rows[0].id]
            );
        }

        res.status(201).json({
            message: 'Enrolled successfully',
            inscricao_id: inscricaoId
        });
    } catch (error) {
        next(error);
    }
});

export default router;

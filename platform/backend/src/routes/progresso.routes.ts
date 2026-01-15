import { Router } from 'express';
import { query } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/progresso - Progresso geral do aluno
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const userId = req.userId;

        const result = await query(
            `SELECT * FROM vw_progresso_aluno WHERE usuario_id = $1`,
            [userId]
        );

        res.json({ progresso: result.rows });
    } catch (error) {
        next(error);
    }
});

// GET /api/progresso/modulo/:moduloId - Progresso em módulo específico
router.get('/modulo/:moduloId', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const { moduloId } = req.params;
        const userId = req.userId;

        // Get inscricao
        const inscricaoResult = await query(
            `SELECT i.id FROM inscricoes i
       JOIN modulos m ON i.ciclo_id = m.ciclo_id
       WHERE i.usuario_id = $1 AND m.id = $2`,
            [userId, moduloId]
        );

        if (inscricaoResult.rows.length === 0) {
            return res.json({ progresso: null, message: 'Not enrolled in this ciclo' });
        }

        const inscricaoId = inscricaoResult.rows[0].id;

        const result = await query(
            `SELECT pm.*, m.nome as modulo_nome, m.pontuacao_maxima
       FROM progresso_modulos pm
       JOIN modulos m ON pm.modulo_id = m.id
       WHERE pm.inscricao_id = $1 AND pm.modulo_id = $2`,
            [inscricaoId, moduloId]
        );

        res.json({ progresso: result.rows[0] || null });
    } catch (error) {
        next(error);
    }
});

export default router;

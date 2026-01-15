import { Router } from 'express';
import { query } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const router = Router();

// GET /api/modulos/:id - Detalhes do módulo
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const { id } = req.params;

        const moduloResult = await query(
            `SELECT m.*, c.nome as ciclo_nome
       FROM modulos m
       JOIN ciclos c ON m.ciclo_id = c.id
       WHERE m.id = $1 AND m.ativo = true`,
            [id]
        );

        if (moduloResult.rows.length === 0) {
            throw new AppError(404, 'Módulo not found');
        }

        // Get aulas
        const aulasResult = await query(
            `SELECT id, ordem_na_aula, titulo, tipo_conteudo, video_url, duracao_minutos
       FROM aulas
       WHERE modulo_id = $1
       ORDER BY ordem_na_aula`,
            [id]
        );

        // Get exercícios
        const exerciciosResult = await query(
            `SELECT id, ordem_no_modulo, titulo, descricao, pontuacao_maxima, tempo_estimado_minutos
       FROM exercicios
       WHERE modulo_id = $1
       ORDER BY ordem_no_modulo`,
            [id]
        );

        // Get desafios
        const desafiosResult = await query(
            `SELECT id, titulo, descricao_problema, produto_esperado, pontuacao_maxima, 
              valor_mercado_estimado, tempo_estimado_horas
       FROM desafios
       WHERE modulo_id = $1`,
            [id]
        );

        res.json({
            modulo: moduloResult.rows[0],
            aulas: aulasResult.rows,
            exercicios: exerciciosResult.rows,
            desafios: desafiosResult.rows
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/modulos/:id/aulas/:aulaId - Conteúdo completo da aula
router.get('/:id/aulas/:aulaId', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const { id, aulaId } = req.params;

        const result = await query(
            `SELECT * FROM aulas WHERE id = $1 AND modulo_id = $2`,
            [aulaId, id]
        );

        if (result.rows.length === 0) {
            throw new AppError(404, 'Aula not found');
        }

        res.json({ aula: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

export default router;

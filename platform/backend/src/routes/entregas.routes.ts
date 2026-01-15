import { Router } from 'express';
import { z } from 'zod';
import { query } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const router = Router();

const criarEntregaSchema = z.object({
    progresso_modulo_id: z.string().uuid(),
    tipo_entrega: z.enum(['exercicio', 'desafio', 'tcc']),
    exercicio_id: z.string().uuid().optional(),
    desafio_id: z.string().uuid().optional(),
    url_repositorio: z.string().url().optional(),
    url_demonstracao: z.string().url().optional(),
    url_video_apresentacao: z.string().url().optional(),
    descricao_solucao: z.string(),
    documentacao_markdown: z.string().optional()
});

// POST /api/entregas - Criar entrega
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const data = criarEntregaSchema.parse(req.body);

        // Verify ownership
        const ownership = await query(
            `SELECT i.usuario_id FROM progresso_modulos pm
       JOIN inscricoes i ON pm.inscricao_id = i.id
       WHERE pm.id = $1`,
            [data.progresso_modulo_id]
        );

        if (ownership.rows.length === 0 || ownership.rows[0].usuario_id !== req.userId) {
            throw new AppError(403, 'Not authorized');
        }

        // Create entrega
        const result = await query(
            `INSERT INTO entregas (
        progresso_modulo_id, tipo_entrega, exercicio_id, desafio_id,
        url_repositorio, url_demonstracao, url_video_apresentacao,
        descricao_solucao, documentacao_markdown, status_avaliacao
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'aguardando')
      RETURNING id, data_entrega`,
            [
                data.progresso_modulo_id,
                data.tipo_entrega,
                data.exercicio_id || null,
                data.desafio_id || null,
                data.url_repositorio || null,
                data.url_demonstracao || null,
                data.url_video_apresentacao || null,
                data.descricao_solucao,
                data.documentacao_markdown || null
            ]
        );

        res.status(201).json({
            message: 'Entrega criada com sucesso',
            entrega_id: result.rows[0].id,
            data_entrega: result.rows[0].data_entrega
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/entregas/:id - Ver entrega
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT e.*, m.nome as modulo_nome
       FROM entregas e
       JOIN progresso_modulos pm ON e.progresso_modulo_id = pm.id
       JOIN modulos m ON pm.modulo_id = m.id
       JOIN inscricoes i ON pm.inscricao_id = i.id
       WHERE e.id = $1 AND i.usuario_id = $2`,
            [id, req.userId]
        );

        if (result.rows.length === 0) {
            throw new AppError(404, 'Entrega not found');
        }

        // Get avaliacoes
        const avaliacoes = await query(
            `SELECT a.*, u.nome_completo as avaliador_nome
       FROM avaliacoes a
       LEFT JOIN usuarios u ON a.avaliador_id = u.id
       WHERE a.entrega_id = $1
       ORDER BY a.data_avaliacao DESC`,
            [id]
        );

        res.json({
            entrega: result.rows[0],
            avaliacoes: avaliacoes.rows
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/entregas - Listar minhas entregas
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const result = await query(
            `SELECT e.*, m.nome as modulo_nome, c.nome as ciclo_nome
       FROM entregas e
       JOIN progresso_modulos pm ON e.progresso_modulo_id = pm.id
       JOIN modulos m ON pm.modulo_id = m.id
       JOIN ciclos c ON m.ciclo_id = c.id
       JOIN inscricoes i ON pm.inscricao_id = i.id
       WHERE i.usuario_id = $1
       ORDER BY e.data_entrega DESC`,
            [req.userId]
        );

        res.json({ entregas: result.rows });
    } catch (error) {
        next(error);
    }
});

export default router;

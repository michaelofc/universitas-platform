import { Router } from 'express';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { IAEducacional, ModoIA } from '../services/ia.service';

const router = Router();

const iaService = new IAEducacional();

const chatSchema = z.object({
    modo: z.enum(['aluno', 'mentor', 'professor']),
    mensagem: z.string().min(1),
    contexto: z.object({
        modulo_id: z.string().uuid().optional(),
        codigo: z.string().optional(),
        aula: z.string().optional()
    }).optional()
});

// POST /api/ia/chat - Chat com IA
router.post('/chat', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const data = chatSchema.parse(req.body);

        let resposta: string;

        switch (data.modo) {
            case 'aluno':
                resposta = await iaService.modoAluno(data.mensagem, data.contexto || {});
                break;
            case 'mentor':
                if (!data.contexto?.codigo) {
                    return res.status(400).json({ error: 'Código é obrigatório para modo mentor' });
                }
                const avaliacao = await iaService.modoMentor(data.contexto.codigo, data.mensagem);
                return res.json({ avaliacao });
            case 'professor':
                if (!data.contexto?.aula) {
                    return res.status(400).json({ error: 'Conteúdo da aula é obrigatório para modo professor' });
                }
                const feedback = await iaService.modoProfessor(data.contexto.aula);
                return res.json({ feedback });
            default:
                return res.status(400).json({ error: 'Modo inválido' });
        }

        res.json({ resposta });
    } catch (error) {
        next(error);
    }
});

export default router;

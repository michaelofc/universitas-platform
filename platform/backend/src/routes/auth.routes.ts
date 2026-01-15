import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Validation schemas
const signupSchema = z.object({
    nome_completo: z.string().min(3),
    email: z.string().email(),
    senha: z.string().min(6),
    telefone: z.string().optional(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    senha: z.string()
});

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
    try {
        const data = signupSchema.parse(req.body);

        // Check if email exists
        const existing = await query(
            'SELECT id FROM usuarios WHERE email = $1',
            [data.email]
        );

        if (existing.rows.length > 0) {
            throw new AppError(409, 'Email already registered');
        }

        // Hash password
        const senhaHash = await bcrypt.hash(data.senha, 10);

        // Insert user
        const result = await query(
            `INSERT INTO usuarios (nome_completo, email, senha_hash, telefone, linkedin, github, tipo_usuario)
       VALUES ($1, $2, $3, $4, $5, $6, 'aluno')
       RETURNING id, nome_completo, email, tipo_usuario, criado_em`,
            [data.nome_completo, data.email, senhaHash, data.telefone || null, data.linkedin || null, data.github || null]
        );

        const user = result.rows[0];

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email, tipo: user.tipo_usuario },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                nome_completo: user.nome_completo,
                email: user.email,
                tipo_usuario: user.tipo_usuario
            },
            token
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const data = loginSchema.parse(req.body);

        // Find user
        const result = await query(
            'SELECT id, nome_completo, email, senha_hash, tipo_usuario, ativo FROM usuarios WHERE email = $1',
            [data.email]
        );

        if (result.rows.length === 0) {
            throw new AppError(401, 'Invalid credentials');
        }

        const user = result.rows[0];

        if (!user.ativo) {
            throw new AppError(403, 'Account disabled');
        }

        // Verify password
        const isValid = await bcrypt.compare(data.senha, user.senha_hash);

        if (!isValid) {
            throw new AppError(401, 'Invalid credentials');
        }

        // Update last access
        await query('UPDATE usuarios SET data_ultimo_acesso = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email, tipo: user.tipo_usuario },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                nome_completo: user.nome_completo,
                email: user.email,
                tipo_usuario: user.tipo_usuario
            },
            token
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
    try {
        const result = await query(
            `SELECT id, nome_completo, email, telefone, linkedin, github, portfolio_url, 
              biografia, foto_perfil_url, tipo_usuario, data_cadastro
       FROM usuarios WHERE id = $1`,
            [req.userId]
        );

        if (result.rows.length === 0) {
            throw new AppError(404, 'User not found');
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

export default router;

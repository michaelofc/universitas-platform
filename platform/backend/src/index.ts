import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import ciclosRoutes from './routes/ciclos.routes';
import modulosRoutes from './routes/modulos.routes';
import progressoRoutes from './routes/progresso.routes';
import entregasRoutes from './routes/entregas.routes';
import iaRoutes from './routes/ia.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'UNIVERSITAS API'
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ciclos', ciclosRoutes);
app.use('/api/modulos', modulosRoutes);
app.use('/api/progresso', progressoRoutes);
app.use('/api/entregas', entregasRoutes);
app.use('/api/ia', iaRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🎓 UNIVERSITAS API running on port ${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;

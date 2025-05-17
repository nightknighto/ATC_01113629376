import { Router } from 'express';
import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';
import docsRouter from './docs.routes';
import eventsRoutes from './events.routes';

const mainRouter = Router();

mainRouter.use('/auth', authRoutes);
mainRouter.use('/events', eventsRoutes);
mainRouter.use('/admin', adminRoutes);
mainRouter.use('/docs', docsRouter);

// Health check route
mainRouter.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default mainRouter;

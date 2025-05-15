import express from 'express';
import { AdminEventsController } from '../controllers/admin-events.controller';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/requireAdmin';

const adminEventsRouter = express.Router();

// All routes require authentication and admin role
adminEventsRouter.use(authenticate, requireAdmin);

// Get all events (admin)
adminEventsRouter.get('/events', AdminEventsController.getAll);
// Create event
adminEventsRouter.post('/events', AdminEventsController.create);
// Update event
adminEventsRouter.put('/events/:id', AdminEventsController.update);
// Delete event
adminEventsRouter.delete('/events/:id', AdminEventsController.remove);

export default adminEventsRouter;

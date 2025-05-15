import express from 'express';
import { EventsController } from '../controllers/events.controller';

const eventsRouter = express.Router();

// Get all events
eventsRouter.get('/', EventsController.getAllEvents);

// Get event by ID
eventsRouter.get('/:id', EventsController.getEventById);

// Create a new event
eventsRouter.post('/', EventsController.createEvent);

// Update an event
eventsRouter.put('/:id', EventsController.updateEvent);

// Delete an event
eventsRouter.delete('/:id', EventsController.deleteEvent);

// Register for an event
eventsRouter.post('/:id/register', EventsController.registerForEvent);

// Cancel registration for an event
eventsRouter.delete('/:eventId/register/:userId', EventsController.cancelRegistration);

export default eventsRouter;
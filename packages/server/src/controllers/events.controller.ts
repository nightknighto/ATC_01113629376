import { Request, Response } from 'express';
import { GetAllEventsResponse, GetEventByIdResponse, CreateEventRequest, CreateEventResponse, UpdateEventRequest, UpdateEventResponse, RegisterForEventRequest, RegisterForEventResponse, CancelRegistrationResponse, ApiError } from '@events-platform/shared';
import { EventModel } from '../models/event.model';
import { RegistrationModel } from '../models/registration.model';

export namespace EventsController {
    export const getAllEvents = async (req: Request, res: Response<GetAllEventsResponse | ApiError>) => {
        try {
            const events = await EventModel.findAllWithDetails();
            res.json(events);
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    };

    export const getEventById = async (req: Request<{ id: string }>, res: Response<GetEventByIdResponse | ApiError>) => {
        try {
            const { id } = req.params;
            const event = await EventModel.findByIdWithDetails(id);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.json(event);
        } catch (error) {
            console.error('Error fetching event:', error);
            res.status(500).json({ error: 'Failed to fetch event' });
        }
    };

    export const createEvent = async (req: Request<{}, CreateEventResponse, CreateEventRequest>, res: Response<CreateEventResponse | ApiError>) => {
        try {
            const { title, date, description, location } = req.body;
            const event = await EventModel.createWithOrganizer({
                title,
                description,
                date: new Date(date),
                location,
                organizerId: req.user!.id,
            });
            res.status(201).json(event);
        } catch (error) {
            console.error('Error creating event:', error);
            res.status(400).json({ error: 'Failed to create event' });
        }
    };

    export const updateEvent = async (req: Request<{ id: string }, UpdateEventResponse, UpdateEventRequest>, res: Response<UpdateEventResponse | ApiError>) => {
        try {
            const { id } = req.params;
            const { date, description, location, title } = req.body;
            const event = await EventModel.updateWithOrganizer(id, {
                title,
                description,
                date: date,
                location,
            });
            res.json(event);
        } catch (error) {
            console.error('Error updating event:', error);
            res.status(400).json({ error: 'Failed to update event' });
        }
    };

    export const deleteEvent = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;
            await RegistrationModel.deleteMany({ eventId: id });
            await EventModel.deleteById(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting event:', error);
            res.status(500).json({ error: 'Failed to delete event' });
        }
    };

    export const registerForEvent = async (req: Request<{ id: string }, RegisterForEventResponse, RegisterForEventRequest>, res: Response<RegisterForEventResponse | ApiError>) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const registration = await RegistrationModel.createWithDetails({
                eventId: id,
                userId,
            });
            res.status(201).json({
                success: true
            });
        } catch (error) {
            console.error('Error registering for event:', error);
            res.status(400).json({ error: 'Failed to register for event' });
        }
    };

    export const cancelRegistration = async (req: Request<{ eventId: string; userId: string }>, res: Response<CancelRegistrationResponse | ApiError>) => {
        try {
            const { eventId, userId } = req.params;
            await RegistrationModel.deleteByCompositeKey(eventId, userId);
            res.status(204).send();
        } catch (error) {
            console.error('Error cancelling registration:', error);
            res.status(400).json({ error: 'Failed to cancel registration' });
        }
    };
}
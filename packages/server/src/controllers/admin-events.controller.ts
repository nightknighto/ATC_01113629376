import { Request, Response } from 'express';
import { AdminCreateEventRequest, AdminCreateEventResponse, AdminUpdateEventRequest, AdminUpdateEventResponse, AdminGetAllEventsResponse, AdminDeleteEventResponse, ApiError } from '@events-platform/shared';
import { EventModel } from '../models/event.model';

export namespace AdminEventsController {
    export const getAll = async (req: Request, res: Response<AdminGetAllEventsResponse | ApiError>) => {
        try {
            const events = await EventModel.findAllWithDetails();
            res.json(events);
        } catch (error) {
            console.error('AdminEventsController.getAll error:', error);
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    };

    export const create = async (req: Request<{}, AdminCreateEventResponse, AdminCreateEventRequest>, res: Response<AdminCreateEventResponse | ApiError>) => {
        try {
            const data = req.body;
            const eventDate = new Date(data.date);
            if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
                return res.status(400).json({ error: 'Event date must be in the future.' });
            }
            // Convert date to ISO string if needed
            const event = await EventModel.createWithOrganizer({
                ...data,
                date: eventDate,
                organizerId: req.user!.id,
            });
            res.status(201).json(event);
        } catch (error) {
            console.error('AdminEventsController.create error:', error);
            res.status(400).json({ error: 'Failed to create event' });
        }
    };

    export const update = async (req: Request<{ id: string }, AdminUpdateEventResponse, AdminUpdateEventRequest>, res: Response<AdminUpdateEventResponse | ApiError>) => {
        try {
            const { id } = req.params;
            const data = req.body;
            if (data.date) {
                const eventDate = new Date(data.date);
                if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
                    return res.status(400).json({ error: 'Event date must be in the future.' });
                }
            }
            const event = await EventModel.updateWithOrganizer(id, {
                ...data,
                date: data.date
            });
            res.json(event);
        } catch (error) {
            console.error('AdminEventsController.update error:', error);
            res.status(400).json({ error: 'Failed to update event' });
        }
    };

    export const remove = async (req: Request<{ id: string }>, res: Response<AdminDeleteEventResponse | ApiError>) => {
        try {
            const { id } = req.params;
            await EventModel.deleteById(id);
            res.json({ success: true });
        } catch (error) {
            console.error('AdminEventsController.remove error:', error);
            res.status(400).json({ error: 'Failed to delete event' });
        }
    };
}

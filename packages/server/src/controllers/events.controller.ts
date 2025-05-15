import { Request, Response } from 'express';
import { prisma } from '../index';
import { EventSchema } from '@events-platform/shared';

export namespace EventsController {
    export const getAllEvents = async (req: Request, res: Response) => {
        try {
            const events = await prisma.event.findMany({
                include: {
                    organizer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: { registrations: true },
                    },
                },
            });
            res.json(events);
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    };

    export const getEventById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const event = await prisma.event.findUnique({
                where: { id },
                include: {
                    organizer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    registrations: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.json(event);
        } catch (error) {
            console.error('Error fetching event:', error);
            res.status(500).json({ error: 'Failed to fetch event' });
        }
    };

    export const createEvent = async (req: Request, res: Response) => {
        try {
            const validatedData = EventSchema.parse(req.body);
            const event = await prisma.event.create({
                data: {
                    title: validatedData.title,
                    description: validatedData.description,
                    date: new Date(validatedData.date),
                    location: validatedData.location,
                    organizerId: validatedData.organizerId,
                },
                include: {
                    organizer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            res.status(201).json(event);
        } catch (error) {
            console.error('Error creating event:', error);
            res.status(400).json({ error: 'Failed to create event' });
        }
    };

    export const updateEvent = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const validatedData = EventSchema.parse(req.body);
            const event = await prisma.event.update({
                where: { id },
                data: {
                    title: validatedData.title,
                    description: validatedData.description,
                    date: new Date(validatedData.date),
                    location: validatedData.location,
                },
                include: {
                    organizer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            res.json(event);
        } catch (error) {
            console.error('Error updating event:', error);
            res.status(400).json({ error: 'Failed to update event' });
        }
    };

    export const deleteEvent = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await prisma.registration.deleteMany({
                where: { eventId: id },
            });
            await prisma.event.delete({
                where: { id },
            });
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting event:', error);
            res.status(500).json({ error: 'Failed to delete event' });
        }
    };

    export const registerForEvent = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const registration = await prisma.registration.create({
                data: {
                    eventId: id,
                    userId,
                },
                include: {
                    event: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            res.status(201).json(registration);
        } catch (error) {
            console.error('Error registering for event:', error);
            res.status(400).json({ error: 'Failed to register for event' });
        }
    };

    export const cancelRegistration = async (req: Request, res: Response) => {
        try {
            const { eventId, userId } = req.params;
            await prisma.registration.delete({
                where: {
                    eventId_userId: {
                        eventId,
                        userId,
                    },
                },
            });
            res.status(204).send();
        } catch (error) {
            console.error('Error cancelling registration:', error);
            res.status(400).json({ error: 'Failed to cancel registration' });
        }
    };
}
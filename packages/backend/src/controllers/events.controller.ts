import type {
    ApiError,
    CancelRegistrationResponse,
    GetAllEventsResponse,
    GetEventByIdResponse,
    RegisterForEventResponse,
} from '@events-platform/shared';
import type { Request, Response } from 'express';
import { EventModel } from '../models/event.model';
import { RegistrationModel } from '../models/registration.model';

export namespace EventsController {
    export const getAllEvents = async (
        req: Request,
        res: Response<GetAllEventsResponse | ApiError>,
    ) => {
        try {
            const page = Number.parseInt(req.query.page as string) || 1;
            const limit = Number.parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;
            const search = req.query.search as string | undefined;
            const [events, total] = await Promise.all([
                EventModel.findAllWithDetails({ skip, take: limit, search }),
                EventModel.countAll(search),
            ]);
            const userId = req.user?.id;
            const mappedEvents = await Promise.all(
                events.map(async (event) => {
                    let isRegistered = false;
                    if (userId) {
                        const registration = await RegistrationModel.findFirst({
                            eventId: event.id,
                            userId,
                        });
                        isRegistered = !!registration;
                    }
                    return {
                        ...event,
                        registrationCount: event._count.registrations,
                        isRegistered,
                        _count: undefined,
                    };
                }),
            );
            res.json({
                data: mappedEvents,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    };

    export const getEventById = async (
        req: Request<{ id: string }>,
        res: Response<GetEventByIdResponse | ApiError>,
    ) => {
        try {
            const { id } = req.params;
            const event = await EventModel.findByIdWithDetails(id);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            const userId = req.user?.id;
            let isRegistered = false;
            if (userId) {
                const registration = await RegistrationModel.findFirst({
                    eventId: event.id,
                    userId,
                });
                isRegistered = !!registration;
            }
            const mappedEvent = {
                ...event,
                registrationCount: event._count.registrations,
                isRegistered,
                _count: undefined,
            };
            res.json(mappedEvent);
        } catch (error) {
            console.error('Error fetching event:', error);
            res.status(500).json({ error: 'Failed to fetch event' });
        }
    };

    export const getEventRegistrations = async (req: Request<{ id: string }>, res: Response) => {
        try {
            const page = Number.parseInt(req.query.page as string) || 1;
            const limit = Number.parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;
            const [registrations, total] = await Promise.all([
                RegistrationModel.findByEventIdWithUser(req.params.id, {
                    skip,
                    take: limit,
                }),
                RegistrationModel.countByEventId(req.params.id),
            ]);
            res.json({
                data: registrations,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            console.error('Error fetching registrations:', error);
            res.status(500).json({ error: 'Failed to fetch registrations' });
        }
    };

    export const registerForEvent = async (
        req: Request<{ id: string }>,
        res: Response<RegisterForEventResponse | ApiError>,
    ) => {
        try {
            const { id } = req.params;

            const userId = req.user!.id; // Assuming user ID is available in request context

            await RegistrationModel.createWithDetails({
                eventId: id,
                userId,
            });

            res.status(201).json({
                success: true,
            });
        } catch (error) {
            console.error('Error registering for event:', error);
            res.status(400).json({ error: 'Failed to register for event' });
        }
    };

    export const cancelRegistration = async (
        req: Request<{ id: string }>,
        res: Response<CancelRegistrationResponse | ApiError>,
    ) => {
        try {
            const { id } = req.params;

            const userId = req.user!.id; // Assuming user ID is available in request context

            await RegistrationModel.deleteByCompositeKey(id, userId);
            res.status(204).send();
        } catch (error) {
            console.error('Error cancelling registration:', error);
            res.status(400).json({ error: 'Failed to cancel registration' });
        }
    };
}

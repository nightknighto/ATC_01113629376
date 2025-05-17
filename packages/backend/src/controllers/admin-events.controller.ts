import { Request, Response } from 'express';
import { AdminCreateEventRequest, AdminCreateEventResponse, AdminUpdateEventRequest, AdminUpdateEventResponse, AdminGetAllEventsResponse, AdminDeleteEventResponse, ApiError } from '@events-platform/shared';
import { EventModel } from '../models/event.model';
import { MulterService } from '../services/multer.service';
import { AzureService } from '../services/azure.service';
import { CONFIG } from '../config';

export namespace AdminEventsController {
    export const getAllEvents = async (req: Request, res: Response<AdminGetAllEventsResponse | ApiError>) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;
            const search = req.query.search as string | undefined;
            const [events, total] = await Promise.all([
                EventModel.findAllWithDetails({ skip, take: limit, search }),
                EventModel.countAll(search)
            ]);
            // Map registration count to registrationCount property
            const mapped = events.map(e => ({
                ...e,
                registrationCount: e._count.registrations,
            }));
            res.json({
                data: mapped,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('AdminEventsController.getAll error:', error);
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    };

    // Create event (JSON, no image)
    export const createEvent = async (req: Request<{}, AdminCreateEventResponse, AdminCreateEventRequest>, res: Response<AdminCreateEventResponse | ApiError>) => {
        try {
            const data = req.body;
            const eventDate = new Date(data.date);
            if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
                return res.status(400).json({ error: 'Event date must be in the future.' });
            }
            const event = await EventModel.createWithOrganizer({
                ...data,
                date: eventDate,
                organizerId: req.user!.id,
                image: '', // No image yet
            });
            // Fetch the created event with organizer
            const updated = await EventModel.findByIdWithDetails(event.id);
            if (!updated) return res.status(500).json({ error: 'Failed to fetch created event' });
            const result = {
                ...updated,
                registrationCount: updated._count.registrations,
            };
            res.status(201).json(result);
        } catch (error) {
            console.error('AdminEventsController.create error:', error);
            res.status(400).json({ error: 'Failed to create event' });
        }
    };

    // Upload event image (multipart/form-data, for existing event)
    export const uploadEventImage = [
        MulterService.upload.single('image'),
        async (req: Request<{ id: string }>, res: Response) => {
            try {
                const { id } = req.params;
                if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });
                const file = req.file;
                const containerName = CONFIG.azure.azureContainerName;
                if (!containerName) {
                    return res.status(500).json({ error: 'Azure container name not configured' });
                }
                const blobName = `${id}.png`;
                const containerClient = AzureService.getContainerClient(containerName);
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                await blockBlobClient.uploadData(file.buffer, {
                    blobHTTPHeaders: { blobContentType: file.mimetype },
                });
                const imageUrl = blockBlobClient.url;
                await EventModel.updateWithOrganizer(id, { image: imageUrl });
                res.json({ image: imageUrl });
            } catch (error) {
                console.error('AdminEventsController.uploadEventImage error:', error);
                res.status(400).json({ error: 'Failed to upload image' });
            }
        }
    ];

    export const updateEvent = async (req: Request<{ id: string }, AdminUpdateEventResponse, AdminUpdateEventRequest>, res: Response<AdminUpdateEventResponse | ApiError>) => {
        try {
            const { id } = req.params;
            const data = req.body;
            // Always convert date to Date object if present
            let updateData = { ...data, date: data.date ? new Date(data.date) : undefined };
            if (updateData.date) {
                const eventDate = updateData.date;
                if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
                    return res.status(400).json({ error: 'Event date must be in the future.' });
                }
            }
            const event = await EventModel.updateWithOrganizer(id, updateData);
            // Add registrationCount
            const full = await EventModel.findByIdWithDetails(id);
            if (!full) return res.status(500).json({ error: 'Failed to fetch updated event' });
            const result = {
                ...full,
                registrationCount: full._count.registrations,
            };
            res.json(result);
        } catch (error) {
            console.error('AdminEventsController.update error:', error);
            res.status(400).json({ error: 'Failed to update event' });
        }
    };

    export const deleteEvent = async (req: Request<{ id: string }>, res: Response<AdminDeleteEventResponse | ApiError>) => {
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

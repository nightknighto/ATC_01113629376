import { EventModel } from '../../src/models/event.model';
import { UserModel } from '../../src/models/user.model';
import { prisma } from '../../src/prisma';

describe('EventModel', () => {
    let organizerId: string;
    let eventId: string;
    const dummyUser = {
        name: 'Event Organizer',
        email: 'organizer@example.com',
        password: 'hashedpassword',
    };
    const dummyEvent = {
        name: 'Test Event',
        description: 'A test event',
        category: 'Test',
        date: new Date(),
        venue: 'Test Venue',
        price: 10.0,
        image: 'test.jpg',
    };

    beforeAll(async () => {
        await prisma.registration.deleteMany({});
        await prisma.event.deleteMany({});
        await prisma.user.deleteMany({});
        const user = await UserModel.create(dummyUser);
        organizerId = user.id;
    });

    afterAll(async () => {
        await prisma.registration.deleteMany({});
        await prisma.event.deleteMany({});
        await prisma.user.deleteMany({});
        await prisma.$disconnect();
    });

    it('should create an event with organizer', async () => {
        const event = await EventModel.createWithOrganizer({ ...dummyEvent, organizerId });
        expect(event).toHaveProperty('id');
        expect(event.organizer.id).toBe(organizerId);
        eventId = event.id;
    });

    it('should find all events with details', async () => {
        const events = await EventModel.findAllWithDetails();
        expect(Array.isArray(events)).toBe(true);
        expect(events.length).toBeGreaterThan(0);
    });

    it('should find event by id with details', async () => {
        const event = await EventModel.findByIdWithDetails(eventId);
        expect(event).not.toBeNull();
        expect(event!.id).toBe(eventId);
    });

    it('should update an event', async () => {
        const updated = await EventModel.updateWithOrganizer(eventId, { name: 'Updated Event' });
        expect(updated.name).toBe('Updated Event');
    });

    it('should delete event by id', async () => {
        const deleted = await EventModel.deleteById(eventId);
        expect(deleted).toHaveProperty('id', eventId);
        const event = await EventModel.findByIdWithDetails(eventId);
        expect(event).toBeNull();
    });
});

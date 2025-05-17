import request from 'supertest';
import app from '../../src/index';
import { prisma } from '../../src/prisma';
import { PasswordService } from '../../src/services/password.service';

describe('Events API', () => {
    let user: any;
    let token: string;
    let event: any;

    beforeAll(async () => {
        await prisma.registration.deleteMany({});
        await prisma.event.deleteMany({});
        await prisma.user.deleteMany({});
        user = await prisma.user.create({
            data: {
                name: 'Event User',
                email: 'eventuser@example.com',
                password: await PasswordService.hashPassword('eventpass'),
            },
        });
        event = await prisma.event.create({
            data: {
                name: 'Test Event',
                description: 'A test event',
                category: 'Test',
                date: new Date(),
                venue: 'Test Venue',
                price: 10.0,
                image: 'test.jpg',
                organizerId: user.id,
            },
        });
        // Get JWT token
        const res = await request(app)
            .post('/auth/login')
            .send({ email: user.email, password: 'eventpass' });
        token = res.body.token;
    });

    afterAll(async () => {
        await prisma.registration.deleteMany({});
        await prisma.event.deleteMany({});
        await prisma.user.deleteMany({});
        await prisma.$disconnect();
    });

    it('GET /events should return a list of events', async () => {
        const res = await request(app).get('/events');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /events/:id should return event details', async () => {
        const res = await request(app).get(`/events/${event.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', event.id);
    });

    it('GET /events/:id with invalid id should return 404', async () => {
        const res = await request(app).get('/events/invalid-id');
        expect([400, 404]).toContain(res.statusCode);
    });

    it('POST /events/:id/register should require auth', async () => {
        const res = await request(app).post(`/events/${event.id}/register`);
        expect(res.statusCode).toBe(401);
    });

    it('POST /events/:id/register should register user', async () => {
        const res = await request(app)
            .post(`/events/${event.id}/register`)
            .set('Authorization', `Bearer ${token}`);
        expect([200, 201]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('eventId', event.id);
    });

    it('POST /events/:id/register should not allow double registration', async () => {
        const res = await request(app)
            .post(`/events/${event.id}/register`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});

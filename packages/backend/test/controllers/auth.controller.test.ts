import request from 'supertest';
import app from '../../src/index';
import { PasswordService } from '../../src/services/password.service';
import { prisma } from '../../src/prisma';

describe('Auth API', () => {
    const user = {
        name: 'Test User',
        email: 'authuser@example.com',
        password: 'TestPassword123',
    };
    let userId: string;

    beforeAll(async () => {
        await prisma.registration.deleteMany({});
        await prisma.event.deleteMany({});
        await prisma.user.deleteMany({});
        const hashed = await PasswordService.hashPassword(user.password);
        const created = await prisma.user.create({
            data: { ...user, password: hashed },
        });
        userId = created.id;
    });

    afterAll(async () => {
        await prisma.registration.deleteMany({});
        await prisma.event.deleteMany({});
        await prisma.user.deleteMany({});
        await prisma.$disconnect();
    });

    it('POST /auth/login with valid credentials should succeed', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: user.email, password: user.password });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
    });

    it('POST /auth/login with invalid credentials should fail', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: user.email, password: 'wrongpass' });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /auth/login with missing fields should fail validation', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: user.email });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /auth/login with invalid email format should fail validation', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'notanemail', password: user.password });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});

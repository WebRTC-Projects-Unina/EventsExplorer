import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
import supertest from 'supertest';

const chai = use(chaiHttp);


const api = supertest(app);

describe('Event API', () => {
    let adminToken;
    let userToken;
    let eventId;

    // Helper to authenticate and retrieve tokens for admin and user
    before(async () => {
        // Login as admin
        const adminLogin = await api.post('/api/login')
            .send({ username: 'admin', password: 'adminpass' });
        adminToken = adminLogin.body.token;

        // Login as normal user
        const userLogin = await api.post('/api/login')
            .send({ username: 'user', password: 'userpass' });
        userToken = userLogin.body.token;
    });

    describe('Admin Authorization', () => {
        it('should allow admin to create an event', async () => {
            const res = await api.post('/api/events')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Tech Conference',
                    date: '2024-12-01',
                    location: 'Berlin',
                    description: 'Annual tech event'
                });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('id');
            expect(res.body.name).to.equal('Tech Conference');
            eventId = res.body.id; // Save event ID for later tests
        });

        it('should allow admin to update an event', async () => {
            const res = await api.put(`/api/events/${eventId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated Tech Conference' });

            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal('Updated Tech Conference');
        });

        it('should allow admin to delete an event', async () => {
            const res = await api.delete(`/api/events/${eventId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).to.equal(204);
        });
    });

    describe('User Authorization', () => {
        it('should prevent normal user from creating an event', async () => {
            const res = await api.post('/api/events')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Unauthorized Event',
                    date: '2024-12-01',
                    location: 'Unknown',
                    description: 'Should not be created'
                });

            expect(res.status).to.equal(403);
            expect(res.body.error).to.equal('Access denied');
        });

        it('should prevent normal user from updating an event', async () => {
            const res = await api.put(`/api/events/${eventId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Unauthorized Update' });

            expect(res.status).to.equal(403);
            expect(res.body.error).to.equal('Access denied');
        });

        it('should prevent normal user from deleting an event', async () => {
            const res = await api.delete(`/api/events/${eventId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).to.equal(403);
            expect(res.body.error).to.equal('Access denied');
        });
    });

    describe('Event Access for All Authenticated Users', () => {
        // Create a new event by admin for read-only tests
        before(async () => {
            const res = await api.post('/api/events')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Public Event',
                    date: '2024-12-05',
                    location: 'Public Hall',
                    description: 'Event accessible to all users'
                });
            eventId = res.body.id; // Save event ID for access tests
        });

        it('should allow both admin,user and anonymous to view all events', async () => {
            const adminRes = await api.get('/api/events')
                .set('Authorization', `Bearer ${adminToken}`);
            const userRes = await api.get('/api/events')
                .set('Authorization', `Bearer ${userToken}`);
            const anonRes = await api.get('/api/events');

            expect(adminRes.status).to.equal(200);
            expect(userRes.status).to.equal(200);
            expect(anonRes.status).to.equal(200);

            expect(adminRes.body).to.be.an('array');
            expect(userRes.body).to.be.an('array');
            expect(anonRes.body).to.be.an('array');

        });

        it('should allow both admin, user and anonymous to view a specific event', async () => {
            const adminRes = await api.get(`/api/events/${eventId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            const userRes = await api.get(`/api/events/${eventId}`)
                .set('Authorization', `Bearer ${userToken}`);
            const anonRes = await api.get(`/api/events/${eventId}`);

            expect(adminRes.status).to.equal(200);
            expect(userRes.status).to.equal(200);
            expect(anonRes.status).to.equal(200);

            expect(adminRes.body.name).to.equal('Public Event');
            expect(userRes.body.name).to.equal('Public Event');
            expect(anonRes.body.name).to.equal('Public Event');

        });
    });
});

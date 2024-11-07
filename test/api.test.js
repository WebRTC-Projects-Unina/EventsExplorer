import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
import supertest from 'supertest';
import db from '../database.js';

const chai = use(chaiHttp);
const api = supertest(app);


describe('Event API with Many-to-Many Tags', () => {
    let adminToken;
    let userToken;
    let eventId1, eventId2, eventId;

    before(async () => {
        db.exec('DELETE FROM events; DELETE FROM tags; DELETE FROM event_tags;');

        const adminLogin = await api.post('/api/login').send({ username: 'admin', password: 'adminpass' });
        adminToken = adminLogin.body.token;

        const userLogin = await api.post('/api/login').send({ username: 'user', password: 'userpass' });
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

    it('should allow admin to create multiple events with shared tags', async () => {
        const techTag = { name: 'Tech' };
        const confTag = { name: 'Conference' };

        const event1 = await api.post('/api/events')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Tech Conference 1',
                date: '2024-12-01',
                location: 'Berlin',
                description: 'Annual tech event 1',
                tags: [techTag, confTag]
            });

        const event2 = await api.post('/api/events')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Tech Conference 2',
                date: '2024-12-02',
                location: 'Paris',
                description: 'Annual tech event 2',
                tags: [techTag]
            });

        eventId1 = event1.body.id;
        eventId2 = event2.body.id;

        expect(event1.status).to.equal(201);
        expect(event1.body.tags).to.have.lengthOf(2);
        expect(event2.status).to.equal(201);
        expect(event2.body.tags).to.have.lengthOf(1);
    });

    it('should retrieve events with shared tags', async () => {
        const res = await api.get(`/api/events`).set('Authorization', `Bearer ${userToken}`);

        expect(res.status).to.equal(200);
        const event1 = res.body.find(e => e.id === eventId1);
        const event2 = res.body.find(e => e.id === eventId2);

        expect(event1.tags.some(tag => tag.name === 'Tech')).to.be.true;
        expect(event2.tags.some(tag => tag.name === 'Tech')).to.be.true;
        expect(event1.tags.some(tag => tag.name === 'Conference')).to.be.true;
    });
});

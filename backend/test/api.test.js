import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';
import supertest from 'supertest';
import db from '../database.js';

const chai = use(chaiHttp);
const api = supertest(app);



describe('Event API', () => {
    let adminToken, userToken, eventId, locationId;

    before(async () => {
        db.exec('DELETE FROM events; DELETE FROM tags; DELETE FROM event_tags; DELETE FROM locations;');

        const adminLogin = await api.post('/api/login').send({ username: 'admin', password: 'adminpass' });
        adminToken = adminLogin.body.token;

        const userLogin = await api.post('/api/login').send({ username: 'user', password: 'userpass' });
        userToken = userLogin.body.token;
    });

    beforeEach(async () => {
        // Create a new location for testing
        const locationRes = await api
            .post('/api/locations')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Berlin', latitude: 52.52, longitude: 13.405, website: 'https://visitberlin.de' });
        locationId = locationRes.body.id;

        // Create a new event for testing
        const eventRes = await api
            .post('/api/events')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Tech Conference',
                date: '2024-12-01',
                locationId,
                description: 'Annual tech event',
                tags: [{ name: 'Technology' }]
            });
        eventId = eventRes.body.id;
    });

    describe('PUT /api/events/:id', () => {
        it('should allow admin to update event details successfully', async () => {
            const res = await api
                .put(`/api/events/${eventId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Updated Tech Conference',
                    date: '2024-12-10',
                    locationId,
                    description: 'Updated description',
                    tags: [{ name: 'Innovation' }, { name: 'Conference' }]
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('name', 'Updated Tech Conference');
            expect(res.body).to.have.property('date', '2024-12-10');
            expect(res.body).to.have.property('description', 'Updated description');
            expect(res.body.tags).to.deep.include.members([{ id: res.body.tags[0].id, name: 'Innovation' }, { id: res.body.tags[1].id, name: 'Conference' }]);
            expect(res.body.location).to.have.property('name', 'Berlin');
        });

        it('should return 404 if trying to update with a non-existent locationId', async () => {
            const res = await api
                .put(`/api/events/${eventId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ locationId: 9999 }); // Non-existent locationId

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', 'Location not found');
        });

        it('should allow partial updates and keep other fields unchanged', async () => {
            const res = await api
                .put(`/api/events/${eventId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Partially Updated Conference' });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('name', 'Partially Updated Conference');
            expect(res.body).to.have.property('date', '2024-12-01'); // Original date
            expect(res.body).to.have.property('description', 'Annual tech event'); // Original description
        });

        it('should update tags and replace old tags', async () => {
            const res = await api
                .put(`/api/events/${eventId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ tags: [{ name: 'Networking' }, { name: 'Tech' }] });

            expect(res.status).to.equal(200);
            expect(res.body.tags).to.deep.include.members([{ id: res.body.tags[0].id, name: 'Networking' }, { id: res.body.tags[1].id, name: 'Tech' }]);
            expect(res.body.tags).to.not.deep.include.members([{ name: 'Technology' }]); // Original tag should be removed
        });

        it('should not allow non-admin user to update the event', async () => {
            const res = await api
                .put(`/api/events/${eventId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Non-admin update attempt' });

            expect(res.status).to.equal(403);
            expect(res.body).to.have.property('error', 'Access denied');
        });
    });
});

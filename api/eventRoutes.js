// eventRoutes.js
import express from 'express';
import db from '../database.js';
import { authenticateToken, authorizeAdmin } from '../authorization.js';

const eventRouter = express.Router();

// Helper function for managing tags
function manageTags(tags, eventId) {
    const getTag = db.prepare('SELECT id FROM tags WHERE name = ?');
    const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
    const linkTagToEvent = db.prepare('INSERT OR IGNORE INTO event_tags (eventId, tagId) VALUES (?, ?)');

    tags.forEach(tag => {
        insertTag.run(tag.name);
        const tagId = getTag.get(tag.name).id;
        linkTagToEvent.run(eventId, tagId);
    });
}

// Create event
eventRouter.post('/', authenticateToken, authorizeAdmin, (req, res) => {
    const { name, date, locationId, description, tags } = req.body;
    if (!name || !date || !locationId) {
        return res.status(400).json({ error: 'Name, date, and locationId are required' });
    }

    const locationExists = db.prepare('SELECT * FROM locations WHERE id = ?').get(locationId);
    if (!locationExists) return res.status(404).json({ error: 'Location not found' });

    const event = db.prepare('INSERT INTO events (name, date, locationId, description) VALUES (?, ?, ?, ?)').run(name, date, locationId, description);
    if (tags) manageTags(tags, event.lastInsertRowid);

    res.status(201).json({ id: event.lastInsertRowid, name, date, locationId, description, tags: tags || [] });
});

// Get all events with locations and tags
eventRouter.get('/', (req, res) => {
    const events = db.prepare(`
    SELECT e.id, e.name, e.date, e.description, e.locationId,
           COALESCE(json_group_array(json_object('id', t.id, 'name', t.name)), '[]') as tags,
           json_object('id', l.id, 'name', l.name, 'latitude', l.latitude, 'longitude', l.longitude, 'website', l.website) as location
    FROM events e
    LEFT JOIN event_tags et ON e.id = et.eventId
    LEFT JOIN tags t ON et.tagId = t.id
    LEFT JOIN locations l ON e.locationId = l.id
    GROUP BY e.id
  `).all();

    res.json(events.map(event => ({
        ...event,
        tags: JSON.parse(event.tags),
        location: JSON.parse(event.location)
    })));
});

// Get single event by ID with tags and location
eventRouter.get('/:id', (req, res) => {
    const event = db.prepare(`
    SELECT e.id, e.name, e.date, e.description, e.locationId,
           COALESCE(json_group_array(json_object('id', t.id, 'name', t.name)), '[]') as tags,
           json_object('id', l.id, 'name', l.name, 'latitude', l.latitude, 'longitude', l.longitude, 'website', l.website) as location
    FROM events e
    LEFT JOIN event_tags et ON e.id = et.eventId
    LEFT JOIN tags t ON et.tagId = t.id
    LEFT JOIN locations l ON e.locationId = l.id
    WHERE e.id = ?
    GROUP BY e.id
  `).get(req.params.id);

    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({
        ...event,
        tags: JSON.parse(event.tags),
        location: JSON.parse(event.location)
    });
});

eventRouter.delete('/:id', authenticateToken, authorizeAdmin, (req, res) => {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
    res.status(204).end();
});
eventRouter.put('/:id', authenticateToken, authorizeAdmin, (req, res) => {
    const { name, date, locationId, description, tags } = req.body;

    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    // Check if the new locationId exists
    if (locationId) {
        const locationExists = db.prepare('SELECT * FROM locations WHERE id = ?').get(locationId);
        if (!locationExists) {
            return res.status(404).json({ error: 'Location not found' });
        }
    }

    // Update event details
    db.prepare(`
      UPDATE events SET name = ?, date = ?, locationId = ?, description = ?
      WHERE id = ?
    `).run(
        name || event.name,
        date || event.date,
        locationId || event.locationId,
        description || event.description,
        req.params.id
    );

    // Update tags if provided
    if (tags) {
        db.prepare('DELETE FROM event_tags WHERE eventId = ?').run(req.params.id);
        manageTags(tags, req.params.id);
    }

    // Fetch the updated event with tags and location
    const updatedEvent = db.prepare(`
      SELECT e.id, e.name, e.date, e.description, e.locationId,
             COALESCE(json_group_array(json_object('id', t.id, 'name', t.name)), '[]') as tags,
             json_object('id', l.id, 'name', l.name, 'latitude', l.latitude, 'longitude', l.longitude, 'website', l.website) as location
      FROM events e
      LEFT JOIN event_tags et ON e.id = et.eventId
      LEFT JOIN tags t ON et.tagId = t.id
      LEFT JOIN locations l ON e.locationId = l.id
      WHERE e.id = ?
      GROUP BY e.id
    `).get(req.params.id);

    res.json({
        ...updatedEvent,
        tags: JSON.parse(updatedEvent.tags),
        location: JSON.parse(updatedEvent.location)
    });
});

export default eventRouter;

import express from 'express';
import jwt from 'jsonwebtoken';
import db from './database.js';
import users from './models/user.js';

const app = express();
const port = 3000;
app.use(express.json());

const JWT_SECRET = 'your_secret_key';



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access token missing' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
}

// Helper function to manage tags
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

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate a token with the user's role
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Create event endpoint
app.post('/api/events', authenticateToken, authorizeAdmin, (req, res) => {
    const { name, date, location, description, tags } = req.body;
    if (!name || !date || !location) {
        return res.status(400).json({ error: 'Name, date, and location are required' });
    }

    const event = db.prepare('INSERT INTO events (name, date, location, description) VALUES (?, ?, ?, ?)').run(name, date, location, description);
    if (tags) manageTags(tags, event.lastInsertRowid);

    res.status(201).json({ id: event.lastInsertRowid, name, date, location, description, tags: tags || [] });
});

// Retrieve events with tags
app.get('/api/events', (req, res) => {
    const events = db.prepare(`
    SELECT e.id, e.name, e.date, e.location, e.description,
           COALESCE(json_group_array(json_object('id', t.id, 'name', t.name)), '[]') as tags
    FROM events e
    LEFT JOIN event_tags et ON e.id = et.eventId
    LEFT JOIN tags t ON et.tagId = t.id
    GROUP BY e.id
  `).all();

    res.json(events.map(event => ({ ...event, tags: JSON.parse(event.tags) })));
});

app.get('/api/events/:id', (req, res) => {
    const event = db.prepare(`
    SELECT e.id, e.name, e.date, e.location, e.description,
           COALESCE(json_group_array(json_object('id', t.id, 'name', t.name)), '[]') as tags
    FROM events e
    LEFT JOIN event_tags et ON e.id = et.eventId
    LEFT JOIN tags t ON et.tagId = t.id
    WHERE e.id = ?
    GROUP BY e.id
  `).get(req.params.id);

    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ ...event, tags: JSON.parse(event.tags) });
});

// Update event endpoint
app.put('/api/events/:id', authenticateToken, authorizeAdmin, (req, res) => {
    const { name, date, location, description, tags } = req.body;
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);

    if (!event) return res.status(404).json({ error: 'Event not found' });

    db.prepare('UPDATE events SET name = ?, date = ?, location = ?, description = ? WHERE id = ?')
        .run(name || event.name, date || event.date, location || event.location, description || event.description, req.params.id);

    if (tags) {
        db.prepare('DELETE FROM event_tags WHERE eventId = ?').run(req.params.id); // Clear old tag associations
        manageTags(tags, req.params.id);
    }

    const updatedEvent = db.prepare(`
    SELECT e.id, e.name, e.date, e.location, e.description,
           COALESCE(json_group_array(json_object('id', t.id, 'name', t.name)), '[]') as tags
    FROM events e
    LEFT JOIN event_tags et ON e.id = et.eventId
    LEFT JOIN tags t ON et.tagId = t.id
    WHERE e.id = ?
    GROUP BY e.id
  `).get(req.params.id);

    res.json({ ...updatedEvent, tags: JSON.parse(updatedEvent.tags) });
});

// Delete event endpoint
app.delete('/api/events/:id', authenticateToken, authorizeAdmin, (req, res) => {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
    res.status(204).end();
});

export default app;

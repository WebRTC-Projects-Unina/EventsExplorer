import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

app.use(express.json());

// Secret key for JWT (in a real app, store this securely)
const JWT_SECRET = 'your_secret_key';

// In-memory storage for events and users
let events = [];
let eventId = 1;

// Mock users (in a real application, store users securely in a database)
const users = [
    { id: 1, username: 'admin', password: 'adminpass', role: 'admin' },
    { id: 2, username: 'user', password: 'userpass', role: 'user' }
];

// Middleware to authenticate requests
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

// Middleware to check if the user is an admin
function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
}

// Login route to get a token
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

// Routes

// Create a new event (admin only)
app.post('/api/events', authenticateToken, authorizeAdmin, (req, res) => {
    const { name, date, location, description } = req.body;

    if (!name || !date || !location) {
        return res.status(400).json({ error: 'Name, date, and location are required' });
    }

    const newEvent = {
        id: eventId++,
        name,
        date,
        location,
        description
    };

    events.push(newEvent);
    res.status(201).json(newEvent);
});

// Read all events (open to all users)
app.get('/api/events', (req, res) => {
    res.json(events);
});

// Read a specific event by ID (open to all users)
app.get('/api/events/:id', (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);

    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
});

// Update an existing event by ID (admin only)
app.put('/api/events/:id', authenticateToken, authorizeAdmin, (req, res) => {
    const eventId = parseInt(req.params.id);
    const { name, date, location, description } = req.body;

    const event = events.find(e => e.id === eventId);

    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    if (name) event.name = name;
    if (date) event.date = date;
    if (location) event.location = location;
    if (description) event.description = description;

    res.json(event);
});

// Delete an event by ID (admin only)
app.delete('/api/events/:id', authenticateToken, authorizeAdmin, (req, res) => {
    const eventId = parseInt(req.params.id);
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
        return res.status(404).json({ error: 'Event not found' });
    }

    events.splice(eventIndex, 1);
    res.status(204).end();
});

// Start the server
app.listen(port, () => {
    console.log(`Event API server running at http://localhost:${port}`);
});

export default app;

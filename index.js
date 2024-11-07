// Import required modules
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// In-memory storage for events
let events = [
    {
        id: 1,
        name: "Birthday Party",
        date: "2024-11-20",
        location: "New York",
        description: "A fun birthday party"
    }];

// Event schema example:
// {
//   id: 1,
//   name: "Birthday Party",
//   date: "2024-11-20",
//   location: "New York",
//   description: "A fun birthday party"
// }

// Utility to generate unique IDs for each event
let eventId = 1;

// Create a new event
app.post('/api/events', (req, res) => {
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

// Read all events
app.get('/api/events', (req, res) => {
    res.json(events);
});

// Read a specific event by ID
app.get('/api/events/:id', (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);

    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
});

// Update an existing event by ID
app.put('/api/events/:id', (req, res) => {
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

// Delete an event by ID
app.delete('/api/events/:id', (req, res) => {
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

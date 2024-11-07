// locationRoutes.js
import express from 'express';
import db from '../database.js';
import { authenticateToken, authorizeAdmin } from '../authorization.js';

const locationRouter = express.Router();

// Create location
locationRouter.post('/', authenticateToken, authorizeAdmin, (req, res) => {
    const { name, latitude, longitude, website } = req.body;
    if (!name || latitude == null || longitude == null) {
        return res.status(400).json({ error: 'Name, latitude, and longitude are required' });
    }

    const location = db.prepare('INSERT INTO locations (name, latitude, longitude, website) VALUES (?, ?, ?, ?)').run(name, latitude, longitude, website);
    res.status(201).json({ id: location.lastInsertRowid, name, latitude, longitude, website });
});

// Get all locations
locationRouter.get('/', (req, res) => {
    const locations = db.prepare('SELECT * FROM locations').all();
    res.json(locations);
});

// Get single location by ID
locationRouter.get('/:id', (req, res) => {
    const location = db.prepare('SELECT * FROM locations WHERE id = ?').get(req.params.id);
    if (!location) return res.status(404).json({ error: 'Location not found' });
    res.json(location);
});

// Update location by ID
locationRouter.put('/:id', authenticateToken, authorizeAdmin, (req, res) => {
    const { name, latitude, longitude, website } = req.body;
    const location = db.prepare('SELECT * FROM locations WHERE id = ?').get(req.params.id);

    if (!location) return res.status(404).json({ error: 'Location not found' });

    db.prepare('UPDATE locations SET name = ?, latitude = ?, longitude = ?, website = ? WHERE id = ?')
        .run(name || location.name, latitude || location.latitude, longitude || location.longitude, website || location.website, req.params.id);

    const updatedLocation = db.prepare('SELECT * FROM locations WHERE id = ?').get(req.params.id);
    res.json(updatedLocation);
});

// Delete location by ID
locationRouter.delete('/:id', authenticateToken, authorizeAdmin, (req, res) => {
    const location = db.prepare('SELECT * FROM locations WHERE id = ?').get(req.params.id);
    if (!location) return res.status(404).json({ error: 'Location not found' });

    db.prepare('DELETE FROM locations WHERE id = ?').run(req.params.id);
    res.status(204).end();
});

export default locationRouter;

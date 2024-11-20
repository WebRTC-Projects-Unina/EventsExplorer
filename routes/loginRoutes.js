import users from '../models/user.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/authorization.js';

const loginRouter = express.Router();

loginRouter.post('/', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate a token with the user's role
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});
export default loginRouter;
import express from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/authorization.js';
import * as userRepository from '../repositories/user.repository.js';

const loginRouter = express.Router();

loginRouter.post('/', asyncHandler(async (req, res, next) => {

    const user = await userRepository.getUser(req.body);

    if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }
    // Generate a token with the user's role
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ username: user.username, token: token });
}));
export default loginRouter;
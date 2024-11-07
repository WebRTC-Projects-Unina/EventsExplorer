// server.js
import express from 'express';
import eventRouter from './api/eventRoutes.js';
import locationRouter from './api/locationRoutes.js';
import loginRouter from './api/loginRoutes.js';


const app = express();
const port = 3000;

app.use(express.json());


// Use routers for events and locations
app.use('/api/login', loginRouter);
app.use('/api/events', eventRouter);
app.use('/api/locations', locationRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export default app;

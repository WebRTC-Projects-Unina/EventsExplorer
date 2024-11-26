// server.js
import express from 'express';
import eventRouter from './routes/eventRoutes.js';
import locationRouter from './routes/locationRoutes.js';
import loginRouter from './routes/loginRoutes.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import log4js from 'log4js';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import dayjs from 'dayjs';
import paginate from 'express-paginate';
import sequelize from './database.js';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler.js';

const log = log4js.getLogger("entrypoint");
log.level = "info";

const app = express();
const port = 3000;

//Security, Compression & Parser
app.use(helmet());
app.use(hpp());
app.use(cors());
app.use(compression());
app.use(express.json());

// Paginate
app.use(paginate.middleware(10, 30));

//Error handler
app.use(errorHandler);

//Routes
// Use routers for events and locations
app.use('/api/login', loginRouter);
app.use('/api/events', eventRouter);
app.use('/api/locations', locationRouter);

// * Rolling Log
let layoutConfig = {
    type: "pattern",
    pattern: "%x{id}: [%x{info}] %p %c - %[%m%]",
    tokens: {
        id: () => {
            return Date.now();
        },
        info: (req) => {
            const info = dayjs().format("D/M/YYYY h:mm:ss A");
            return info;
        },
    },
};
log4js.configure({
    appenders: {
        app: {
            type: "dateFile",
            filename: "./logs/app.log",
            numBackups: 3,
            layout: layoutConfig,
            maxLogSize: 7000000, // byte == 3mb
        },
        console: {
            type: "console",
            layout: layoutConfig,
        },
    },
    categories: {
        default: { appenders: ["app", "console"], level: "debug" },
    },
});



app.listen(port, (err) => {
    if (err) {
        log.error('Error: ${err}');
        process.exit(1);
    }
    log.info(`Server running on http://localhost:${port}`);
});

export default app;

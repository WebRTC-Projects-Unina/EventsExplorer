// server.js
import express from 'express';
import eventRouter from './routes/eventRoutes.js';
import locationRouter from './routes/locationRoutes.js';
import loginRouter from './routes/loginRoutes.js';
import tagRouter from './routes/tagRoutes.js';
import log4js from 'log4js';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import dayjs from 'dayjs';
import paginate from 'express-paginate';
import { validate } from './middleware/requestValidator.js';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler.js';
import imageRouter from './routes/imageRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import subscribeRouter from './routes/subscribeRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const log = log4js.getLogger("entrypoint");
log.level = "info";

const app = express();
const port = 3000;

//Security, Compression & Parser
app.use(helmet());
app.use(hpp());
app.use(cors({ credentials: true, origin: '*' }));
app.use(compression());
app.use(express.json());

// Paginate
app.use(paginate.middleware(10, 30));

//Error handler
app.use(errorHandler);

//Routes
// Use routers for events and locations
app.use('/api/login', validate, loginRouter);
app.use('/api/events', validate, eventRouter);
app.use('/api/locations', validate, locationRouter);
app.use('/api/tags', validate, tagRouter);
app.use('/api/images', validate, imageRouter);
app.use('/images', (_, res, next) => {
    res.set('Cross-Origin-Resource-Policy', '*');
    next();
});
app.use('/images', express.static(path.join(__dirname, 'assets/images')));
app.use('/api/subscribe', validate, subscribeRouter);



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

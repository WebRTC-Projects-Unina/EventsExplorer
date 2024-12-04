import log4js from 'log4js';
import fs from 'fs';
import * as subscribeRepository from '../repositories/subscriber.repository.js';
import { sendNewsletter } from './newsletter.service.js';
const log = log4js.getLogger("service:Subscriber");
log.level = "debug";
const WELCOME_MESSAGE = "Welcome to the Newsletter";

function readFile() {
    return fs.readFile('../assets/newsletter/welcome.html', 'utf-8', (err, data) => {
        if (err) {
            log.error(err);
            return;
        }
        return data;
    });

}

async function createSubscribers(req, res, next) {

    const email = req.body.mail;

    try {
        const existingSubscriber = await subscribeRepository.getSubscriberPerMail(email);
        if (existingSubscriber) {
            return res.send('Email already subscribed. Check your email for the welcome newsletter.');
        }
        const newSubscriber = await subscribeRepository.addSubscriber(req.body);
        log.info(`New subscription: ${email}`);

        const welcomeContent = readFile();
        sendNewsletter(email, WELCOME_MESSAGE, welcomeContent);

        res.send('Subscription successful! Check your email for a welcome newsletter.');
    } catch (error) {
        log.error('Error creating subscription:', error);
        next(error);
    }
}

export { createSubscribers };
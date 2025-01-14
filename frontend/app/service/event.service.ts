import axios from 'axios';
import { Event, Location } from '../models/event';
const baseUrl = 'http://localhost:3000';
const eventUrl = '/api/events'




function getEvents() {
    // Invoking the get method to perform a GET request
    return axios.get<Event[]>(`${baseUrl}${eventUrl}`);
    // axios.get(`${baseUrl}${eventUrl}`).then((response) => {
    //     console.log(response.data);
    //     return response.data;
    // });
}

function getEventById(id: Number) {
    return axios.get<Event>(`${baseUrl}${eventUrl}/${id}`);
}

function updateEvent(event: Event) {
    return axios.put<Event>(`${baseUrl}${eventUrl}/${event.id}`, event);
}

function deleteEvent(id: Number) {

    return axios.delete(`${baseUrl}${eventUrl}/${id}`);
    // try {
    //     const response = await axios.delete(`${baseUrl}${eventUrl}/${id}`);
    //     console.log(`Event with ID: ${id} deleted from backend`, response.data);
    //     return response.data;
    // } catch (error) {
    //     console.error(`Error deleting event with ID: ${id}`, error);
    //     throw error;
    // }
}

export { getEvents, getEventById, updateEvent, deleteEvent };

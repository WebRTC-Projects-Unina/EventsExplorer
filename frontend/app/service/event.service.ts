import axios from 'axios';
import { Event } from '../models/event';
import Toast from 'react-native-toast-message';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const eventUrl = '/api/events';

// Request interceptor
axios.interceptors.request.use(
    (config) => {
        // TODO set bearer token      
        return config;
    },
    (error) => {
        Toast.show({
            type: 'error',
            text1: error.request?.data?.error
        });
        return Promise.reject(error);
    }
);

// Response interceptor
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Handle response errors


        Toast.show({
            type: 'error',
            text1: error.response?.status + ' ' + error.response?.data?.error
        });
        return Promise.reject(error);
    }
);

function getEvents() {
    return axios.get<Event[]>(`${API_URL}${eventUrl}`);
}

function getEventById(id: Number) {
    return axios.get<Event>(`${API_URL}${eventUrl}/${id}`);
}

function createEvent(event: Event) {
    return axios.post<Event>(`${API_URL}${eventUrl}`, event);
}

function updateEvent(event: Event) {
    return axios.put<Event>(`${API_URL}${eventUrl}/${event.id}`, event);
}

function deleteEvent(id: Number) {
    return axios.delete(`${API_URL}${eventUrl}/${id}`);
}

export { getEvents, getEventById, createEvent, updateEvent, deleteEvent };

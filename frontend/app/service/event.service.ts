import { Event } from '../models/event';
import useAxiosInterceptor from '@/app/hooks/useAuthInterceptor';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const eventUrl = '/api/events';
const EventService = () => {
    const { axios } = useAxiosInterceptor();

    const getEvents = (data: any) => {
        console.log(data);
        let searchQuery = "?";

        if (data.text != undefined) {
            searchQuery += "text=" + data.text + "&"
        }
        if (data.date != undefined) {
            searchQuery += "date=" + data.date + "&"
        }
        if (data.locationId != undefined) {
            searchQuery += "locationId=" + data.locationId + "&"
        }
        console.log(searchQuery);
        return axios.get<Event[]>(`${API_URL}${eventUrl}${searchQuery}`,);
    }
    const getEventById = (id: Number) => {
        return axios.get<Event>(`${API_URL}${eventUrl}/${id}`);
    }

    const createEvent = (event: Event) => {
        event.Location = undefined;
        return axios.post<Event>(`${API_URL}${eventUrl}`, event);
    }

    const updateEvent = (event: Event) => {
        return axios.put<Event>(`${API_URL}${eventUrl}/${event.id}`, event);
    }

    const deleteEvent = (id: Number) => {
        return axios.delete(`${API_URL}${eventUrl}/${id}`);
    }
    return { getEvents, getEventById, deleteEvent, updateEvent, createEvent }
}

export default EventService;
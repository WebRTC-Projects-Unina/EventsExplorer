import { Event } from '../models/event';
import useAxiosInterceptor from '@/app/hooks/useAuthInterceptor';
import { Search } from '../models/search';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const eventUrl = '/api/events';
const EventService = () => {
    const { axios } = useAxiosInterceptor();

    const getEvents = (data: Search | undefined) => {
        let searchQuery = "?";

        if (data?.text != undefined && data?.text.length > 0) {
            searchQuery += "text=" + data.text + "&"
        }
        if (data?.date != undefined) {
            searchQuery += "date=" + data.date.toISOString() + "&"
        }
        if (data?.location != undefined) {
            searchQuery += "locationId=" + data.location + "&"
        }
        if (data?.tag != undefined) {
            searchQuery += "tag=" + data.tag + "&"
        }
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
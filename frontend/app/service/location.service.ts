import useAxiosInterceptor from '../hooks/useAuthInterceptor';
import { Location } from '../models/event';
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const locationUrl = '/api/locations'

const LocationService = () => {
    const { axios } = useAxiosInterceptor();

    const getLocations = () => {
        return axios.get<Location[]>(`${API_URL}${locationUrl}`);
    }

    const getLocationById = (id: Number) => {
        return axios.get<Location>(`${API_URL}${locationUrl}/${id}`);
    }

    const createLocation = (location: Location) => {
        return axios.post<Location>(`${API_URL}${locationUrl}`, location);
    }

    const updateLocation = (location: Location) => {
        return axios.put<Location>(`${API_URL}${locationUrl}/${location.id}`, location);
    }

    const deleteLocation = (id: Number) => {
        return axios.delete(`${API_URL}${locationUrl}/${id}`);
    }
    return { getLocations, getLocationById, createLocation, updateLocation, deleteLocation };
}
export default LocationService;
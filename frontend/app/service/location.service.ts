import axios from 'axios';
import { Location } from '../models/event';
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const locationUrl = '/api/locations'

function getLocations() {
    return axios.get<Location[]>(`${API_URL}${locationUrl}`);
}

export { getLocations };
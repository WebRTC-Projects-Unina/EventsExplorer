import axios from 'axios';
import { Login } from '../models/event';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const loginUrl = '/api/login';

function login(username: string, password: string) {
    const login: Login = {
        password: password,
        username: username,
        token: ''
    };
    return axios.post<Login>(`${API_URL}${loginUrl}`, login);
}

export { login };
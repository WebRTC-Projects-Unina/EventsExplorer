import useAxiosInterceptor from '../hooks/useAuthInterceptor';
import { Tag } from '../models/event';
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const tagUrl = '/api/tags'

const TagService = () => {
    const { axios } = useAxiosInterceptor();

    const getTags = (search: string) => {
        return axios.get<Tag[]>(`${API_URL}${tagUrl}?search=${search}`);
    }

    return { getTags };
}
export default TagService;
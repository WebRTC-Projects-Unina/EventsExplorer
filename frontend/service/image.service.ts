import useAxiosInterceptor from '@/hooks/useAuthInterceptor';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const uploadUrl = '/api/images/upload';

const ImageService = () => {
    const { axios } = useAxiosInterceptor();
    const upload = async (file: any, id: number) => {
        let formData = new FormData();
        const fetchedFile = await fetch(file.uri);
        const blob = await fetchedFile.blob();
        formData.set("file", blob, file.name);
        formData.set('eventId', id.toString());
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        return axios.post(`${API_URL}${uploadUrl}`, formData, config);
    }

    return { upload };
};
export default ImageService;


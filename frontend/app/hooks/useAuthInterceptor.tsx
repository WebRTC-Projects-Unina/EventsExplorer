import React from 'react';
import axiosInstance from '../service/axiosInstance';
import Toast from 'react-native-toast-message';
import { useSession } from './authProvider';

const useAxiosInterceptor = () => {

    const { session } = useSession();

    React.useEffect(() => {
        const reqInterceptor = axiosInstance.interceptors.request.use(
            (config: any) => {
                console.log(session);
                config.headers = {
                    Authorization: `Bearer ${session}`,
                    AccessControlAllowHeaders: 'Content-Type'
                };
                return config;
            },
            (error: any) => {
                Toast.show({
                    type: 'error',
                    text1: error.request?.data?.error
                });
                return Promise.reject(error);
            }
        );

        const resInterceptor = axiosInstance.interceptors.response.use(
            (config: any) => {
                return config;
            },
            (error: any) => {
                Toast.show({
                    type: 'error',
                    text1: error.response?.status + ' ' + error.response?.data?.error
                });
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(reqInterceptor);
            axiosInstance.interceptors.response.eject(resInterceptor);
        }
    }, [session]);

    return { axios: axiosInstance };
}
export default useAxiosInterceptor;
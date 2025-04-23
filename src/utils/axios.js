import Axios from 'axios';
console.log(import.meta.env.VITE_APP_API_URL, "import.meta.env.REACT_APP_API_URL");


export const useAdminAppService = () => {
    const userData = localStorage.getItem('token') || '{}';
    const adminAppService = Axios.create({
        baseURL: `${import.meta.env.VITE_APP_API_URL}`,
    });

    adminAppService.interceptors.request.use((config) => {
        config.headers.Authorization = userData.token ? `Bearer ${userData.token}` : '';
        config.headers['domainName'] = 'skyvoice';
        return config;
    });

    adminAppService.interceptors.response.use(
        (response) => response.data,
        (error) => {
            const message = error.response?.data?.message || error.message;
            console.error('API Error:', message);
            throw new Error(message);
        }
    );

    return adminAppService;
};

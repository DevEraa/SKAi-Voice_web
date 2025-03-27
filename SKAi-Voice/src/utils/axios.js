import Axios from 'axios';
console.log(import.meta.env.VITE_APP_API_URL, "import.meta.env.REACT_APP_API_URL");


export const useAdminAppService = () => {
    const userData = JSON.parse(sessionStorage.getItem('token') || '{}');
    const adminAppService = Axios.create({
        baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3000/v1',
    });

    adminAppService.interceptors.request.use((config) => {
        config.headers.Authorization = userData.token ? `Bearer ${userData.token}` : '';
        // config.headers.Accept = '*/*';
        // config.headers['Custom-Header'] = 'CustomHeaderValue';
        config.headers['domainName'] = 'marketingcrm';
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

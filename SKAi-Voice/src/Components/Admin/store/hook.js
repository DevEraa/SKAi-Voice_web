import { useAdminAppService } from '../../../utils/axios';
import toast from 'react-hot-toast';

const adminHooks = () => {
    const adminAppService = useAdminAppService();

    const login = async (data) => {
        try {
            const response = await adminAppService.post('/admin/login', data);
            return response;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    const createTeamUser = async (data) => {
        try {
            const response = await adminAppService.post('/team/create', data);
            return response;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    const listTeamUsers = async (pagesize, offset, search = '') => {
        try {
            const response = await adminAppService.get(`team/list?pagesize=${pagesize}&offset=${offset}&search=${search}`);
            return response;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    const getTeamUserById = async (id) => {
        try {
            const response = await adminAppService.get(`/team/get/${id}`);
            return response;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    const updateTeamUser = async (id, data) => {
        try {
            const response = await adminAppService.put(`/team/update/${id}`, data);
            return response;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    return {
        login,
        createTeamUser,
        listTeamUsers,
        getTeamUserById,
        updateTeamUser
    }
}

export default adminHooks;
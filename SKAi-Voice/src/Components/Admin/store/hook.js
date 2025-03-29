import { useAdminAppService } from '../../../utils/axios';
// import toast from 'react-hot-toast';

const adminHooks = () => {
    const adminAppService = useAdminAppService();

    const login = async (data) => {
        try {
            const response = await adminAppService.post('/admin/login', data);
            console.log(response, "response in login");
            if (response.message === "✅ Login successful!") {
                console.log("Login successful");
                sessionStorage.setItem('token', JSON.stringify(response));
                sessionStorage.setItem('adminid', JSON.stringify(response.id));

            } else {
                console.log("Login failed");
            }
            return response;

        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    const createTeamUser = async (data) => {
        try {
            const adminid = JSON.parse(sessionStorage.getItem('adminid'));
            const values = {
                ...data,
                admin_id: adminid
            }
            const response = await adminAppService.post('/team/create', values);
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
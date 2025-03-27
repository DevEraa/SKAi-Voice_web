import { useAdminAppService } from '../../../utils/axios';
import toast from 'react-hot-toast';

const superadminApp = () => {
    const adminAppService = useAdminAppService();

    const superadminlogin = async (data) => {
        try {
            const response = await adminAppService.post('/superadmin/login', data);
            return response;
        } catch (error) {
            console.error(error);
            toast.error("Login failed");
            throw new Error(error);
        }
    }

    const createNewAdmin = async (data) => {
        try {
            const response = await adminAppService.post('/admin/create', data);
            if (response.message === "✅ Admin created successfully") {
                toast.success("Admin created successfully");
            }
            return response;
        } catch (error) {
            console.error(error);
            toast.error("Failed to create admin");
            throw new Error(error);
        }
    }

    const listAdmin = async (pagesize, offset, search = '') => {
        try {
            const response = await adminAppService.get(`admin/list?pagesize=${pagesize}&offset=${offset}&search=${search}`);
            return response;
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch admin list");
            throw new Error(error);
        }
    }

    const getAdminById = async (id) => {
        try {
            const response = await adminAppService.get(`/admin/get/${id}`);
            return response;
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch admin details");
            throw new Error(error);
        }
    }

    const updateAdmin = async (id, data) => {
        try {
            const response = await adminAppService.put(`/admin/update/${id}`, data);
            if (response.message === "✅ Admin updated successfully") {
                toast.success("Admin updated successfully");
            }
            return response;
        } catch (error) {
            console.error(error);
            toast.error("Failed to update admin");
            throw new Error(error);
        }
    }

    const deleteAdmin = async (id) => {
        try {
            const response = await adminAppService.delete(`/admin/delete/${id}`);
            if (response.message === "✅ Admin deleted successfully") {
                toast.success("Admin deleted successfully");
            }
            return response;
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete admin");
            throw new Error(error);
        }
    }

    return {
        superadminlogin,
        createNewAdmin,
        listAdmin,
        getAdminById,
        updateAdmin,
        deleteAdmin
    };
}

export default superadminApp;
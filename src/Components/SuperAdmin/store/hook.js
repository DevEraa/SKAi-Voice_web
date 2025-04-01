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
            console.log(response, "response in create new admin");
            if (response.message === "✅ Admin created successfully!") {
                console.log("Admin created successfully");
                toast.success("Admin created successfully");
                listAdmin();
            }
            return response;
        } catch (error) {
            console.error(error);
            toast.error("Failed to create admin");
            throw new Error(error);
        }
    }

    const listAdmin = async (pagesize = 10, offset = 0, search = '') => {
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

    const adminhistory = async () => {
        try {
            const response = await adminAppService.get(`superadmin/gethistory`);
            return response;
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch admin history");
            throw new Error(error);
        }
    }

    const deleteadminhistory = async (id) => {
        try {
            const response = await adminAppService.delete( `superadmin/deletehistory/${id}`);
            return response;
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete admin history");
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
        console.log("userToDelete",id)
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

    const saveprice = async (price) => {
        try {
            const response = await adminAppService.post('superadmin/saveprice', price);
            return response;
        } catch (error) {
            console.error(error);
            toast.error("Failed to create price");
            throw new Error(error);
        }
    }

    const getprice = async () => {
        try {
            const response = await adminAppService.get(`superadmin/getprice`);
            return response;
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch price ");
            throw new Error(error);
        }
    }

    return {
        superadminlogin,
        createNewAdmin,
        listAdmin,
        getAdminById,
        updateAdmin,
        deleteAdmin,
        adminhistory,
        deleteadminhistory,
        saveprice,
        getprice
    };
}

export default superadminApp;
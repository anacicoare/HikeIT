import axiosInstance from "../axiosInstance";

export const AdminServices = {
    //Get project members
    getAllUsers: () => {
        return axiosInstance.get("/all_users/");
    },
    
    updateUser: (data: any) => {
        return axiosInstance.put(`/update_user/?email=${data?.email}`, data);
    }
};

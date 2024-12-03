import axiosInstance from "../axiosInstance";

export const ProfileServices = {
    //Get project members
    callApiGetUserData: (email: any) => {
        return axiosInstance.get(`/profile/?email=${email}`);
    },
}
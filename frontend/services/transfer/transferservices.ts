import axiosInstance from "../axiosInstance";

export const TransferServices = {
    //Get project members
    callApiTransfer: (data: any) => {
        return axiosInstance.post("/transfer/", data);
    },
};

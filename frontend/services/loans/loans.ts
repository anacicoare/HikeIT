import { update } from "lodash";
import axiosInstance from "../axiosInstance";

export const LoansServices = {
    //Get project members
    callApiTransfer: (data: any) => {
        return axiosInstance.post("/loan/", data);
    },

    updateLoan: (data: any, email: any) => {
        return axiosInstance.put(`/update_loan/?email=${email}`, data);
    },

    getAllLoans: (email: any) => {
        return axiosInstance.get(`/get_all_loans/?email=${email}`);
    },
};

import axiosInstance from "../axiosInstance";

export const CardServices = {
    //Get project members
    callApiGetCards: (email: any) => {
        return axiosInstance.get(`/my_cards/?email=${email}`);
    },

    callApiCreateCard: (data: any) => {
        return axiosInstance.post("/add_card/", data)
    },

    getUserCards: (email: any) => {
        return axiosInstance.get(`/get_user_cards/?email=${email}`);
    },

    updateIbanBalance: (data: any) => {
        return axiosInstance.put(`/update_iban_balance/`, data);
    }
}
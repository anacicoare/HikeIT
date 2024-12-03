import axiosInstance from "../axiosInstance";

export const ReportServices = {
    callApiGetReports: (email: any) => {
        return axiosInstance.get(`/reports/?email=${email}`);
    },
}
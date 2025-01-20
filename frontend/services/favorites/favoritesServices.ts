import axiosInstance from "../axiosInstance";

export const FavoritesServices = {
    getDataForFavorites: (data: any) => {
        return axiosInstance.post(`/add_to_favorites/`, data);
    },
    getAllFavorites: (data: any) => {
        return axiosInstance.post(`/see_favorites/`, data);
    }
}
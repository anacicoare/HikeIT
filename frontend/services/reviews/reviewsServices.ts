import { get } from "axios";
import axiosInstance from "../axiosInstance";

export const ReviewsServices = {
    getDataForReview: (data: any) => {
        return axiosInstance.post(`/leave_review/`, data);
    },
    getAllReviewsForTrail: (trailName: any) => {
        return axiosInstance.get(`/get_all_reviews_for_trail/?trail_name=${trailName}`);
    },
    getAllReviewsForUser: (email: any) => {
        return axiosInstance.get(`/get_all_reviews/?email=${email}`);
    }
}
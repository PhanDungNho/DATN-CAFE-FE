import sizeService from "../../services/authorityService";
import {
    AUTHORITIES_SET,
    COMMON_ERROR_SET,
    COMMON_LOADING_SET,
    COMMON_MESSAGE_SET,
} from "./actionType";


export const getAuthorities = () => async (dispatch) => {
    const service = new sizeService();

    try {
        console.log("get all authorities");
        dispatch({
            type: COMMON_LOADING_SET,
            payload: true,
        });

        const response = await service.getAuthorities();
        console.log(response);

        if (response.status === 200) {
            dispatch({
                type: AUTHORITIES_SET,
                payload: response.data,
            });
        } else {
            dispatch({
                type: COMMON_ERROR_SET,
                payload: response.message,
            });
        }
    } catch (error) {
        dispatch({
            type: COMMON_ERROR_SET,
            payload: error.response.data
                ? error.response.data.message
                : error.message,
        });
    }
    dispatch({
        type: COMMON_LOADING_SET,
        payload: false,
    });
};

export const findAuthoritiesByNameContainsIgnoreCase =
    (query) => async (dispatch) => {
        const service = new sizeService();

        try {
            dispatch({
                type: COMMON_LOADING_SET,
                payload: true,
            });

            const response = await service.findAuthoritiesByNameContainsIgnoreCase(
                query
            );

            // Kiểm tra nếu mã phản hồi không phải là 200
            if (response.status === 200) {
                // Nếu response.data là mảng, trả về dữ liệu; ngược lại trả về mảng rỗng
                const categories = Array.isArray(response.data) ? response.data : [];
                dispatch({
                    type: AUTHORITIES_SET,
                    payload: categories,
                });
            } else {
                dispatch({
                    type: AUTHORITIES_SET,
                    payload: [],
                });
                dispatch({
                    type: COMMON_ERROR_SET,
                    payload:
                        response.message || "An error occurred while fetching categories",
                });
            }
        } catch (error) {
            dispatch({
                type: AUTHORITIES_SET,
                payload: [],
            });
            dispatch({
                type: COMMON_ERROR_SET,
                payload: error.response?.data?.message || error.message,
            });
        } finally {
            dispatch({
                type: COMMON_LOADING_SET,
                payload: false,
            });
        }
    };




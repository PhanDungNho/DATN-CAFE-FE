import authorityService from "../../services/authorityService";
import {
    AUTHORITIES_SET,
    COMMON_ERROR_SET,
    COMMON_LOADING_SET,
    COMMON_MESSAGE_SET,
    AUTHORITY_UPDATE,
    AUTHORITY_DELETE,
    AUTHORITY_APPEND
} from "./actionType";

// Lấy danh sách quyền
export const getAuthorities = () => async (dispatch) => {
    const service = new authorityService();

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

// Tìm quyền theo tên
export const findAuthoritiesByNameContainsIgnoreCase =
    (query) => async (dispatch) => {
        const service = new authorityService();

        try {
            dispatch({
                type: COMMON_LOADING_SET,
                payload: true,
            });

            const response = await service.findAuthoritiesByNameContainsIgnoreCase(query);

            if (response.status === 200) {
                const authorities = Array.isArray(response.data) ? response.data : [];
                dispatch({
                    type: AUTHORITIES_SET,
                    payload: authorities,
                });
            } else {
                dispatch({
                    type: AUTHORITIES_SET,
                    payload: [],
                });
                dispatch({
                    type: COMMON_ERROR_SET,
                    payload:
                        response.message || "An error occurred while fetching authorities",
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

    export const postAuthority = (authorityDto) => async (dispatch) => {
        const service = new authorityService();
        try {
            const response = await service.postAuthority(authorityDto);
            dispatch({
                type: AUTHORITY_APPEND,
                payload: response,  // Add the new authority to the store
            });
            dispatch({
                type: COMMON_MESSAGE_SET,
                payload: "Authority successfully granted",
            });
        } catch (error) {
            dispatch({
                type: COMMON_ERROR_SET,
                payload: error.response?.data?.message || error.message,
            });
        }
    };

// Tước quyền của tài khoản (delete authority)
export const deleteAuthority = (id) => async (dispatch) => {
    const service = new authorityService();

    try {
        dispatch({
            type: COMMON_LOADING_SET,
            payload: true,
        });

        const response = await service.deleteAuthority(id);

        if (response) {
            dispatch({
                type: AUTHORITY_DELETE,
                payload: id, // Gửi ID của quyền đã xóa để cập nhật danh sách
            });
            dispatch({
                type: COMMON_MESSAGE_SET,
                payload: "Authority successfully revoked",
            });
        } else {
            dispatch({
                type: COMMON_ERROR_SET,
                payload: "Error revoking authority",
            });
        }
    } catch (error) {
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

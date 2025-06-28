import axios, { AxiosError, type AxiosRequestConfig, HttpStatusCode } from "axios";
import type { Dispatch } from "react";
import type { CRAILContextAction } from "../contexts/proptypes";
import { CONTEXT_PATHS } from "../contexts/CRAIL-Context";

console.log("API Base URL:", import.meta.env.CRAIL_API_BASE_URL);

const AxiosInstance = axios.create({
    baseURL: import.meta.env.CRAIL_API_BASE_URL,
    headers: {
        "ngrok-skip-browser-warning": "true",
    },
});

AxiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const handleErrors = (error: AxiosError) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
        if (window.top) {
            window.top.location.reload();
        } else if (window.parent) {
            window.parent.location.reload();
        } else {
            window.location.reload();
        }
    }
    return Promise.reject(error);
};

const POST = async (
    url: string,
    dispatch: Dispatch<CRAILContextAction>,
    data?: unknown,
    config?: AxiosRequestConfig<unknown>
) => {
    dispatch({ type: CONTEXT_PATHS.SHOW_SPINNER, payload: { showSpinner: true } });

    return await AxiosInstance.post(url, data, config)
        .then((response) => response.data)
        .catch(handleErrors)
        .finally(() =>
            dispatch({ type: CONTEXT_PATHS.SHOW_SPINNER, payload: { showSpinner: false } })
        );
};

const GET = async (
    url: string,
    dispatch: Dispatch<CRAILContextAction>,
    config?: AxiosRequestConfig<unknown>
) => {
    dispatch({ type: CONTEXT_PATHS.SHOW_SPINNER, payload: { showSpinner: true } });

    return await AxiosInstance.get(url, config)
        .then((response) => response.data)
        .catch(handleErrors)
        .finally(() =>
            dispatch({ type: CONTEXT_PATHS.SHOW_SPINNER, payload: { showSpinner: false } })
        );
};

const DELETE = async (
    url: string,
    dispatch: Dispatch<CRAILContextAction>,
    config?: AxiosRequestConfig<unknown>
) => {
    dispatch({ type: CONTEXT_PATHS.SHOW_SPINNER, payload: { showSpinner: true } });

    return await AxiosInstance.delete(url, config)
        .then((response) => response.data)
        .catch(handleErrors)
        .finally(() =>
            dispatch({ type: CONTEXT_PATHS.SHOW_SPINNER, payload: { showSpinner: false } })
        );
};

const PUT = async (
    url: string,
    dispatch: Dispatch<CRAILContextAction>,
    data?: unknown,
    config?: AxiosRequestConfig<unknown>
) => {
    dispatch({ type: CONTEXT_PATHS.SHOW_SPINNER, payload: { showSpinner: true } });

    return await AxiosInstance.put(url, data, config)
        .then((response) => response.data)
        .catch(handleErrors)
        .finally(() =>
            dispatch({ type: CONTEXT_PATHS.SHOW_SPINNER, payload: { showSpinner: false } })
        );
};

export { POST, GET, DELETE, PUT };

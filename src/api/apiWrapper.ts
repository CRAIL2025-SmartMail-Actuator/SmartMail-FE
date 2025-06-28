import axios, { AxiosError, type AxiosRequestConfig, HttpStatusCode } from "axios";

const AxiosInstance = axios.create({
    baseURL: import.meta.env.CRAIL_API_BASE_URL,
    headers: {
        "ngrok-skip-browser-warning": "true",
    },
});

AxiosInstance.interceptors.request.use(
    config => {

        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // Handle request error
        return Promise.reject(error);
    }
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
    data?: unknown,
    config?: AxiosRequestConfig<unknown> | undefined,

) => {
    return await AxiosInstance.post(`${url}`, data, config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return handleErrors(error);
        });
};

const GET = async (
    url: string

) => {
    return await AxiosInstance.get(`${url}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return handleErrors(error);
        });
};

const DELETE = async (
    url: string,
    config?: AxiosRequestConfig<unknown> | undefined,

) => {
    return await AxiosInstance.delete(`${url}`, config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return handleErrors(error);
        });
};



const PUT = async (
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig<unknown> | undefined,

) => {
    return await AxiosInstance.put(`${url}`, data, config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return handleErrors(error);
        });
};
export { POST, GET, DELETE, PUT }
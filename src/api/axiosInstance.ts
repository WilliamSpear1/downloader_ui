import axios from "axios";

/**
 * Shared Axios client for downloader API requests.
 * Uses `VITE_API_URL` as its base URL; without it, requests are same-origin.
 */
const server = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export default server;
import axios from "axios";

export const API_BASE_URL = "https://api.curseforge.com/v1/"

export const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'x-api-key': process.env.CURSEFORGE_API_KEY,
        'Accept': 'application/json'
    }
});

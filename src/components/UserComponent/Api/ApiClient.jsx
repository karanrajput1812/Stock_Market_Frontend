import axios from 'axios';
import { BACKEND_URL3 } from '../../../config/backend';

export const apiClient = axios.create(
    {
    baseURL: "https://24da-14-142-39-150.ngrok-free.app"
    }
)
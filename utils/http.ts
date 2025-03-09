import axios from 'axios';
import { getSession } from 'next-auth/react';

const RequestAPI = async (path: string, method: "get" | "post" | "patch", body?: any) => {
    const session = await getSession();
    const token = session?.user?.token;
    const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!token) {
        throw new Error('User is not authenticated or token is missing');
    }

    try {
        const response = await axios({
            url: `${BASE_API_URL}${path}`,
            method: method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: body,
        });

        return response.data;
    } catch (error: any) {
        console.error('API Request failed:', error);
        throw error.response?.data || new Error(error.message || 'API Request failed');
    }
};

export default RequestAPI;
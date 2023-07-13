import axios from "axios";


export async function checkInternetConnectivity(): Promise<boolean> {
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev) return true;

    try {
        const response = await axios.get('https://www.example.com');
        if (response.status === 200) {
            return true
        }
        return false
    } catch (error) {
        return false
    }
}
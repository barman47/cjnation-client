import axios from 'axios';
import { TOKEN_VALUE } from './constants';

const setAuthToken = (token?: string) => {
    if (token) {
        // Apply to every request
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem(TOKEN_VALUE, token);
    } else {
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem(TOKEN_VALUE);
    }
};

export default setAuthToken;
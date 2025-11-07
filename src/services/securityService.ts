import axios from "axios";
import { User } from "../models/User";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";

class SecurityService extends EventTarget {
    keySession: string;
    API_URL: string;
    user: User;
    theAuthProvider: any;
    
    constructor() {
        super();

        this.keySession = 'session';
        this.API_URL = import.meta.env.VITE_API_URL || ""; // Reemplaza con la URL real
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            this.user = JSON.parse(storedUser);
        } else {
            this.user = {};
        }
    }

    async login(user: User) {
        console.log("llamando api " + `${this.API_URL}/auth/signin`);
        try {
            const response = await axios.post(`${this.API_URL}/auth/signin`, user, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            console.log("Response data:", data);
            localStorage.setItem("user", JSON.stringify(data.user));
            store.dispatch(setUser(data));
            return data.user;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }
    
    getUser() {
        return this.user;
    }
    
    logout() {
        this.user = {};
        
        this.dispatchEvent(new CustomEvent("userChange", { detail: null }));
        store.dispatch(setUser(null));
    }

    isAuthenticated() {
        return localStorage.getItem(this.keySession) !== null;
    }

    getToken() {
        return localStorage.getItem(this.keySession);
    }
}

export default new SecurityService();

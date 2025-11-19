import { User } from "./User";

export interface Address {
    id?: number;
    street?: string;
    number?: string;
    latitude?: string;
    longitude?: string;
    user_id?: number;
    user?: User;
}
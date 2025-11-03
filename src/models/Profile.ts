import { User } from "./User";

export interface Profile {
    id?: number;
    phone?: string;
    photo_url?: string;
    user?: User;
}
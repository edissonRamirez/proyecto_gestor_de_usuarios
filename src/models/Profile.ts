import { User } from "./User";

export interface Profile {
    id?: number;
    phone?: string;
    photo?: string;
    user_id?: User['id']
}
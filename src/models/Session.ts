import { User } from "./User";

export interface Session {
    id?: number;
    token?: string;
    expiration?: Date;
    faCode?: string;
    state?: string;
    user?: User;
}
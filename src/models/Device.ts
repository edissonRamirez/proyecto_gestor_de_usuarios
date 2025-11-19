import { User } from "./User";

export interface Device {
    id?: number;
    user_id?: User["id"];
    name?: string;
    ip?: string;
    operating_system?: string;
}
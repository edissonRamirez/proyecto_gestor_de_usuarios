import { RolePermission } from "./RolePermission";

export interface Permission {
    id?: number;
    url?: string;
    method?: string;
    role_permissions?: RolePermission[];
}
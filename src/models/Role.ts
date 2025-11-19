import { RolePermission } from "./RolePermission";

export interface Role {
  id: number;
  name: string;
  description: string;
  role_permissions: RolePermission[];
}   
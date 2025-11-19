import { Permission } from "./Permission";
import { Role } from "./Role";

// src/models/RolePermission.ts
export interface RolePermission {
  id?: number;
  role_id: number;
  permission_id: number;
  role?: Role;
  permission?: Permission;
}

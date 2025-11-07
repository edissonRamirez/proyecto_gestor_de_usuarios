// src/services/rolePermissionService.ts
import api from "../interceptors/axiosInterceptor";
import { RolePermission } from "../models/RolePermission";

const API_URL = import.meta.env.VITE_API_URL + "/api/role-permissions";

class RolePermissionService {
  async getAll(): Promise<RolePermission[]> {
    try {
      const response = await api.get<RolePermission[]>(API_URL);
      console.log("response: ", response.data);
      
      return response.data;
    } catch (error) {
      console.error("Error al obtener las relaciones role-permission:", error);
      return [];
    }
  }

  async addPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission | null> {
    try {
      const response = await api.post<RolePermission>(
        `${API_URL}/role/${roleId}/permission/${permissionId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al asignar permiso al rol:", error);
      return null;
    }
  }
}

export const rolePermissionService = new RolePermissionService();

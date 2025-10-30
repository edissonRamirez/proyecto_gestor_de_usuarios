import axios from "axios";
import { Permission } from "../models/Permission";

const API_URL = import.meta.env.VITE_API_URL + "/permissions" || "";

class PermissionService {
    // Obtener todos los permisos
    async getPermissions(): Promise<Permission[]> {
        try{
            const response = await axios.get<Permission[]>(`${API_URL}/list`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener permisos: ", error);
            return []
        }
    }

    // Obtener un permiso por ID
    async getPermissionById(id: number): Promise<Permission | null> {
        try {
            const response = await axios.get<Permission>(`${API_URL}/${id}`)
            return response.data;
        } catch (error) {
            console.error("Error al obtener el permiso con id: ", id);
            return null
        }
    }

    async createPermission(permission: Omit<Permission, "id">): Promise<Permission | null> {
        try{
            const response = await axios.post<Permission>(API_URL, permission);
            return response.data;
        } catch (error) {
            console.error("Error al crear el permiso: ", error);
            return null;
        }
    }

    // Actualizar un rol existente
    async updatePermission(id: number, permission: Partial<Permission>): Promise<Permission | null> {
        try {
            const response = await axios.put<Permission>(`${API_URL}/${id}`, permission);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar permiso:", error);
            return null;
        }
    }

    // Eliminar un rol
    async deleteRole(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar rol:", error);
            return false;
        }
    }
}

export const permissionService = new PermissionService();
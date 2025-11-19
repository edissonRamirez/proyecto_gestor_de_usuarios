// src/services/userRoleService.ts
import axios from "axios";
import { UserRole } from "../models/UserRole";

const API_URL = import.meta.env.VITE_API_URL + "/api/user-roles";

class UserRoleService {
  // Crear una relación User ↔ Role
  async assignRoleToUser(userId: number, roleId: number): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      const end = new Date();
      end.setFullYear(end.getFullYear() + 1);

      const payload = {
        startAt: now,
        endAt: end.toISOString(),
      };

      const response = await axios.post(
        `${API_URL}/user/${userId}/role/${roleId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error("❌ Error al asignar rol al usuario:", error);
      return false;
    }
  }

  // Obtener todas las relaciones
  async getUserRoles(): Promise<UserRole[]> {
    try {
      const response = await axios.get<UserRole[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener relaciones usuario-rol:", error);
      return [];
    }
  }

  async getUserRoleById(id: string): Promise<UserRole> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  async updateUserRole(id: string, data: Partial<UserRole>): Promise<UserRole | null> {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }

  // Eliminar una relación
  async deleteUserRole(id: string): Promise<boolean> {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error("Error al eliminar relación usuario-rol:", error);
      return false;
    }
  }
}

export const userRoleService = new UserRoleService();

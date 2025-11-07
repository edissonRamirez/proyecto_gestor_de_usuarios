// src/services/userRoleService.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/user-roles";

class UserRoleService {
  async assignRoleToUser(userId: number, roleId: number): Promise<boolean> {
    try {
      const response = await axios.post(`${API_URL}/user/${userId}/role/${roleId}`);
      return response.status === 201 || response.status === 200;
    } catch (error) {
      console.error("Error al asignar rol al usuario:", error);
      return false;
    }
  }
}

export const userRoleService = new UserRoleService();

import axios from "axios";
import { Role } from "../models/Role";

const API_URL = import.meta.env.VITE_API_URL + "/roles" || "";

class RoleService {
  // Obtener todos los roles
  async getRoles(): Promise<Role[]> {
    try {
      const response = await axios.get<Role[]>(`${API_URL}/list`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener roles:", error);
      return [];
    }
  }

  // Obtener un rol por ID
  async getRoleById(id: number): Promise<Role | null> {
    try {
      const response = await axios.get<Role>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Rol no encontrado:", error);
      return null;
    }
  }

  // Crear un nuevo rol
  async createRole(role: Omit<Role, "id">): Promise<Role | null> {
    try {
      const response = await axios.post<Role>(API_URL, role);
      return response.data;
    } catch (error) {
      console.error("Error al crear rol:", error);
      return null;
    }
  }

  // Actualizar un rol existente
  async updateRole(id: number, role: Partial<Role>): Promise<Role | null> {
    try {
      const response = await axios.put<Role>(`${API_URL}/${id}`, role);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar rol:", error);
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

// Exportamos una instancia para reutilizar
export const roleService = new RoleService();

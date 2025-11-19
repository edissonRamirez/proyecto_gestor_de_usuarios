// src/services/passwordService.ts
import axios from "axios";
import { Password } from "../models/Password";

const API_URL = import.meta.env.VITE_API_URL + "/api/passwords";

class PasswordService {
  // 🔹 Obtener todas las contraseñas
  async getPasswords(): Promise<Password[]> {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las contraseñas:", error);
      return [];
    }
  }

  // 🔹 Obtener una contraseña por ID
  async getPasswordById(id: number): Promise<Password | null> {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la contraseña:", error);
      return null;
    }
  }

  // 🔹 Crear una contraseña (requiere ID de usuario)
  async createPassword(userId: number, password: Password): Promise<Password | null> {
    try {
      const response = await axios.post(`${API_URL}/user/${userId}`, password, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error al crear la contraseña:", error);
      return null;
    }
  }

  // 🔹 Actualizar una contraseña existente
  async updatePassword(id: number, password: Password): Promise<boolean> {
    try {
      const response = await axios.put(`${API_URL}/${id}`, password, {
        headers: { "Content-Type": "application/json" },
      });
      return response.status === 200;
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      return false;
    }
  }

  // 🔹 Eliminar una contraseña
  async deletePassword(id: number): Promise<boolean> {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error("Error al eliminar la contraseña:", error);
      return false;
    }
  }
}

export const passwordService = new PasswordService();

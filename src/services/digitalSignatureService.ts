// src/services/digitalSignatureService.ts
import axios from "axios";
import { DigitalSignature } from "../models/DigitalSignature";

const API_URL = import.meta.env.VITE_API_URL + "/api/digital-signatures";

class DigitalSignatureService {
  /**
   * 🔹 Obtener todas las firmas digitales
   */
  async getDigitalSignatures(): Promise<DigitalSignature[]> {
    try {
      const response = await axios.get<DigitalSignature[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las firmas digitales:", error);
      return [];
    }
  }

  /**
   * 🔹 Obtener una firma digital por su ID
   */
  async getDigitalSignatureById(id: string | number): Promise<DigitalSignature | null> {
    try {
      const response = await axios.get<DigitalSignature>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la firma digital:", error);
      return null;
    }
  }

  /**
   * 🔹 Crear una nueva firma digital para un usuario
   * Espera: (user_id, archivo photo)
   * Endpoint backend: POST /api/digital-signatures/user/<int:user_id>
   */
  async createDigitalSignature(
    userId: number,
    file: File
  ): Promise<DigitalSignature | null> {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await axios.post<DigitalSignature>(
        `${API_URL}/user/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error al crear firma digital:", error);
      return null;
    }
  }

  /**
   * 🔹 Actualizar una firma digital existente
   * Endpoint backend: PUT /api/digital-signatures/<int:id>/user/<int:user_id>
   */
  async updateDigitalSignature(
    id: number,
    userId: number,
    file?: File
  ): Promise<DigitalSignature | null> {
    try {
      const formData = new FormData();

      if (file) {
        formData.append("photo", file);
      }

      const response = await axios.put<DigitalSignature>(
        `${API_URL}/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error al actualizar firma digital:", error);
      return null;
    }
  }

  /**
   * 🔹 Eliminar una firma digital
   */
  async deleteDigitalSignature(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar firma digital:", error);
      return false;
    }
  }
}

export const digitalSignatureService = new DigitalSignatureService();

import axios from "axios";
import { Profile } from "../models/Profile";

const API_URL = import.meta.env.VITE_API_URL + "/api/profiles" || "";

class ProfileService {
  /**
   * Crear o actualizar perfil dependiendo de si ya existe
   */
  async createOrUpdateProfile(profileId: number, profileData: Profile, file?: File): Promise<Profile | null> {
    try {
      const formData = new FormData();
      if (profileData.phone) formData.append("phone", profileData.phone);

      // Asegurarnos de que el archivo foto se envíe correctamente
      if (file) {
        formData.append("photo", file); // Este es el archivo de la foto
      }

      // Ahora hacemos la solicitud
      const response = await axios.put<Profile>(`${API_URL}/${profileId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      console.error("Error al crear/actualizar perfil:", error);
      return null;
    }
  }
}

export const profileService = new ProfileService();

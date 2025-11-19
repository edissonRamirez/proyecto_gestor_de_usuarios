import axios from "axios";
import { Profile } from "../models/Profile";

const API_URL = `${import.meta.env.VITE_API_URL}/api/profiles`;

class ProfileService {
  /**
   * 🔹 Obtener todos los perfiles
   */
  async getProfiles(): Promise<Profile[]> {
    try {
      const response = await axios.get<Profile[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener perfiles:", error);
      return [];
    }
  }

  /**
   * 🔹 Obtener un perfil por ID
   */
  async getProfileById(profileId: number): Promise<Profile | null> {
    try {
      const response = await axios.get<Profile>(`${API_URL}/${profileId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el perfil con ID ${profileId}:`, error);
      return null;
    }
  }

  /**
   * 🔹 Crear un nuevo perfil (incluye foto opcional)
   */
  async createProfile(profileData: Profile, file?: File): Promise<Profile | null> {
  try {
    if (!profileData.user_id) throw new Error("El user_id es obligatorio");

    const formData = new FormData();
    formData.append("phone", profileData.phone || "");
    if (file) formData.append("photo", file); // 👈 el archivo seleccionado
    // El backend generará su propia photo_url
    const response = await axios.post<Profile>(
      `${API_URL}/user/${profileData.user_id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear perfil:", error);
    return null;
  }
}




  /**
   * 🔹 Actualizar un perfil existente
   */
  async updateProfile(profileId: number, profileData: Profile, file?: File): Promise<Profile | null> {
    try {
      const formData = new FormData();
      if (profileData.phone) formData.append("phone", profileData.phone);

      // Solo enviar archivo si se ha modificado
      if (file) {
        formData.append("photo", file);
      }

      const response = await axios.put<Profile>(`${API_URL}/${profileId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      return null;
    }
  }

  /**
   * 🔹 Eliminar un perfil por ID
   */
  async deleteProfile(profileId: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${profileId}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar el perfil con ID ${profileId}:`, error);
      return false;
    }
  }
}

export const profileService = new ProfileService();

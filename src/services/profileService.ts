import axios from "axios";
import { Profile } from "../models/Profile";

const API_URL = import.meta.env.VITE_API_URL + "/api/profiles" || "";

class ProfileService {
  async getProfileById(id: number): Promise<Profile | null> {
    try {
      const response = await axios.get<Profile>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      return null;
    }
  }

  async createOrUpdateProfile(userId: number, profileData: Partial<Profile>, file?: File): Promise<Profile | null> {
    try {
      const formData = new FormData();
      if (profileData.phone) formData.append("phone", profileData.phone);
      if (file) formData.append("photo", file); // archivo opcional

      const response = await axios.post<Profile>(`${API_URL}/user/${userId}`, formData, {
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

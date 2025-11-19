import axios from "axios";
import { Session } from "../models/Session";

const API_URL = import.meta.env.VITE_API_URL + "/api/sessions";

class SessionService {
  async getSessions(): Promise<Session[]> {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (error) {
      console.error("Error al obtener sesiones:", error);
      return [];
    }
  }

  async getSessionById(id: string): Promise<Session | null> {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error al obtener sesión:", error);
      return null;
    }
  }

  async createSession(userId: number, session: Session): Promise<Session | null> {
    try {
      const res = await axios.post(`${API_URL}/user/${userId}`, session, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (error) {
      console.error("Error al crear sesión:", error);
      return null;
    }
  }

  async updateSession(id: string, session: Session): Promise<boolean> {
    try {
      const res = await axios.put(`${API_URL}/${id}`, session, {
        headers: { "Content-Type": "application/json" },
      });
      return res.status === 200;
    } catch (error) {
      console.error("Error al actualizar sesión:", error);
      return false;
    }
  }

  async deleteSession(id: number): Promise<boolean> {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      return res.status === 200;
    } catch (error) {
      console.error("Error al eliminar sesión:", error);
      return false;
    }
  }
}

export const sessionService = new SessionService();

import axios from "axios";
import { SecurityQuestion } from "../models/SecurityQuestion";

const API_URL = import.meta.env.VITE_API_URL + "/api/security-questions";

class SecurityQuestionService {
  async getSecurityQuestions(): Promise<SecurityQuestion[]> {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
      return [];
    }
  }

  async getSecurityQuestionById(id: number): Promise<SecurityQuestion | null> {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error al obtener la pregunta:", error);
      return null;
    }
  }

  async createSecurityQuestion(question: SecurityQuestion): Promise<SecurityQuestion | null> {
    try {
      const res = await axios.post(API_URL, question, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (error) {
      console.error("Error al crear pregunta:", error);
      return null;
    }
  }

  async updateSecurityQuestion(id: number, question: SecurityQuestion): Promise<boolean> {
    try {
      const res = await axios.put(`${API_URL}/${id}`, question, {
        headers: { "Content-Type": "application/json" },
      });
      return res.status === 200;
    } catch (error) {
      console.error("Error al actualizar pregunta:", error);
      return false;
    }
  }

  // Eliminar una security question
  async deleteSecurityQuestion(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar pregunta de seguridad:", error);
      return false;
    }
  }
}

export const securityQuestionService = new SecurityQuestionService();

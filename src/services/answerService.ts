import axios from "axios";
import { Answer } from "../models/Answer";

const API_URL = import.meta.env.VITE_API_URL + "/api/answers";

class AnswerService {
  /**
   * Obtener todas las respuestas
   */
  async getAnswers(): Promise<Answer[]> {
    try {
      const response = await axios.get<Answer[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener respuestas:", error);
      return [];
    }
  }

  /**
   * Obtener respuesta por id
   */
  async getAnswerById(id: number): Promise<Answer | null> {
    try {
      const response = await axios.get<Answer>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener respuestas:", error);
      return null;
    }
  }

  /**
   * Crear una nueva respuesta (requiere userId y questionId)
   */
  async createAnswer(userId: number, questionId: number, content: string): Promise<Answer | null> {
    try {
      const response = await axios.post<Answer>(
        `${API_URL}/user/${userId}/question/${questionId}`,
        { content },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear respuesta:", error);
      return null;
    }
  }

  async updateAnswer(id: number, data: Partial<Answer>): Promise<Answer> {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }

  /**
   * Eliminar una respuesta
   */
  async deleteAnswer(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar respuesta:", error);
      return false;
    }
  }
}

export const answerService = new AnswerService();

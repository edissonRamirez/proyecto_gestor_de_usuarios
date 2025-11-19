import axios from "axios";
import { Device } from "../models/Device";

const API_URL = import.meta.env.VITE_API_URL + "/api/devices";

class DeviceService {
  /**
   * Obtener todos los dispositivos
   */
  async getDevices(): Promise<Device[]> {
    try {
      const response = await axios.get<Device[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener dispositivos:", error);
      return [];
    }
  }

  async getDeviceById(id: number): Promise<Device | null> {
        try {
            const response = await axios.get<Device>(`${API_URL}/${id}`)
            return response.data;
        } catch (error) {
            console.error("Error al obtener el dispositivo con id: ", id);
            return null
        }
    }

  /**
   * Crear un nuevo dispositivo
   */
  async createDevice(userId: number, deviceData: Partial<Device>): Promise<Device | null> {
    try {
      const response = await axios.post<Device>(
        `${API_URL}/user/${userId}`,
        deviceData,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear dispositivo:", error);
      return null;
    }
  }

  async updateDevice(id: number, device: Device) {

    try {
      const response = await axios.put(`${API_URL}/${id}`, device, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear dispositivo:", error);
      return null;
    }
  }


  /**
   * Eliminar un dispositivo
   */
  async deleteDevice(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar dispositivo:", error);
      return false;
    }
  }
}

export const deviceService = new DeviceService();

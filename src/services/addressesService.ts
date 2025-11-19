import axios from "axios";
import { Address } from "../models/Address";

const API_URL = import.meta.env.VITE_API_URL + "/api/addresses" || "";

class AddressesService {
    // Obtener todas las direcciones
    async getAddresses(): Promise<Address[]> {
        try{
            const response = await axios.get<Address[]>(`${API_URL}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener direcciones: ", error);
            return []
        }
    }

    // Obtener una dirección por ID
    async getAddressById(id: number): Promise<Address | null> {
        try {
            const response = await axios.get<Address>(`${API_URL}/${id}`)
            return response.data;
        } catch (error) {
            console.error("Error al obtener la dirección con id: ", id);
            return null
        }
    }

    async createAddress(address: Omit<Address, "id">): Promise<Address | null> {
        try{
            const response = await axios.post<Address>(`${API_URL}/user/${address.user_id}`, address);
            return response.data;
        } catch (error) {
            console.error("Error al crear la dirección: ", error);
            return null;
        }
    }

    // Actualizar una dirección existente
    async updateAddress(id: number, address: Partial<Address>): Promise<Address | null> {
        try {
            const response = await axios.put<Address>(`${API_URL}/${id}`, address);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar la dirección:", error);
            return null;
        }
    }

    // Eliminar una dirección
    async deleteAddress(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar la dirección:", error);
            return false;
        }
    }
}

export const addressService = new AddressesService();
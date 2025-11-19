// src/pages/Devices/CreateDevicePage.tsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { Device } from "../../models/Device";
import { deviceService } from "../../services/deviceService";
import { userService } from "../../services/userService";
import { User } from "../../models/User";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const CreateDevicePage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { design } = useDesign();

  // 🔥 Formulario dinámico según la librería seleccionada
  const FormComponent =
    design === "tailwind"
      ? CreateOrUpdateValidator
      : CreateOrUpdateValidatorBootstrap;

  // 🔹 Cargar lista de usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    };
    fetchUsers();
  }, []);

  // 🔹 Esquema de validación
  const deviceValidationSchema = Yup.object({
    name: Yup.string()
      .required("El nombre del dispositivo es obligatorio")
      .min(3, "Debe tener al menos 3 caracteres")
      .max(50, "No puede superar los 50 caracteres"),

    ip: Yup.string()
      .required("La dirección IP es obligatoria")
      .matches(
        /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
        "Debe ser una dirección IP válida"
      ),

    operating_system: Yup.string()
      .required("El sistema operativo es obligatorio")
      .min(3, "Debe tener al menos 3 caracteres")
      .max(50, "No puede superar los 50 caracteres"),
  });

  // 🔹 Lógica de creación
  const handleCreateDevice = async (device: Device) => {
    if (!selectedUserId) {
      Swal.fire({
        title: "Error",
        text: "Por favor selecciona un usuario.",
        icon: "warning",
      });
      return;
    }

    try {
      const created = await deviceService.createDevice(
        selectedUserId,
        device
      );

      if (created) {
        Swal.fire({
          title: "Completado ✅",
          text: "El dispositivo ha sido creado correctamente",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
        navigate("/api/devices");
      } else {
        Swal.fire({
          title: "Error ❌",
          text: "No se pudo crear el dispositivo",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al crear dispositivo:", error);
      Swal.fire({
        title: "Error ❌",
        text: "Ocurrió un problema al crear el dispositivo",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Crear Dispositivo" />

      {/* 🔹 Selector de usuario */}
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-md p-4 mb-6">
        <label
          htmlFor="userSelect"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Selecciona un usuario
        </label>
        <select
          id="userSelect"
          className="w-full border rounded-md p-2"
          value={selectedUserId ?? ""}
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
        >
          <option value="">-- Selecciona un usuario --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Formulario principal */}
      <FormComponent<Device>
        mode={1}
        title="Formulario de Creación de Dispositivo"
        fields={[
          { name: "name", label: "Nombre del Dispositivo", type: "text" },
          { name: "ip", label: "Dirección IP", type: "text" },
          { name: "operating_system", label: "Sistema Operativo", type: "text" },
        ]}
        validationSchema={deviceValidationSchema}
        handleCreate={handleCreateDevice}
      />
    </div>
  );
};

export default CreateDevicePage;

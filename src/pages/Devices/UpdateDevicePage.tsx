import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { Device } from "../../models/Device";
import { deviceService } from "../../services/deviceService";
import { userService } from "../../services/userService";
import { User } from "../../models/User";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const UpdateDevicePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState<Device | null>(null);
  const [userName, setUserName] = useState<string>("");
  
  const { design } = useDesign();

  // 🔥 Formulario dinámico según la librería seleccionada
  const FormComponent =
    design === "tailwind"
      ? CreateOrUpdateValidator
      : CreateOrUpdateValidatorBootstrap;

  // 🔹 Cargar datos del dispositivo
  useEffect(() => {
    const fetchDevice = async () => {
      if (!id) return;

      try {
        const deviceData = await deviceService.getDeviceById(parseInt(id));
        if (!deviceData) {
          setDevice(null);
          return;
        }
        setDevice(deviceData);

        if (deviceData.user_id) {
          const userData = await userService.getUserById(deviceData.user_id);
          setUserName(userData?.name ?? "Desconocido");
        }
      } catch (error) {
        console.error("Error cargando el dispositivo:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar el dispositivo",
          icon: "error",
        });
      }
    };

    fetchDevice();
  }, [id]);

  // 🔹 Validaciones con Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("El nombre del dispositivo es obligatorio")
      .min(3, "Debe tener al menos 3 caracteres")
      .max(50, "No puede superar los 50 caracteres"),

    ip: Yup.string()
      .required("La dirección IP es obligatoria"),

    operating_system: Yup.string()
      .required("El sistema operativo es obligatorio")
      .min(3, "Debe tener al menos 3 caracteres")
      .max(50, "No puede superar los 50 caracteres"),
  });

  // 🔹 Actualizar dispositivo
  const handleUpdateDevice = async (updatedDevice: Device) => {
    try {
      if (!device?.id) return;

      const result = await deviceService.updateDevice(device.id, updatedDevice);

      if (result) {
        Swal.fire({
          title: "Actualizado ✅",
          text: "El dispositivo se actualizó correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/api/devices");
      } else {
        Swal.fire({
          title: "Error ❌",
          text: "No se pudo actualizar el dispositivo",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar el dispositivo:", error);
      Swal.fire({
        title: "Error ❌",
        text: "Ocurrió un problema al actualizar el dispositivo",
        icon: "error",
      });
    }
  };

  if (!device) {
    return <p className="text-center mt-10 text-gray-600">Cargando dispositivo...</p>;
  }

  return (
    <div>
      <Breadcrumb pageName="Actualizar Dispositivo" />

      {/* 🔹 Mostrar usuario asociado */}
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-md p-4 mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Usuario asociado
        </label>
        <input
          type="text"
          value={userName || "Desconocido"}
          readOnly
          className="w-full border rounded-md p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
        />
      </div>

      {/* 🔹 Formulario */}
      <FormComponent<Device>
        mode={2}
        title="Formulario de Actualización de Dispositivo"
        entity={device}
        fields={[
          { name: "name", label: "Nombre del Dispositivo", type: "text" },
          { name: "ip", label: "Dirección IP", type: "text" },
          { name: "operating_system", label: "Sistema Operativo", type: "text" },
        ]}
        validationSchema={validationSchema}
        handleUpdate={handleUpdateDevice}
      />
    </div>
  );
};

export default UpdateDevicePage;

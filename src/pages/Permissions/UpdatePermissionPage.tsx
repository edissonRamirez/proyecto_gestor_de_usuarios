import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { permissionService } from "../../services/permissionService";
import { Permission } from "../../models/Permission";
import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const UpdatePermissionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [permission, setPermission] = useState<Permission | null>(null);
  const { design } = useDesign();

  // 🔥 Selector del formulario según la librería activa
  const FormComponent = design === "tailwind"
    ? CreateOrUpdateValidator
    : CreateOrUpdateValidatorBootstrap;

  // 🔹 Cargar permiso existente
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        const data = await permissionService.getPermissionById(parseInt(id));
        setPermission(data);
      } catch (error) {
        console.error("Error al cargar permiso:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar el permiso.",
          icon: "error",
        });
      }
    };

    loadData();
  }, [id]);

  // 🔹 Esquema de validación
  const validationSchema = Yup.object({
    url: Yup.string()
      .required("La URL es obligatoria")
      .min(3, "Debe tener al menos 3 caracteres"),
    method: Yup.string()
      .required("El método es obligatorio")
      .oneOf(["GET", "POST", "PUT", "DELETE"], "Método inválido"),
  });

  // 🔹 Lógica de actualización
  const handleUpdatePermission = async (values: Permission) => {
    try {
      if (!permission?.id) return;

      const updated = await permissionService.updatePermission(permission.id, values);

      if (updated) {
        Swal.fire({
          title: "✅ Actualizado",
          text: "El permiso se actualizó correctamente.",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
        navigate("/api/permissions");
      } else {
        Swal.fire({
          title: "❌ Error",
          text: "No se pudo actualizar el permiso.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar permiso:", error);
      Swal.fire({
        title: "❌ Error",
        text: "Ocurrió un problema al actualizar el permiso.",
        icon: "error",
      });
    }
  };

  if (!permission)
    return <p className="text-center mt-10 text-gray-600">Cargando datos...</p>;

  return (
    <div>
      <Breadcrumb pageName="Actualizar Permiso" />

      <FormComponent<Permission>
        mode={2}
        title="Formulario de Actualización de Permiso"
        entity={permission}
        fields={[
          { name: "url", label: "URL", type: "text", required: true },
          { name: "method", label: "Método HTTP", type: "text", required: true },
        ]}
        validationSchema={validationSchema}
        handleUpdate={handleUpdatePermission}
      />
    </div>
  );
};

export default UpdatePermissionPage;

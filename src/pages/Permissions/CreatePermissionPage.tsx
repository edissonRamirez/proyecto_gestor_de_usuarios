// src/pages/Permissions/CreatePermissionPage.tsx
import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { permissionService } from "../../services/permissionService";
import { Permission } from "../../models/Permission";
import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const CreatePermissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { design } = useDesign();

  // 🔥 Selector del formulario según la librería activa
  const FormComponent = design === "tailwind"
    ? CreateOrUpdateValidator
    : CreateOrUpdateValidatorBootstrap;

  const handleCreatePermission = async (values: Permission) => {
    try {
      const created = await permissionService.createPermission(values);
      if (created) {
        Swal.fire({
          title: "✅ Permiso creado",
          text: "El permiso se ha registrado correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/api/permissions");
      } else {
        Swal.fire({
          title: "❌ Error",
          text: "No se pudo crear el permiso.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al crear permiso:", error);
      Swal.fire({
        title: "❌ Error",
        text: "Ocurrió un problema al crear el permiso.",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Crear Permiso" />

      <FormComponent<Permission>
        mode={1}
        title="Formulario de Creación de Permiso"
        fields={[
          { name: "url", label: "URL", type: "text", required: true },
          { name: "method", label: "Método HTTP", type: "text", required: true },
          { name: "entity", label: "Entidad Asociada", type: "text", required: true },
        ]}
        validationSchema={Yup.object({
          url: Yup.string().required("La URL es obligatoria"),
          method: Yup.string().required("El método es obligatorio"),
          entity: Yup.string().required("La entidad es obligatoria"),
        })}
        handleCreate={handleCreatePermission}
      />
    </div>
  );
};

export default CreatePermissionPage;

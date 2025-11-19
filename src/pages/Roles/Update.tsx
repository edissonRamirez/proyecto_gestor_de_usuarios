import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator, {
  FieldConfig, // ✅ Importamos la interfaz exportada del componente genérico
} from "../../components/CreateOrUpdateValidator";

import * as Yup from "yup";
import { Role } from "../../models/Role";
import { roleService } from "../../services/roleService";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const UpdateRole: React.FC = () => {
  const { id } = useParams(); // Obtiene el ID de la URL
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const { design } = useDesign();

  // 🔥 Selector del formulario según la librería activa
  const FormComponent =
    design === "tailwind" 
    ? CreateOrUpdateValidator 
    : CreateOrUpdateValidatorBootstrap;

  // 🔹 Cargar los datos del usuario al montar
  useEffect(() => {
    const fetchRole = async () => {
      if (!id) return;
      const data = await roleService.getRoleById(parseInt(id));
      setRole(data);
    };
    fetchRole();
  }, [id]);

  // 🔹 Campos del formulario
  const fields: FieldConfig[] = [
    { name: "name", label: "Nombre", type: "text" },
    { name: "description", label: "Descripción", type: "text" },
  ];

  // 🔹 Esquema de validación compatible con CreateOrUpdateValidator (mapa por campo)
  const validationSchema = Yup.object({
  name: Yup.string()
    .required("El nombre es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),
  description: Yup.string()
    .required("La descripción es obligatoria")
    .min(3, "Debe tener al menos 3 caracteres")
  });

  // 🔹 Lógica de actualización
  const handleUpdateRole = async (values: Role) => {
    if (!id) {
      console.error("❌ No se encontró el ID del usuario en la URL");
      return;
    }

    const roleId = parseInt(id); // lo conviertes a número
    try {
      const updated = await roleService.updateRole(roleId, values);
      if (updated) {
        Swal.fire({
          title: "Completado",
          text: "El rol ha sido actualizado correctamente ✅",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
        navigate("/api/roles");
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo actualizar el rol ❌",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar el rol ❌",
        icon: "error",
      });
    }
  };

  if (!role) return <div className="text-center py-10">Cargando rol...</div>;

  // 🔹 Render del formulario genérico
  return (
    <div>
      <Breadcrumb pageName="Actualizar Rol" />

      <FormComponent<Role>
        mode={2} // 2 = modo actualizar
        title="Formulario de Actualización de Rol"
        fields={fields}
        validationSchema={validationSchema}
        handleUpdate={handleUpdateRole}
        entity={role}
      />
    </div>
  );
};

export default UpdateRole;

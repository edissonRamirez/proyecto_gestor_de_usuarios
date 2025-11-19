import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { userRoleService } from "../../services/userRoleService";
import { UserRole } from "../../models/UserRole";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";
import { useDesign } from "../../context/DesignContext";

const UpdateUserRolePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const { design } = useDesign();
  // 🔥 Selector del formulario según la librería activa
    const FormComponent = design === "tailwind"
        ? CreateOrUpdateValidator
        : CreateOrUpdateValidatorBootstrap;

  // 🔹 Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const userRoleData = await userRoleService.getUserRoleById(id);

        // ✅ Formatear fechas a "YYYY-MM-DD" para que sean válidas en los inputs tipo date
        const formatDate = (dateString?: string) => {
          if (!dateString) return "";
          const d = new Date(dateString);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        userRoleData.startAt = formatDate(userRoleData.startAt);
        userRoleData.endAt = formatDate(userRoleData.endAt!);

        setUserRole(userRoleData);

      } catch (error) {
        console.error("Error al cargar los datos:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los datos del rol de usuario.",
          icon: "error",
        });
      }
    };

    loadData();
  }, [id]);

  // 🔹 Validaciones con Yup
  const validationSchema = Yup.object({
    startAt: Yup.date().required("La fecha de inicio es obligatoria"),
    endAt: Yup.date()
      .nullable()
      .min(Yup.ref("startAt"), "La fecha de fin no puede ser anterior a la de inicio"),
  });

  // 🔹 Manejo de actualización
  const handleUpdateUserRole = async (values: UserRole) => {
    try {
      if (!userRole?.id) return;
      const updated = await userRoleService.updateUserRole(userRole.id, values);

      if (updated) {
        Swal.fire({
          title: "✅ Actualizado",
          text: "La asignación de rol se actualizó correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/api/user-roles");
      } else {
        Swal.fire({
          title: "❌ Error",
          text: "No se pudo actualizar el registro.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire({
        title: "❌ Error",
        text: "Ocurrió un problema al actualizar la asignación.",
        icon: "error",
      });
    }
  };

  if (!userRole) {
    return <p className="text-center mt-10 text-gray-600">Cargando datos...</p>;
  }

  return (
    <div>
      <Breadcrumb pageName="Actualizar Rol de Usuario" />

      <FormComponent<UserRole>
        mode={2}
        title="Formulario de Actualización de Rol de Usuario"
        entity={userRole}
        fields={[
          { name: "user_id", label: "Usuario", type: "text", readOnly: true },
          { name: "role_id", label: "Rol", type: "text", readOnly: true },
          { name: "startAt", label: "Fecha de Inicio", type: "date", required: true },
          { name: "endAt", label: "Fecha de Fin", type: "date" },
        ]}
        validationSchema={validationSchema}
        handleUpdate={handleUpdateUserRole}
      />
    </div>
  );
};

export default UpdateUserRolePage;

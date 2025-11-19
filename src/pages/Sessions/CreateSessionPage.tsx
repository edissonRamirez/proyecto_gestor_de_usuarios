import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { Session } from "../../models/Session";
import { User } from "../../models/User";
import { sessionService } from "../../services/sessionsService";
import { userService } from "../../services/userService";
import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";
import { useDesign } from "../../context/DesignContext";

const CreateSessionPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const { design } = useDesign();
  // 🔥 Selector del formulario según la librería activa
  const FormComponent = design === "tailwind"
    ? CreateOrUpdateValidator
    : CreateOrUpdateValidatorBootstrap;

  // 🔹 Cargar usuarios para el select
  useEffect(() => {
    const loadUsers = async () => {
      const usersData = await userService.getUsers();
      setUsers(usersData);
    };
    loadUsers();
  }, []);

  // 🔹 Esquema de validación con Yup
  const validationSchema = Yup.object({
    token: Yup.string()
      .required("El token es obligatorio")
      .min(10, "El token debe tener al menos 10 caracteres"),
    expiration: Yup.date()
      .required("La fecha de expiración es obligatoria")
      .typeError("Debe ingresar una fecha válida"),
    FACode: Yup.string()
      .required("El código FA es obligatorio")
      .min(4, "El código FA debe tener al menos 4 caracteres"),
    state: Yup.string()
      .required("El estado es obligatorio")
      .oneOf(["active", "not-active"], "Debe ser active o not-active"),
      user_id: Yup.number().required("Debe seleccionar un usuario"),
  });

    const formatDateToSQL = (date: Date | string) => {
        const d = new Date(date);
        const pad = (n: number) => (n < 10 ? "0" + n : n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
            d.getHours()
        )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    // 🔹 Lógica para crear sesión
    const handleCreateSession = async (session: Session) => {
        try {
            // Convertir la fecha al formato SQL aceptado por Flask
            const formattedSession: Session = {
                ...session,
                expiration: formatDateToSQL(session.expiration!),
            };

      const response = await sessionService.createSession(session.user_id!, formattedSession);

      if (response) {
        Swal.fire({
          title: "✅ Creada correctamente",
          text: "La sesión fue creada exitosamente.",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
        navigate("/api/sessions");
      } else {
        Swal.fire({
          title: "❌ Error",
          text: "No se pudo crear la sesión.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al crear sesión:", error);
      Swal.fire({
        title: "❌ Error",
        text: "Hubo un problema al crear la sesión.",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-6">
      <Breadcrumb pageName="Crear Sesión" />
      <FormComponent<Session>
        mode={1}
        title="Formulario de Creación de Sesión"
        fields={[
          { name: "token", label: "Token", type: "text" },
          { name: "expiration", label: "Fecha de Expiración", type: "date" },
          { name: "FACode", label: "Código FA", type: "text" },
          { name: "state", label: "Estado (active / not-active)", type: "text" },
          {
            name: "user_id",
            label: "Usuario",
            type: "select",
            options: users.map((u) => ({ label: u.name ? u.name : "Usuario " + u.id, value: u.id! })),
          },
        ]}
        validationSchema={validationSchema}
        handleCreate={handleCreateSession}
      />
    </div>
  );
};

export default CreateSessionPage;

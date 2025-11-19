import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import { Session } from "../../models/Session";
import { sessionService } from "../../services/sessionsService";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import Breadcrumb from "../../components/Breadcrumb";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const UpdateSessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const { design } = useDesign();
  const FormComponent = design === "tailwind"
    ? CreateOrUpdateValidator
    : CreateOrUpdateValidatorBootstrap;

  // 🔧 Helper para formatear fechas a formato SQL
  const formatDateToSQL = (date: Date | string) => {
    const d = new Date(date);
    const pad = (n: number) => (n < 10 ? "0" + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      const sessionData = await sessionService.getSessionById(id);

      // ✅ Convertir expiration a formato compatible con input[type="date"]
      if (sessionData?.expiration) {
        const d = new Date(sessionData.expiration);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        sessionData.expiration = `${yyyy}-${mm}-${dd}`;
      }

      // ✅ Asegurar que no haya campos undefined (Formik necesita valores definidos)
      const safeSession = {
        token: sessionData?.token ?? "",
        expiration: sessionData?.expiration ?? "",
        FACode: sessionData?.FACode ?? "",
        state: sessionData?.state ?? "",
        user_id: sessionData?.user_id ?? 0,
      };

      setSession(safeSession as Session);
    };

    loadData();
  }, [id]);

  // ✅ Handler con conversión de campos antes de enviar al backend
  const handleUpdateSession = async (values: Session) => {
    try {
      if (!id) return;

      // 🧩 Renombrar faCode → FACode (Flask lo espera en mayúscula)
      const formattedSession = {
        ...values,
        FACode: values.FACode, // backend usa esta versión
        expiration: formatDateToSQL(values.expiration!),
      };

      const updated = await sessionService.updateSession(id, formattedSession);

      if (updated) {
        Swal.fire({
          title: "✅ Sesión actualizada",
          text: "Los datos se actualizaron correctamente.",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
        navigate("/api/sessions");
      } else {
        Swal.fire({
          title: "❌ Error",
          text: "No se pudo actualizar la sesión.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar sesión:", error);
      Swal.fire({
        title: "❌ Error",
        text: "Hubo un problema al actualizar la sesión.",
        icon: "error",
      });
    }
  };

  if (!session) return <p className="text-center text-gray-500">Cargando sesión...</p>;

  return (
    <div>
      <Breadcrumb pageName="Actualizar Sesión" />
      <h2 className="text-2xl font-bold text-graydark mb-6 text-center">
        Actualizar Sesión
      </h2>

      <FormComponent<Session>
        mode={2}
        title="Formulario de Actualización de Sesión"
        entity={session}
        fields={[
          { name: "token", label: "Token", type: "text", required: true },
          { name: "expiration", label: "Fecha de Expiración", type: "date", required: true },
          { name: "FACode", label: "FA Code", type: "text" },
          { name: "state", label: "Estado", type: "text" },
          { name: "user_id", label: "Usuario", type: "number", readOnly: true },
        ]}
        validationSchema={Yup.object({
          token: Yup.string().required("El token es obligatorio"),
          expiration: Yup.date().required("La fecha de expiración es obligatoria"),
          faCode: Yup.string().nullable(),
          state: Yup.string().required("El estado es obligatorio"),
        })}
        handleUpdate={handleUpdateSession}
      />
    </div>
  );
};

export default UpdateSessionPage;

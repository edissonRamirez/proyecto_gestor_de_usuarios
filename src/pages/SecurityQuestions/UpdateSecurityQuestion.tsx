import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

import { SecurityQuestion } from "../../models/SecurityQuestion";
import { securityQuestionService } from "../../services/securityQuestionService";
import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const UpdateSecurityQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<SecurityQuestion | null>(null);
  const { design } = useDesign();
  const FormComponent = design === "tailwind"
    ? CreateOrUpdateValidator
    : CreateOrUpdateValidatorBootstrap; 

  // 🔹 Esquema de validación con Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("El nombre de la pregunta es obligatorio")
      .min(3, "Debe tener al menos 3 caracteres")
      .max(100, "No puede tener más de 100 caracteres"),
    description: Yup.string()
      .required("La descripción es obligatoria")
      .min(5, "Debe tener al menos 5 caracteres"),
  });

  // 🔹 Cargar pregunta de seguridad
  useEffect(() => {
    const loadQuestion = async () => {
      if (!id) return;
      const data = await securityQuestionService.getSecurityQuestionById(Number(id));
      setQuestion(data);
    };
    loadQuestion();
  }, [id]);

  // 🔹 Acción al actualizar
  const handleUpdateSecurityQuestion = async (updatedQuestion: SecurityQuestion) => {
    try {
      const response = await securityQuestionService.updateSecurityQuestion(Number(id), updatedQuestion);

      if (response) {
        Swal.fire({
          title: "✅ Actualizada correctamente",
          text: "La pregunta de seguridad fue actualizada exitosamente.",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
        navigate("/api/security-questions");
      } else {
        Swal.fire({
          title: "❌ Error",
          text: "No se pudo actualizar la pregunta de seguridad.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar pregunta de seguridad:", error);
      Swal.fire({
        title: "❌ Error",
        text: "Hubo un problema al actualizar la pregunta de seguridad.",
        icon: "error",
      });
    }
  };

  if (!question) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="p-6">
      <Breadcrumb pageName="Actualizar Pregunta de Seguridad" />
      <FormComponent<SecurityQuestion>
        mode={2}
        title="Formulario de Actualización de Pregunta de Seguridad"
        fields={[
          { name: "name", label: "Nombre de la Pregunta", type: "text" },
          { name: "description", label: "Descripción", type: "textarea" },
        ]}
        validationSchema={validationSchema}
        handleUpdate={handleUpdateSecurityQuestion}
        entity={question}
      />
    </div>
  );
};

export default UpdateSecurityQuestionPage;

import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { SecurityQuestion } from "../../models/SecurityQuestion";
import { securityQuestionService } from "../../services/securityQuestionService";
import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";
import { useDesign } from "../../context/DesignContext";

const CreateSecurityQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const { design } = useDesign();
  // 🔥 Selector del formulario según la librería activa
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

  // 🔹 Acción al crear
  const handleCreateSecurityQuestion = async (question: SecurityQuestion) => {
    try {
      const response = await securityQuestionService.createSecurityQuestion(question);

      if (response) {
        Swal.fire({
          title: "✅ Creada correctamente",
          text: "La pregunta de seguridad fue creada exitosamente.",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
        navigate("/api/security-questions");
      } else {
        Swal.fire({
          title: "❌ Error",
          text: "No se pudo crear la pregunta de seguridad.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al crear pregunta de seguridad:", error);
      Swal.fire({
        title: "❌ Error",
        text: "Hubo un problema al crear la pregunta de seguridad.",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-6">
      <Breadcrumb pageName="Crear Pregunta de Seguridad" />
      <FormComponent<SecurityQuestion>
        mode={1}
        title="Formulario de Creación de Pregunta de Seguridad"
        fields={[
          { name: "name", label: "Nombre de la Pregunta", type: "text" },
          { name: "description", label: "Descripción", type: "textarea" },
        ]}
        validationSchema={validationSchema}
        handleCreate={handleCreateSecurityQuestion}
      />
    </div>
  );
};

export default CreateSecurityQuestionPage;

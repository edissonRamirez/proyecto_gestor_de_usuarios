import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import { answerService } from "../../services/answerService";
import { userService } from "../../services/userService";
import { securityQuestionService } from "../../services/securityQuestionService";
import { Answer } from "../../models/Answer";
import { User } from "../../models/User";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const CreateAnswersPage: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<SecurityQuestion[]>([]);
  const { design } = useDesign();

  // 🔥 Selector del formulario según la librería activa
    const FormComponent = design === "tailwind"
        ? CreateOrUpdateValidator
        : CreateOrUpdateValidatorBootstrap;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const usersData = await userService.getUsers();
    const questionsData = await securityQuestionService.getSecurityQuestions();
    setUsers(usersData || []);
    setQuestions(questionsData || []);
  };

  const validationSchema = Yup.object({
    content: Yup.string()
      .required("La respuesta es obligatoria")
      .min(3, "Debe tener al menos 3 caracteres"),
    user_id: Yup.number().required("Debe seleccionar un usuario"),
    security_question_id: Yup.number().required("Debe seleccionar una pregunta"),
  });

  const handleCreateAnswer = async (values: Answer) => {
    try {
      const response = await answerService.createAnswer(values.user_id!, values.security_question_id!, values.content);
      if (response) {
        Swal.fire({
          title: "Éxito ✅",
          text: "La respuesta se ha creado correctamente",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
        navigate("/api/answers");
      } else {
        Swal.fire({
          title: "Error ❌",
          text: "No se pudo crear la respuesta",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al crear respuesta:", error);
      Swal.fire({
        title: "Error ❌",
        text: "Ocurrió un problema al crear la respuesta",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Crear Respuesta de Seguridad" />
    <FormComponent<Answer>
              mode={1}
              title="Formulario de Creación de Respuesta"
              fields={[
                  {
                name: "user_id",
                label: "Usuario",
                type: "select",
                options: users.map(u => ({ value: u.id!, label: u.name ?? "" })),
                readOnly: false,
            },
            {
                name: "security_question_id",
                label: "Pregunta de Seguridad",
                type: "select",
                options: questions.map(q => ({ value: q.id!, label: q.name ?? "" }))
            },
            { name: "content", label: "Contenido", type: "textarea" }
    ]}
    validationSchema={validationSchema}
    handleCreate={handleCreateAnswer}
    />

    </div>
  );
};

export default CreateAnswersPage;

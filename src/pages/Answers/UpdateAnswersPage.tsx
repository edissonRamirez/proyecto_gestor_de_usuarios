import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { answerService } from "../../services/answerService";
import { userService } from "../../services/userService";
import { securityQuestionService } from "../../services/securityQuestionService";
import { Answer } from "../../models/Answer";
import { User } from "../../models/User";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const UpdateAnswersPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [answer, setAnswer] = useState<Answer | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<SecurityQuestion[]>([]);
  const { design } = useDesign();

  // 🔥 Selector del formulario según la librería activa
    const FormComponent = design === "tailwind"
        ? CreateOrUpdateValidator
        : CreateOrUpdateValidatorBootstrap;

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    // ⚡ Cargamos todo simultáneamente
    const [answerData, usersData, questionsData] = await Promise.all([
      answerService.getAnswerById(Number(id)),
      userService.getUsers(),
      securityQuestionService.getSecurityQuestions(),
    ]);

    if (!answerData) {
      // No se encontró la respuesta; dejamos el estado en null y salimos
      setAnswer(null);
      return;
    }

    // Establecemos la respuesta tal cual; aseguramos el tipo con un casteo
    setAnswer(answerData as Answer);

    setUsers(usersData || []);
    setQuestions(questionsData || []);
    console.log("AnswerData: ", answerData);
    console.log("UsersData: ", usersData);
    console.log("QuestionsData: ", questionsData);
    
  };

  const validationSchema = Yup.object({
    content: Yup.string()
      .required("La respuesta es obligatoria")
      .min(3, "Debe tener al menos 3 caracteres"),
  });

  const handleUpdateAnswer = async (updatedAnswer: Answer) => {
    try {
      if (!answer?.id) return;
      const result = await answerService.updateAnswer(answer.id, updatedAnswer);

      if (result) {
        Swal.fire({
          title: "Actualizado ✅",
          text: "La respuesta se ha actualizado correctamente",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
        navigate("/api/answers");
      } else {
        Swal.fire({
          title: "Error ❌",
          text: "No se pudo actualizar la respuesta",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar la respuesta:", error);
      Swal.fire({
        title: "Error ❌",
        text: "Ocurrió un problema al actualizar la respuesta",
        icon: "error",
      });
    }
  };

  if (!answer) {
    return <p className="text-center mt-10 text-gray-600">Cargando respuesta...</p>;
  }

  return (
    <div>
      <Breadcrumb pageName="Actualizar Respuesta" />
      <h2 className="text-2xl font-bold text-graydark mb-6">Actualizar Respuesta</h2>

      <FormComponent<Answer>
        mode={2}
        title="Formulario de Actualización de Respuesta"
        entity={answer}
        fields={[
          { name: "content", label: "Contenido", type: "textarea" },
          {
            name: "user_id",
            label: "Usuario",
            type: "select",
            options: users.map((u) => ({ value: String(u.id), label: u.name ?? "" })),
            readOnly: true,
          },
          {
            name: "security_question_id",
            label: "Pregunta de Seguridad",
            type: "select",
            options: questions.map((q) => ({ value: String(q.id), label: q.name ?? "" })),
            readOnly: true,
          },
        ]}
        validationSchema={validationSchema}
        handleUpdate={handleUpdateAnswer}
      />
    </div>
  );
};

export default UpdateAnswersPage;

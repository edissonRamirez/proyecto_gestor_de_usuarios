import { useEffect, useState } from "react";
import { Answer } from "../../models/Answer";
import { answerService } from "../../services/answerService";
import { userService } from "../../services/userService";
import { securityQuestionService } from "../../services/securityQuestionService";
import GenericTable from "../../components/GenericTable";
import { useNavigate } from "react-router";
import GenericTableBootstrap from "../../components/GenericTableBootstrap";
import { useDesign } from "../../context/DesignContext";

const ListAnswersPage: React.FC = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const navigate = useNavigate();
  const { design } = useDesign();

  // 🔥 Selector según la librería
  const TableComponent =
      design === "tailwind" 
      ? GenericTable 
      : GenericTableBootstrap;

  useEffect(() => {
    loadAnswers();
  }, []);

  const loadAnswers = async () => {
    const answersData = await answerService.getAnswers();
    const users = await userService.getUsers();
    const questions = await securityQuestionService.getSecurityQuestions();

    // Unimos los datos de usuario y pregunta con cada respuesta
    const enriched = answersData.map((a) => ({
      ...a,
      user_name: users.find((u) => u.id === a.user_id)?.name || "Desconocido",
      question_name:
        questions.find((q) => q.id === a.security_question_id)?.name ||
        "Pregunta no encontrada",
    }));

    setAnswers(enriched);
  };

  const handleAction = (action: string, item: Record<string, any>) => {
    if (action === "edit") {
      console.log("Edit answer:", item);
      navigate(`/api/answers/${item.id}`);
    } else if (action === "delete" && item.id) {
      console.log("Delete answer:", item);
      handleDelete(item.id);
      // Aquí más adelante puedes agregar confirmación y eliminación real
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar esta respuesta?")) {
      const success = await answerService.deleteAnswer(id);
      if (success) {
        alert("Respuesta eliminada correctamente ✅");
        loadAnswers();
      } else {
        alert("Error al eliminar la respuesta ❌");
      }
    }
  };

  return (
    <div className="p-6">

      <TableComponent
        name="Security Answers List"
        entity="answers"
        data={answers}
        columns={["id", "user_name", "question_name", "content", "created_at"]}
        actions={[
          { name: "edit", label: "✏️ Update" },
          { name: "delete", label: "🗑️ Delete" },
        ]}
        onAction={handleAction}
      />
    </div>
  );
};

export default ListAnswersPage;

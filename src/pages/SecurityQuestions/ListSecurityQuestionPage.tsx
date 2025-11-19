import { useEffect, useState } from "react";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { securityQuestionService } from "../../services/securityQuestionService";
import GenericTable from "../../components/GenericTable";
import { useNavigate } from "react-router-dom";
import { useDesign } from "../../context/DesignContext";
import GenericTableBootstrap from "../../components/GenericTableBootstrap";

const ListSecurityQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<SecurityQuestion[]>([]);
  const navigate = useNavigate();
  const { design } = useDesign();
  // 🔥 Selector según la librería
  const TableComponent =
      design === "tailwind" 
      ? GenericTable 
      : GenericTableBootstrap;

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const data = await securityQuestionService.getSecurityQuestions();
    setQuestions(data);
  };

  const handleAction = (action: string, item: Record<string, any>) => {
    if (action === "edit") {
      console.log("Edit security question:", item);
      navigate(`/api/security-questions/${item.id}`);
    } else if (action === "delete" && item.id) {
      console.log("Delete security question:", item);
      handleDelete(item.id);
      // Aquí más adelante puedes agregar confirmación y eliminación real
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar esta pregunta de seguridad?")) {
      const success = await securityQuestionService.deleteSecurityQuestion(id);
      if (success) {
        alert("Pregunta eliminada correctamente ✅");
        loadQuestions();
      } else {
        alert("Error al eliminar la pregunta ❌");
      }
    }
  };

  return (
    <div className="p-6">
      <TableComponent<SecurityQuestion>
        name="Security Questions List"
        entity="security-questions"
        data={questions}
        columns={["id", "name", "description"]}
        actions={[{ name: "delete", label: "🗑️ Delete" }, {name: "edit", label: "✏️ Update"}]}
        onAction={handleAction}
      />
    </div>
  );
};

export default ListSecurityQuestionsPage;

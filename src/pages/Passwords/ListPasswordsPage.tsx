import { useEffect, useState } from "react";
import { Password } from "../../models/Password";
import { passwordService } from "../../services/passwordService";
import GenericTable from "../../components/GenericTable";
import { useNavigate } from "react-router-dom";
import { useDesign } from "../../context/DesignContext";
import GenericTableBootstrap from "../../components/GenericTableBootstrap";

const ListPasswordsPage: React.FC = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const navigate = useNavigate();
  const { design } = useDesign();
  // 🔥 Selector según la librería
  const TableComponent =
      design === "tailwind" 
      ? GenericTable 
      : GenericTableBootstrap;

  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = async () => {
    const data = await passwordService.getPasswords();
    setPasswords(data);
  };

  const handleAction = (action: string, item: Record<string, any>) => {
    if (action === "edit") {
      console.log("Edit password:", item);
      navigate(`/api/passwords/${item.id}`);
    } else if (action === "delete" && item.id) {
      console.log("Delete password:", item);
      handleDelete(item.id);
      // Aquí más adelante puedes agregar confirmación y eliminación real
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar esta contraseña?")) {
      const success = await passwordService.deletePassword(id);
      if (success) {
        alert("Contraseña eliminada correctamente ✅");
        loadPasswords();
      } else {
        alert("Error al eliminar la contraseña ❌");
      }
    }
  };

  return (
    <div className="p-6">
      <TableComponent
        name="List Passwords"
        entity="passwords"
        data={passwords}
        columns={[
          "id",
          "content",
          "startAt",
          "endAt",
          "created_at",
          "updated_at",
          "user_id",
        ]}
        actions={[
          { name: "edit", label: "✏️ Update" },
          { name: "delete", label: "🗑️ Delete" },
        ]}
        onAction={handleAction}
      />
    </div>
  );
};

export default ListPasswordsPage;

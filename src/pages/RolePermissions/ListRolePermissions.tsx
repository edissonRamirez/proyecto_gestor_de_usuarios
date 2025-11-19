// src/pages/RolePermissions/ListRolePermissions.tsx
import { useEffect, useState } from "react";
import { RolePermission } from "../../models/RolePermission";
import { rolePermissionService } from "../../services/rolePermissionService";
import GenericTable from "../../components/GenericTable";
import { useNavigate } from "react-router-dom";
import GenericTableBootstrap from "../../components/GenericTableBootstrap";
import { useDesign } from "../../context/DesignContext";

const ListRolePermissions: React.FC = () => {
    const navigate = useNavigate();
    const [relations, setRelations] = useState<RolePermission[]>([]);
    const { design } = useDesign();

    // 🔥 Selector según la librería
  const TableComponent =
      design === "tailwind" 
      ? GenericTable 
      : GenericTableBootstrap;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const data = await rolePermissionService.getAll();
        setRelations(data);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Seguro que deseas eliminar esta pregunta de seguridad?")) {
          const success = await rolePermissionService.deleteRolePermission(id);
          if (success) {
            alert("Pregunta eliminada correctamente ✅");
            fetchData();
          } else {
            alert("Error al eliminar la pregunta ❌");
          }
        }
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

    return (
        <div className="p-6">
            <TableComponent
                name="Role-Permissions Relations"
                entity="role-permissions"
                data={relations}
                columns={["id", "role_id", "permission_id", "created_at", "updated_at"]}
                actions={[
                    { name: "delete", label: "Delete" },
                ]}
                onAction={handleAction}
            />

        </div>
    );
};

export default ListRolePermissions;

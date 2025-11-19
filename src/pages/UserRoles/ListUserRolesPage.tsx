// src/pages/UserRoles/ListUserRolesPage.tsx
import { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { userRoleService } from "../../services/userRoleService";
import { UserRole } from "../../models/UserRole";
import { useNavigate } from "react-router-dom";
import GenericTableBootstrap from "../../components/GenericTableBootstrap";
import { useDesign } from "../../context/DesignContext";

const ListUserRolesPage: React.FC = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const navigate = useNavigate();
  const { design } = useDesign();

  // 🔥 Selector según la librería
  const TableComponent =
      design === "tailwind" 
      ? GenericTable 
      : GenericTableBootstrap;

  useEffect(() => {
    loadUserRoles();
  }, []);

  const loadUserRoles = async () => {
    const data = await userRoleService.getUserRoles();
    setUserRoles(data);
  };

  const handleAction = async (action: string, item: UserRole) => {
    if (action === "delete" && item.id) {
      const confirmed = confirm("¿Deseas eliminar esta relación?");
      if (confirmed) {
        const success = await userRoleService.deleteUserRole(item.id);
        if (success) {
          alert("✅ Relación eliminada correctamente");
          loadUserRoles();
        } else {
          alert("❌ Error al eliminar la relación");
        }
      }
    } else if (action === "edit") {
      console.log("Edit user role:", item);
      navigate(`/api/user-roles/${item.id}`);
    }
  };

  return (
    <div>
      <TableComponent<UserRole>
        name="List UserRoles"
        entity="user-roles"
        data={userRoles}
        columns={["user_id", "user_name", "role_id", "role_name", "startAt", "endAt"]}
        actions={[
                    { name: "edit", label: "✏️ Update" },
                    { name: "delete", label: "🗑️ Delete" },
                ]}
        onAction={handleAction}
      />
    </div>
  );
};

export default ListUserRolesPage;

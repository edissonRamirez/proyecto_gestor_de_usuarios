import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../components/GenericTable";
import { Role } from "../../models/Role";
import { roleService } from "../../services/roleService";
import GenericTableBootstrap from "../../components/GenericTableBootstrap";
import { useDesign } from "../../context/DesignContext";

const ListRoles: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const { design } = useDesign();

  // 🔥 Selector según la librería
  const TableComponent =
      design === "tailwind" 
      ? GenericTable 
      : GenericTableBootstrap;

  // 🔹 Cargar los roles al montar el componente
  useEffect(() => {
    console.log("Cargando roles...");
    fetchData();
  }, []);

  const fetchData = async () => {
    const roles = await roleService.getRoles();
    setRoles(roles);
  };

  const handleAction = (action: string, item: Record<string, any>) => {
    if (action === "edit") {
      console.log("Edit role:", item);
      navigate(`/api/roles/${item.id}`);
    } else if (action === "delete" && item.id) {
      console.log("Delete role:", item);
      handleDelete(item.id);
      // Aquí más adelante puedes agregar confirmación y eliminación real
    }
  };
  const handleDelete = async (id: number) => {
      if (window.confirm("Are you sure you want to delete this role?")) {
        const success = await roleService.deleteRole(id);
        if (success) {
          alert("Role deleted successfully ✅");
          fetchData();
          navigate("/api/roles");
        } else {
          alert("Error deleting role ❌");
        }
      }
    };

  return (
    <div className="p-4">

      <TableComponent<Role>
        name="Roles List"
        entity="roles"
        data={roles}
        columns={["id", "name", "description"]}
        actions={[
          { name: "edit", label: "✏️ Update" },
          { name: "delete", label: "🗑️ Delete" },
        ]}
        onAction={handleAction}
      />
    </div>
  );
};

export default ListRoles;

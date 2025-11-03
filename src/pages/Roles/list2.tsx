import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../components/GenericTable";
import { Role } from "../../models/Role";
import { roleService } from "../../services/roleService";

const ListRoles: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);

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
      navigate(`/roles/update/${item.id}`);
    } else if (action === "delete") {
      console.log("Delete role:", item);
      // Aquí más adelante puedes agregar confirmación y eliminación real
    }
  };

  return (
    <div className="p-4">

      <GenericTable
        name="Roles List"
        data={roles}
        columns={["id", "name"]}
        actions={[
          { name: "edit", label: "Edit" },
          { name: "delete", label: "Delete" },
        ]}
        onAction={handleAction}
      />
    </div>
  );
};

export default ListRoles;

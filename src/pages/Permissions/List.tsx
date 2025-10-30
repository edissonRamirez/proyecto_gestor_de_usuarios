import { useNavigate } from "react-router-dom";
import GenericTable from "../../components/GenericTable";
import { useEffect, useState } from "react";
import { Permission } from "../../models/Permission";
import { permissionService } from "../../services/permissionService";

const ListPermissions: React.FC = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // 🔹 Cargar los permisos al montar el componente
  useEffect(() => {
    console.log("Cargando permisos...");
    fetchData();
  }, []);

  const fetchData = async () => {
    const permissions = await permissionService.getPermissions();
    setPermissions(permissions);
    console.log(permissions);
    
  };

  const handleAction = (action: string, item: Record<string, any>) => {
    if (action === "edit") {
      console.log("Edit permission:", item);
      navigate(`/permissions/update/${item.id}`);
    } else if (action === "delete") {
      console.log("Delete permission:", item);
      // Aquí más adelante puedes agregar confirmación y eliminación real
    }
  };

  return (
    <div className="p-4">
      <GenericTable
        name="Permissions List"
        data={permissions}
        columns={["id", "url", "method"]}
        actions={[
          { name: "edit", label: "Edit" },
          { name: "delete", label: "Delete" },
        ]}
        onAction={handleAction}
      />
    </div>
  );
};

export default ListPermissions;
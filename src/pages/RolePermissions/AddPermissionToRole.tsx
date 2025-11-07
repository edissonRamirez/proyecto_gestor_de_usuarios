// src/pages/AddPermissionToRole.tsx
import { useEffect, useState } from "react";
import RelationForm from "../../components/RelationForm";
import { roleService } from "../../services/roleService";
import { permissionService } from "../../services/permissionService";
import { rolePermissionService } from "../../services/rolePermissionService";
import { Role } from "../../models/Role";
import { Permission } from "../../models/Permission";

const AddPermissionToRole: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const rolesData = await roleService.getRoles();
    const permissionsData = await permissionService.getPermissions();
    setRoles(rolesData);
    setPermissions(permissionsData);
  };

  const handleAssign = async (roleId: number, permissionId: number) => {
    const response = await rolePermissionService.addPermissionToRole(roleId, permissionId);
    if (response) {
      alert("✅ Permiso asignado correctamente al rol");
    } else {
      alert("❌ Error al asignar el permiso");
    }
  };

  return (
    <RelationForm
      title="Asignar Permiso a Rol"
      firstLabel="Rol"
      secondLabel="Permiso"
      firstList={roles.map((r) => ({ id: r.id, label: r.name }))}
      secondList={permissions.map((p) => ({
        id: p.id,
        label: `${p.url} - ${p.method}`,
      }))}
      onSubmit={handleAssign}
    />
  );
};

export default AddPermissionToRole;

// src/pages/UserRolesPage.tsx
import { useEffect, useState } from "react";
import RelationForm from "../../components/RelationForm";
import { userService } from "../../services/userService";
import { roleService } from "../../services/roleService";
import { userRoleService } from "../../services/userRoleService";
import { User } from "../../models/User";
import { Role } from "../../models/Role";

const UserRolesPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const usersData = await userService.getUsers();
    const rolesData = await roleService.getRoles();
    setUsers(usersData || []);
    setRoles(rolesData || []);
  };

  const handleAssignRole = async (userId: number, roleId: number) => {
    const response = await userRoleService.assignRoleToUser(userId, roleId);
    if (response) {
      alert("✅ Rol asignado correctamente al usuario");
    } else {
      alert("❌ Error al asignar el rol al usuario");
    }
  };

  return (
    <RelationForm
      title="Asignar Rol a Usuario"
      firstLabel="Usuario"
      secondLabel="Rol"
      firstList={users
        .filter((u) => u.id !== undefined)
        .map((u) => ({
          id: u.id as number,
          label: u.name ?? "Sin nombre", // <-- Valor seguro
        }))}
      secondList={roles
        .filter((r) => r.id !== undefined)
        .map((r) => ({
          id: r.id as number,
          label: r.name ?? "Sin nombre", // <-- Valor seguro
        }))}
      onSubmit={handleAssignRole}
    />
  );
};

export default UserRolesPage;

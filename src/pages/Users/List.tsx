import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GenericTable from "../../components/GenericTable";
import GenericTableBootstrap from "../../components/GenericTableBootstrap";

import { userService } from "../../services/userService";
import { profileService } from "../../services/profileService";
import { addressService } from "../../services/addressesService";
import { roleService } from "../../services/roleService";
import { userRoleService } from "../../services/userRoleService";

import { useDesign } from "../../context/DesignContext";

const ListUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { design } = useDesign();
  const [users, setUsers] = useState<any[]>([]);

  const TableComponent =
    design === "tailwind" ? GenericTable : GenericTableBootstrap;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const users = await userService.getUsers();
    const profiles = await profileService.getProfiles();
    const addresses = await addressService.getAddresses();
    const roles = await roleService.getRoles();
    const userRoles = await userRoleService.getUserRoles();

    const enriched = users.map((u) => ({
      ...u,

      // 🔥 Profile
      profile_phone: profiles.find((p) => p.user_id === u.id)?.phone ?? "—",

      // 🔥 Address
      address_street: addresses.find((a) => a.user_id === u.id)?.street ?? "—",
      address_number: addresses.find((a) => a.user_id === u.id)?.number ?? "—",

      // 🔥 Roles
      roles:
        userRoles
          .filter((ur) => ur.user_id === u.id)
          .map(
            (ur) =>
              roles.find((r) => r.id === ur.role_id)?.name // búsqueda del rol real
          )
          .filter(Boolean)
          .join(", ") || "—",
    }));

    setUsers(enriched);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    const ok = await userService.deleteUser(id);
    if (ok) {
      alert("User deleted");
      loadUsers();
    }
  };

  return (
    <div className="p-6">
      <TableComponent
        name="Users List"
        entity="users"
        data={users}
        columns={[
          "id",
          "name",
          "email",
          "profile_phone",
          "address_street",
          "address_number",
          "roles"
        ]}
        actions={[
          { name: "edit", label: "✏️ Edit" },
          { name: "delete", label: "🗑️ Delete" }
        ]}
        onAction={(action, item) => {
          if (action === "delete") handleDelete(item.id);
          if (action === "edit") navigate(`/api/users/${item.id}`);
        }}
      />
    </div>
  );
};

export default ListUsersPage;

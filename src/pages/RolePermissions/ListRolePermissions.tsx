// src/pages/RolePermissions/ListRolePermissions.tsx
import { useEffect, useState } from "react";
import { RolePermission } from "../../models/RolePermission";
import { rolePermissionService } from "../../services/rolePermissionService";
import GenericTable from "../../components/GenericTable";

const ListRolePermissions: React.FC = () => {
    const [relations, setRelations] = useState<RolePermission[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const data = await rolePermissionService.getAll();
        setRelations(data);
    };

    return (
        <div className="p-6">
            <GenericTable
                name="Relaciones Rol - Permiso"
                data={relations}
                columns={["id", "role_id", "permission_id", "created_at", "updated_at"]}
                actions={[
                    { name: "edit", label: "Edit" },
                    { name: "delete", label: "Delete" },
                ]}
            />

        </div>
    );
};

export default ListRolePermissions;

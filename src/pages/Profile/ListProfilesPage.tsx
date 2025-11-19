import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { Profile } from "../../models/Profile";
import { profileService } from "../../services/profileService";
import GenericTable from "../../components/GenericTable";
import { userService } from "../../services/userService";
import GenericTableBootstrap from "../../components/GenericTableBootstrap";
import { useDesign } from "../../context/DesignContext";

const ListProfilesPage: React.FC = () => {
    const [profiles, setProfiles] = useState<(Profile & { user_name?: string })[]>([]);
    const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
    const navigate = useNavigate();
    const { design } = useDesign();

    // 🔥 Selector según la librería
  const TableComponent =
      design === "tailwind" 
      ? GenericTable 
      : GenericTableBootstrap;

    // 🔹 Cargar datos de perfiles + usuarios
    useEffect(() => {

        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        try {
            const profilesData = await profileService.getProfiles();
            const usersData = await userService.getUsers();

            setProfiles(profilesData);
            // Normalize users: keep only entries with a defined numeric id and map to the expected shape
            setUsers(
                usersData
                    .filter((u) => typeof u.id === "number")
                    .map((u) => ({ id: u.id as number, name: u.name? u.name : 'Usuario ' + u.id }))
            );
        } catch (error) {
            console.error("Error cargando perfiles:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudieron cargar los perfiles.",
                icon: "error",
            });
        }
    };

    // 🔹 Eliminar perfil
    const handleDelete = async (id?: number) => {
        if (!id) return;

        const confirmed = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará el perfil permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmed.isConfirmed) return;

        const success = await profileService.deleteProfile(id);
        if (success) {
            Swal.fire("Eliminado", "El perfil ha sido eliminado.", "success");
            loadProfiles();
        } else {
            Swal.fire("Error", "No se pudo eliminar el perfil.", "error");
        }
    };

    // 🔹 Manejar acciones de la tabla
    const handleAction = (action: string, item: Profile) => {
        switch (action) {
            case "view":
                navigate(`/api/profiles/view/${item.id}`);
                break;
            case "edit":
                navigate(`/api/profiles/${item.id}`);
                break;
            case "delete":
                handleDelete(item.id);
                break;
            default:
                break;
        }
    };

    return (
        <div className="p-6">
            <TableComponent
                name="Perfiles de Usuario"
                entity="profiles"
                data={profiles.map((p) => ({
                    ...p,
                    user_name: users.find((u) => u.id === p.user_id)?.name || "Desconocido",
                    photo: p.photo || "—",  // SOLO TEXTO
                }))}
                columns={["id", "user_name", "phone", "photo"]}
                actions={[
                    { name: "view", label: "👁️ Ver" },
                    { name: "edit", label: "✏️ Editar" },
                    { name: "delete", label: "🗑️ Eliminar" },
                ]}
                onAction={handleAction}
            />



        </div>
    );
};

export default ListProfilesPage;

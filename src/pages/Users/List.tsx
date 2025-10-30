import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { User } from "../../models/User";
import { userService } from "../../services/userService";



const ListUsers: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    // Cuando la página carga, obtiene los datos
    useEffect(() => {
        console.log('Cargando usuarios');
        
        fetchData();
    }, []); // Se ejecuta solo una vez al montar el componente

    // 🔹 Obtiene los datos de los usuarios desde el backend
    const fetchData = async () => {
        const users = await userService.getUsers();
        setUsers(users);
    };

    const handleAction = (action: string, item: User) => {
        if (action === "edit") {
            console.log("Edit user:", item);
            navigate(`/users/update/${item.id}`);
        } else if (action === "delete") {
            console.log("Delete user:", item);
        }
    };

    return (
        <div>
            <GenericTable
                name="Users List"
                data={users}
                columns={["id", "name", "email"]}
                actions={[
                    { name: "edit", label: "Edit" },
                    { name: "delete", label: "Delete" },
                ]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListUsers;

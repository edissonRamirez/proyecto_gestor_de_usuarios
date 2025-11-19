import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { Session } from "../../models/Session";
import { sessionService } from "../../services/sessionsService";
import { useDesign } from "../../context/DesignContext";
import GenericTableBootstrap from "../../components/GenericTableBootstrap";



const ListSessions: React.FC = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<Session[]>([]);
    const { design } = useDesign();
    // 🔥 Selector según la librería
  const TableComponent =
      design === "tailwind" 
      ? GenericTable 
      : GenericTableBootstrap;
    // Cuando la página carga, obtiene los datos
    useEffect(() => {
        console.log('Cargando sesiones');

        fetchData();
    }, []); // Se ejecuta solo una vez al montar el componente

    // 🔹 Obtiene los datos de las sesiones desde el backend
    const fetchData = async () => {
        const sessions = await sessionService.getSessions();
        setSessions(sessions);
    };

    const handleAction = (action: string, item: Record<string, any>) => {
    if (action === "edit") {
      console.log("Edit session:", item);
      navigate(`/api/sessions/${item.id}`);
    } else if (action === "delete" && item.id) {
      console.log("Delete session:", item);
      handleDelete(item.id);
      // Aquí más adelante puedes agregar confirmación y eliminación real
    }
  };

    const handleDelete = async (id: number) => {
          if (window.confirm("Are you sure you want to delete this session?")) {
            const success = await sessionService.deleteSession(id);
            if (success) {
              alert("Session deleted successfully ✅");
              fetchData();
              navigate("/api/sessions");
            } else {
              alert("Error deleting session ❌");
            }
          }
        };

    return (
        <div>
            <TableComponent
                name="Sessions List"
                entity="sessions"
                data={sessions}
                columns={["id", "token", "expiration", "state", "FACode", "user_id"]}
                actions={[
                    { name: "edit", label: "✏️ Update" },
                    { name: "delete", label: "🗑️ Delete" },
                ]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListSessions;

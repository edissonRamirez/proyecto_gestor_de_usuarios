import { useEffect, useState } from "react";
import { Device } from "../../models/Device";
import { deviceService } from "../../services/deviceService";
import { userService } from "../../services/userService";
import GenericTable from "../../components/GenericTable";
import { useNavigate } from "react-router";
import { useDesign } from "../../context/DesignContext";
import GenericTableBootstrap from "../../components/GenericTableBootstrap";

const ListDevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<(Device & { user_name?: string })[]>([]);
  const navigate = useNavigate();
  const { design } = useDesign();
  // 🔥 Selector según la librería
  const TableComponent =
      design === "tailwind" 
      ? GenericTable 
      : GenericTableBootstrap;

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const devicesData = await deviceService.getDevices();
    const users = await userService.getUsers();

    // Enriquecer los dispositivos con el nombre del usuario
    const enrichedDevices = devicesData.map((d) => ({
      ...d,
      user_name: users.find((u) => u.id === d.user_id)?.name || "Desconocido",
    }));

    setDevices(enrichedDevices);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      const success = await deviceService.deleteDevice(id);
      if (success) {
        alert("Device deleted successfully ✅");
        loadDevices();
        navigate("/api/devices");
      } else {
        alert("Error deleting device ❌");
      }
    }
  };

  const handleAction = (action: string, item: Record<string, any>) => {
    if (action === "edit") {
      console.log("Edit device:", item);
      navigate(`/api/devices/${item.id}`);
    } else if (action === "delete" && item.id) {
      console.log("Delete device:", item);
      handleDelete(item.id);
      // Aquí más adelante puedes agregar confirmación y eliminación real
    }
  };

  return (
    <div className="p-6">
      <TableComponent
        name="Devices List"
        entity="devices"
        data={devices}
        columns={[
          "id",
          "name",
          "ip",
          "operating_system",
          "user_name",
        ]}
        actions={[{ name: "delete", label: "🗑️ Delete" }, {name: "edit", label: "✏️ Update"}]}
        onAction={handleAction}
      />
    </div>
  );
};

export default ListDevicesPage;

import { useEffect, useState } from "react";
import { Address } from "../../models/Address";
import { addressService } from "../../services/addressesService";
import GenericTable from "../../components/GenericTable";
import { useNavigate } from "react-router";
import GenericTableBootstrap from "../../components/GenericTableBootstrap";
import { useDesign } from "../../context/DesignContext";
import { Table } from "../../components/TableSettings";

const ListAddressPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const navigate = useNavigate(); 
  const { design } = useDesign();

  // 🔥 Selector según la librería
    const TableComponent =
        design === "tailwind" 
        ? GenericTable 
        : GenericTableBootstrap;

  useEffect(() => {
    console.log("Loading addresses");
    fetchAddresses();
  }, []);

  const handleAction = (action: string, item: Record<string, any>) => {
      if (action === "edit") {
        console.log("Edit address:", item);
        navigate(`/api/addresses/${item.id}`);
      } else if (action === "delete" && item.id) {
        console.log("Delete address:", item);
        handleDelete(item.id);
        // Aquí más adelante puedes agregar confirmación y eliminación real
      }
    };
    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this role?")) {
          const success = await addressService.deleteAddress(id);
          if (success) {
            alert("Address deleted successfully ✅");
            fetchAddresses();
            navigate("/api/addresses");
          } else {
            alert("Error deleting address ❌");
          }
        }
      };

  const fetchAddresses = async () => {
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Error al obtener direcciones:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <TableComponent<Address>
          entity="addresses"
          name="Listado de Direcciones"
          data={addresses}
          columns={["id", "street", "number", "latitude", "longitude", "user_id"]}
          actions={[
          { name: "edit", label: "✏️ Update" },
          { name: "delete", label: "🗑️ Delete" },
        ]}
          onAction={handleAction}
        />
      </div>
    </div>
  );
};

export default ListAddressPage;

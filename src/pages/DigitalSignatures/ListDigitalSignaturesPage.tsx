import { useEffect, useState } from "react";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { DigitalSignature } from "../../models/DigitalSignature";
import GenericTable from "../../components/GenericTable";
import { useNavigate } from "react-router-dom";
import GenericTableBootstrap from "../../components/GenericTableBootstrap";
import { useDesign } from "../../context/DesignContext";

const ListDigitalSignaturesPage: React.FC = () => {
  const [signatures, setSignatures] = useState<DigitalSignature[]>([]);
  const navigate = useNavigate();
  const { design } = useDesign();

  // 🔥 Selector según la librería
  const TableComponent =
      design === "tailwind" 
      ? GenericTable 
      : GenericTableBootstrap;

  useEffect(() => {
    loadSignatures();
  }, []);

  const loadSignatures = async () => {
    const data = await digitalSignatureService.getDigitalSignatures();
    setSignatures(data);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar esta firma digital?")) {
      const success = await digitalSignatureService.deleteDigitalSignature(id);
      if (success) {
        alert("Firma eliminada correctamente ✅");
        loadSignatures();
      } else {
        alert("Error al eliminar la firma ❌");
      }
    }
  };

  const handleAction = (action: string, item: Record<string, any>) => {
    if (action === "edit") {
      console.log("Edit digital signature:", item);
      navigate(`/api/digital-signatures/${item.id}`);
    } else if (action === "delete" && item.id) {
      console.log("Delete digital signature:", item);
      handleDelete(item.id);
      // Aquí más adelante puedes agregar confirmación y eliminación real
    }
  };

  return (
    <div className="p-6">
      <TableComponent<DigitalSignature>
        name="Digital Signatures List"
        entity="digital-signatures"
        data={signatures}
        columns={["id", "photo", "user_id", "created_at", "updated_at"]}
        actions={[
          { name: "edit", label: "✏️ Update" },
          { name: "delete", label: "🗑️ Delete" },
        ]}
        onAction={handleAction}
      />
    </div>
  );
};

export default ListDigitalSignaturesPage;

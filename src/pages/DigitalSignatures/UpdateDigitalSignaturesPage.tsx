// src/pages/DigitalSignatures/UpdateDigitalSignaturePage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { DigitalSignature } from "../../models/DigitalSignature";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";
import { useDesign } from "../../context/DesignContext";

const UpdateDigitalSignaturePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { design } = useDesign();

  // 🔥 Selector del formulario según la librería activa
    const FormComponent = design === "tailwind"
        ? CreateOrUpdateValidator
        : CreateOrUpdateValidatorBootstrap;

  const [signature, setSignature] = useState<DigitalSignature | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 🔹 Cargar la firma existente
  useEffect(() => {
    if (id) loadSignature();
  }, [id]);

  const loadSignature = async () => {
    const data = await digitalSignatureService.getDigitalSignatureById(id!);
    setSignature(data);
  };

  // 🔹 Manejo del envío
  const handleUpdate = async () => {
    try {
      if (!signature?.user_id) {
        Swal.fire("⚠️ Atención", "El ID del usuario no es válido.", "warning");
        return;
      }

      const updated = await digitalSignatureService.updateDigitalSignature(
        Number(id),
        signature.user_id,
        selectedFile || undefined
      );

      if (updated) {
        Swal.fire({
          title: "✅ Firma digital actualizada",
          text: "La firma se actualizó correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/api/digital-signatures");
      } else {
        Swal.fire("❌ Error", "No se pudo actualizar la firma digital.", "error");
      }
    } catch (error) {
      console.error("Error al actualizar firma digital:", error);
      Swal.fire("❌ Error", "Ocurrió un problema al actualizar la firma digital.", "error");
    }
  };

  if (!signature)
    return <p className="text-center text-gray-500 mt-10">Cargando firma digital...</p>;

  return (
    <div>
      <Breadcrumb pageName="Actualizar Firma Digital" />

      <h2 className="text-2xl font-bold text-graydark mb-6 text-center">
        Actualizar Firma Digital
      </h2>

      {/* Imagen actual */}
      {signature.photo && (
        <div className="max-w-md mx-auto mb-6 text-center">
          <p className="mb-2 font-semibold text-graydark">Firma actual:</p>
          <img
            src={`${import.meta.env.VITE_API_URL}/${signature.photo}`}
            alt="Firma actual"
            className="rounded-md border shadow-md w-64 h-40 object-contain mx-auto"
          />
        </div>
      )}

      {/* Formulario genérico */}
      <FormComponent<DigitalSignature>
        mode={2}
        title="Formulario de Actualización de Firma Digital"
        entity={signature}
        fields={[
          {
            name: "user_id",
            label: "Usuario (no editable)",
            type: "text",
            readOnly: true,
          },
          ({
            name: "photo",
            label: "Nueva Firma (Imagen)",
            type: "file",
            onFileSelect: setSelectedFile,
          } as any),
        ]}
        validationSchema={Yup.object({
          photo: Yup.mixed().nullable(),
        })}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

export default UpdateDigitalSignaturePage;

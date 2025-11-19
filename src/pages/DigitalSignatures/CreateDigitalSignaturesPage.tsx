// src/pages/DigitalSignatures/CreateDigitalSignaturePage.tsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import { User } from "../../models/User";
import { DigitalSignature } from "../../models/DigitalSignature";
import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const CreateDigitalSignaturePage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { design } = useDesign();

  // 🔥 Selector del formulario según la librería activa
    const FormComponent = design === "tailwind"
        ? CreateOrUpdateValidator
        : CreateOrUpdateValidatorBootstrap;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const usersData = await userService.getUsers();
    setUsers(usersData);
  };

  const handleCreate = async (values: DigitalSignature) => {
    try {
      if (!values.user_id) {
        Swal.fire("⚠️ Atención", "Debes seleccionar un usuario.", "warning");
        return;
      }
      if (!selectedFile) {
        Swal.fire("⚠️ Atención", "Debes subir una imagen de la firma.", "warning");
        return;
      }

      const created = await digitalSignatureService.createDigitalSignature(
        values.user_id,
        selectedFile
      );

      if (created) {
        Swal.fire({
          title: "✅ Firma creada",
          text: "La firma digital se ha guardado correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/api/digital-signatures");
      } else {
        Swal.fire("❌ Error", "No se pudo crear la firma.", "error");
      }
    } catch (error) {
      console.error("Error al crear firma:", error);
      Swal.fire("❌ Error", "Ocurrió un problema al crear la firma.", "error");
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Crear Firma Digital" />

      <FormComponent<DigitalSignature>
        mode={1}
        title="Formulario de Creación de Firma Digital"
        fields={[
          {
            name: "user_id",
            label: "Usuario",
            type: "select",
            required: true,
            options: users.map((u) => ({ value: u.id, label: u.name })),
          },
          {
            name: "photo",
            label: "Archivo de Firma (Imagen)",
            type: "file",
            required: true,
            onFileSelect: setSelectedFile,
          } as any,
        ]}
        validationSchema={Yup.object({
          user_id: Yup.number().required("El usuario es obligatorio")
        })}
        handleCreate={handleCreate}
      />
    </div>
  );
};

export default CreateDigitalSignaturePage;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import { Profile } from "../../models/Profile";
import { profileService } from "../../services/profileService";
import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const UpdateProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { design } = useDesign();
  // 🔥 Selector del formulario según la librería activa
    const FormComponent = design === "tailwind"
        ? CreateOrUpdateValidator
        : CreateOrUpdateValidatorBootstrap;

  // 🔹 Cargar datos del perfil existente
  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      const data = await profileService.getProfileById(Number(id));
      setProfile(data);
    };
    fetchProfile();
  }, [id]);

  // 🔹 Manejo del envío de actualización
  const handleUpdateProfile = async (values: Profile, file?: File) => {
    try {
      if (!id) {
        Swal.fire("Error", "No se encontró el ID del perfil", "error");
        return;
      }

      const response = await profileService.updateProfile(Number(id), values, file);

      if (response) {
        Swal.fire("✅ Éxito", "Perfil actualizado correctamente.", "success");
        navigate("/api/profiles");
      } else {
        Swal.fire("❌ Error", "No se pudo actualizar el perfil.", "error");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Swal.fire("❌ Error", "Hubo un problema al actualizar el perfil.", "error");
    }
  };

  if (!profile)
    return <p className="text-center text-gray-500">Cargando perfil...</p>;

  return (
    <div className="p-6">
      <Breadcrumb pageName="Actualizar Perfil" />
      <FormComponent<Profile>
        mode={2}
        title="Actualizar Perfil de Usuario"
        entity={profile}
        fields={[
          { name: "phone", label: "Teléfono", type: "text", required: true },
          {
            name: "photo",
            label: "Actualizar Foto (Opcional)",
            type: "file",
            required: false,
          },
        ]}
        validationSchema={Yup.object({
          phone: Yup.string()
            .matches(/^[0-9+ ]+$/, "Debe contener solo números o '+'")
            .required("El teléfono es obligatorio"),
        })}
        handleUpdate={handleUpdateProfile}
      />
    </div>
  );
};

export default UpdateProfilePage;

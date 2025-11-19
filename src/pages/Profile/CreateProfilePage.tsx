import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Profile } from "../../models/Profile";
import { profileService } from "../../services/profileService";
import { userService } from "../../services/userService";
import { User } from "../../models/User";
import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { useNavigate } from "react-router-dom";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const CreateProfilePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { design } = useDesign();

  // 🔥 Selector del formulario según la librería activa
  const FormComponent = design === "tailwind"
    ? CreateOrUpdateValidator
    : CreateOrUpdateValidatorBootstrap;

  // 🔹 Cargar usuarios disponibles
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await userService.getUsers();
      setUsers(data || []);
    };
    fetchUsers();
  }, []);

  // 🔹 Manejo del envío de datos
  const handleCreateProfile = async (values: Profile, file?: File) => {
    try {
      if (!values.user_id) {
        Swal.fire("Atención", "Debe seleccionar un usuario.", "warning");
        return;
      }

      const response = await profileService.createProfile(values, file);

      if (response) {
        Swal.fire("✅ Éxito", "Perfil creado correctamente.", "success");
        navigate("/api/profiles");
      } else {
        Swal.fire("❌ Error", "No se pudo crear el perfil.", "error");
      }
    } catch (error) {
      console.error("Error al crear perfil:", error);
      Swal.fire("❌ Error", "Hubo un problema al crear el perfil.", "error");
    }
  };

  return (
    <div className="p-6">
      <Breadcrumb pageName="Crear Perfil" />
      <FormComponent<Profile>
        mode={1}
        title="Crear Nuevo Perfil"
        fields={[
          {
            name: "user_id",
            label: "Usuario",
            type: "select",
            options: users.map((u) => ({ value: u.id!, label: u.name! })),
            required: true,
          },
          { name: "phone", label: "Teléfono", type: "text", required: true },
          {
            name: "photo",
            label: "Archivo de Foto (Imagen)",
            type: "file",
            required: true,
          },
        ]}
        validationSchema={Yup.object({
          user_id: Yup.number().required("Debe seleccionar un usuario"),
          phone: Yup.string()
            .matches(/^[0-9+ ]+$/, "Debe contener solo números o '+'")
            .required("El teléfono es obligatorio"),
        })}
        handleCreate={handleCreateProfile}
      />
    </div>
  );
};

export default CreateProfilePage;

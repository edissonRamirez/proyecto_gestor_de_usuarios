import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Breadcrumb from "../../components/Breadcrumb";

import CreateOrUpdateValidator, { FieldConfig } from "../../components/CreateOrUpdateValidator";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

import { userService } from "../../services/userService";
import { User } from "../../models/User";
import * as Yup from "yup";

import { useDesign } from "../../context/DesignContext";

const UpdateUser: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const { design } = useDesign();

  // 🔥 Formulario dinámico según la librería seleccionada
  const FormComponent =
    design === "tailwind"
      ? CreateOrUpdateValidator
      : CreateOrUpdateValidatorBootstrap;

  // 📌 Cargar usuario
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      const data = await userService.getUserById(parseInt(id));
      setUser(data);
    };
    fetchUser();
  }, [id]);

  // 📌 Campos
  const fields: FieldConfig[] = [
    { name: "name", label: "Nombre", type: "text" },
    { name: "email", label: "Correo Electrónico", type: "email" },
    { name: "password", label: "Contraseña", type: "password" },
  ];

  // 📌 Validación
  const validationSchema = Yup.object({
    name: Yup.string().required("Nombre obligatorio").min(3),
    email: Yup.string().email().required("Correo obligatorio"),
    password: Yup.string().min(6).max(30).optional(),
  });

  // 📌 Actualizar usuario
  const handleUpdateUser = async (values: User) => {
    if (!id) return;

    try {
      const updated = await userService.updateUser(parseInt(id), values);

      if (updated) {
        Swal.fire("Completado", "Usuario actualizado", "success");
        navigate("/api/users");
      } else {
        Swal.fire("Error", "No se pudo actualizar", "error");
      }
    } catch {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };

  if (!user) return <div className="text-center py-10">Cargando usuario...</div>;

  return (
    <div>
      <Breadcrumb pageName="Actualizar Usuario" />

      {/* 🔥 Aquí se usa el formulario dinámico */}
      <FormComponent<User>
        mode={2}
        title="Actualizar Usuario"
        fields={fields}
        validationSchema={validationSchema}
        handleUpdate={handleUpdateUser}
        entity={user}
      />
    </div>
  );
};

export default UpdateUser;

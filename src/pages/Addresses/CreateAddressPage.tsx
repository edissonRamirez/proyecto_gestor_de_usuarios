import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { Address } from "../../models/Address";
import { User } from "../../models/User";
import { addressService } from "../../services/addressesService";
import { userService } from "../../services/userService";
import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const CreateAddressPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const { design } = useDesign();

  // 🔥 Selector del formulario según la librería activa
    const FormComponent = design === "tailwind"
        ? CreateOrUpdateValidator
        : CreateOrUpdateValidatorBootstrap;

  // 🔹 Cargar lista de usuarios
  useEffect(() => {
    const loadUsers = async () => {
      const usersData = await userService.getUsers();
      setUsers(usersData);
    };
    loadUsers();
  }, []);

  // 🔹 Esquema de validación con Yup
  const validationSchema = Yup.object({
    street: Yup.string().required("La calle es obligatoria"),
    number: Yup.string().required("El número es obligatorio"),
    latitude: Yup.string().required("La latitud es obligatoria"),
    longitude: Yup.string().required("La longitud es obligatoria"),
    user_id: Yup.number().required("Debe seleccionar un usuario"),
  });

  // 🔹 Lógica de creación
  const handleCreateAddress = async (address: Address) => {
    try {
      const response = await addressService.createAddress(address);

      if (response) {
        Swal.fire({
          title: "✅ Creada correctamente",
          text: "La dirección fue creada exitosamente.",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
        navigate("/api/addresses");
      } else {
        Swal.fire({
          title: "❌ Error",
          text: "No se pudo crear la dirección.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al crear dirección:", error);
      Swal.fire({
        title: "❌ Error",
        text: "Hubo un problema al crear la dirección.",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-6">
      <Breadcrumb pageName="Crear Dirección" />
      <FormComponent<Address>
        mode={1}
        title="Formulario de Creación de Dirección"
        fields={[
          { name: "street", label: "Calle", type: "text" },
          { name: "number", label: "Número", type: "text" },
          { name: "latitude", label: "Latitud", type: "text" },
          { name: "longitude", label: "Longitud", type: "text" },
          {
            name: "user_id",
            label: "Usuario",
            type: "select",
            options: users.map((u) => ({ label: u.name ? u.name : "Usuario " + u.id, value: u.id! })),
          },
        ]}
        validationSchema={validationSchema}
        handleCreate={handleCreateAddress}
      />
    </div>
  );
};

export default CreateAddressPage;

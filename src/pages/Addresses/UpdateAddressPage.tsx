import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

import { Address } from "../../models/Address";
import { User } from "../../models/User";
import { addressService } from "../../services/addressesService";
import { userService } from "../../services/userService";
import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const UpdateAddressPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [address, setAddress] = useState<Address | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { design } = useDesign();

  // 🔥 Selector del formulario según la librería activa
    const FormComponent = design === "tailwind"
        ? CreateOrUpdateValidator
        : CreateOrUpdateValidatorBootstrap;

  // 🔹 Cargar datos
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      const addressData = await addressService.getAddressById(Number(id));
      const usersData = await userService.getUsers();
      setAddress(addressData);
      setUsers(usersData);
    };
    loadData();
  }, [id]);

  // 🔹 Esquema de validación
  const validationSchema = Yup.object({
    street: Yup.string().required("La calle es obligatoria"),
    number: Yup.string().required("El número es obligatorio"),
    latitude: Yup.string().required("La latitud es obligatoria"),
    longitude: Yup.string().required("La longitud es obligatoria"),
    user_id: Yup.number().required("Debe seleccionar un usuario"),
  });

  // 🔹 Lógica de actualización
  const handleUpdateAddress = async (updatedAddress: Address) => {
    try {
      const response = await addressService.updateAddress(Number(id), updatedAddress);

      if (response) {
        Swal.fire({
          title: "✅ Actualizada correctamente",
          text: "La dirección fue actualizada exitosamente.",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
        navigate("/api/addresses");
      } else {
        Swal.fire({
          title: "❌ Error",
          text: "No se pudo actualizar la dirección.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar dirección:", error);
      Swal.fire({
        title: "❌ Error",
        text: "Hubo un problema al actualizar la dirección.",
        icon: "error",
      });
    }
  };

  if (!address) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="p-6">
      <Breadcrumb pageName="Actualizar Dirección" />
      <FormComponent<Address>
        mode={2}
        title="Formulario de Actualización de Dirección"
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
        handleUpdate={handleUpdateAddress}
        entity={address}
      />
    </div>
  );
};

export default UpdateAddressPage;

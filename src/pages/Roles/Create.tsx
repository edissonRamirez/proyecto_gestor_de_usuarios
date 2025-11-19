import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { roleService } from "../../services/roleService";
import { Role } from "../../models/Role";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const CreateRolePage: React.FC = () => {
    const navigate = useNavigate();
    const { design } = useDesign();
    // 🔥 Selector del formulario según la librería activa
    const FormComponent =
        design === "tailwind" 
        ? CreateOrUpdateValidator 
        : CreateOrUpdateValidatorBootstrap;

    // 🔹 Lógica de creación
    const handleCreate = async (values: Role) => {
        try {
            const createdRole = await roleService.createRole(values);

            if (createdRole) {
                Swal.fire({
                    title: "Completado",
                    text: "El rol se ha creado correctamente ✅",
                    icon: "success",
                    timer: 2500,
                    showConfirmButton: false,
                });
                navigate("/api/roles");
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al crear el rol ❌",
                    icon: "error",
                    timer: 3000,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error("Error al crear rol:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al crear el rol ❌",
                icon: "error",
                timer: 3000,
            });
        }
    };

    // 🔹 Campos del formulario
    const fields = [
        { name: "name", label: "Nombre del Rol", type: "text" },
        { name: "description", label: "Descripción", type: "text" },
    ];

    // 🔹 Esquema de validación
    const validationSchema = Yup.object({
        name: Yup.string()
            .required("El nombre del rol es obligatorio")
            .min(3, "Debe tener al menos 3 caracteres"),
        description: Yup.string()
            .required("La descripción es obligatoria")
            .min(5, "Debe tener al menos 5 caracteres"),
    });

    return (
        <div>
            <Breadcrumb pageName="Crear Rol" />
            <FormComponent
                mode={1} // modo 1 = crear
                title="Formulario de Creación de Rol"
                fields={fields as Array<any>}
                validationSchema={validationSchema}
                handleCreate={handleCreate}
            />
        </div>
    );
};

export default CreateRolePage;

import React from 'react';
import { User } from '../../models/User';
import * as Yup from 'yup';

import Swal from 'sweetalert2';
import { userService } from "../../services/userService";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";

// Tailwind
import CreateOrUpdateValidator from '../../components/CreateOrUpdateValidator';

// Bootstrap version
import CreateOrUpdateValidatorBootstrap from '../../components/CreateOrUpdateValidatorBootstrap';

// Selector
import { useDesign } from "../../context/DesignContext";

const CreateUser: React.FC = () => {

    const navigate = useNavigate();
    const { design } = useDesign();

    // 🔥 Selector del formulario según la librería activa
    const FormComponent = design === "tailwind"
        ? CreateOrUpdateValidator
        : CreateOrUpdateValidatorBootstrap;

    const userValidationSchema = Yup.object({
        name: Yup.string()
            .required("El nombre es obligatorio")
            .min(3, "El nombre debe tener al menos 3 caracteres")
            .max(50, "El nombre no puede tener más de 50 caracteres"),
        email: Yup.string()
            .email("Debe ingresar un correo válido")
            .required("El correo electrónico es obligatorio"),
        password: Yup.string()
            .required("La contraseña es obligatoria")
            .min(6, "La contraseña debe tener al menos 6 caracteres")
            .max(30, "La contraseña no puede tener más de 30 caracteres"),
        age: Yup.number()
            .typeError("La edad debe ser un número")
            .positive("La edad debe ser positiva")
            .integer("La edad debe ser un número entero")
            .min(15, "Debe tener al menos 15 años")
            .max(100, "Debe tener menos de 100 años")
            .required("La edad es obligatoria"),
        city: Yup.string()
            .required("La ciudad es obligatoria")
            .min(2, "Debe tener al menos 2 caracteres")
            .max(50, "Debe tener menos de 50 caracteres"),
        phone: Yup.string()
            .matches(/^[0-9]{10}$/, "El teléfono debe tener exactamente 10 dígitos")
            .required("El teléfono es obligatorio"),
        is_active: Yup.boolean(),
    });

    const handleCreateUser = async (user: User) => {
        try {
            const createdUser = await userService.createUser(user);

            if (createdUser) {
                Swal.fire("Completado", "Usuario creado", "success");
                navigate("/api/users");
            } else {
                Swal.fire("Error", "No se pudo crear el registro", "error");
            }
        } catch {
            Swal.fire("Error", "No se pudo crear el registro", "error");
        }
    };

    return (
        <div>
            <h2>Create User</h2>
            <Breadcrumb pageName="Crear Usuario" />

            {/* 🔥 Formulario dinámico */}
            <FormComponent<User>
                mode={1}
                title="Crear Usuario"
                fields={[
                    { name: "name", label: "Nombre", type: "text" },
                    { name: "email", label: "Correo", type: "email" },
                    { name: "password", label: "Contraseña", type: "password" },
                    { name: "age", label: "Edad", type: "number" },
                    { name: "city", label: "Ciudad", type: "text" },
                    { name: "phone", label: "Teléfono", type: "text" },
                    { name: "is_active", label: "Activo", type: "checkbox" },
                ]}
                validationSchema={userValidationSchema}
                handleCreate={handleCreateUser}
            />
        </div>
    );
};

export default CreateUser;

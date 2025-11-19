import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";

import Breadcrumb from "../../components/Breadcrumb";
import CreateOrUpdateValidator from "../../components/CreateOrUpdateValidator";
import { Password } from "../../models/Password";
import { User } from "../../models/User";
import { passwordService } from "../../services/passwordService";
import { userService } from "../../services/userService";
import { useDesign } from "../../context/DesignContext";
import CreateOrUpdateValidatorBootstrap from "../../components/CreateOrUpdateValidatorBootstrap";

const CreatePasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
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
        setUsers(usersData || []);
    };

    // ✅ Validación con Yup
    const validationSchema = Yup.object({
        content: Yup.string()
            .required("La contraseña es obligatoria")
            .min(8, "Debe tener al menos 8 caracteres")
            .max(100, "La contraseña no puede exceder los 100 caracteres"),
        startAt: Yup.date().required("Debe ingresar una fecha de inicio"),
        endAt: Yup.date()
            .required("Debe ingresar una fecha de expiración")
            .min(Yup.ref("startAt"), "La fecha de expiración debe ser posterior al inicio"),
        user_id: Yup.number().required("Debe seleccionar un usuario"),
    });

    // ✅ Acción de creación
    // ✅ Función para formatear fechas al formato que Flask espera
    const formatDate = (dateString: string) => {
        // Si ya viene con hora, no hace nada
        return dateString.includes(":") ? dateString : `${dateString} 00:00:00`;
    };

    // ✅ Acción de creación
    const handleCreatePassword = async (password: Password) => {
        try {
            // 🔹 Formateamos las fechas antes de enviar al backend
            const formattedPassword = {
                ...password,
                startAt: formatDate(password.startAt),
                endAt: formatDate(password.endAt),
            };

            const response = await passwordService.createPassword(password.user_id!, formattedPassword);
            if (response) {
                Swal.fire({
                    title: "Éxito ✅",
                    text: "La contraseña se ha creado correctamente",
                    icon: "success",
                    timer: 2500,
                    showConfirmButton: false,
                });
                navigate("/api/passwords");
            } else {
                Swal.fire({
                    title: "Error ❌",
                    text: "No se pudo crear la contraseña",
                    icon: "error",
                });
            }
        } catch (error) {
            console.error("Error al crear contraseña:", error);
            Swal.fire({
                title: "Error ❌",
                text: "Ocurrió un problema al crear la contraseña",
                icon: "error",
            });
        }
    };


    return (
        <div>
            <Breadcrumb pageName="Crear Contraseña" />

            <FormComponent<Password>
                mode={1}
                title="Formulario de Creación de Contraseña"
                fields={[
                    { name: "content", label: "Contraseña", type: "password" },
                    { name: "startAt", label: "Inicio de Validez", type: "date" },
                    { name: "endAt", label: "Fin de Validez", type: "date" },
                    {
                        name: "user_id",
                        label: "Usuario",
                        type: "select",
                        options: users.map((u) => ({ value: String(u.id), label: u.name ? u.name : "Usuario " + u.id })),
                    },
                ]}
                validationSchema={validationSchema}
                handleCreate={handleCreatePassword}
            />
        </div>
    );
};

export default CreatePasswordPage;

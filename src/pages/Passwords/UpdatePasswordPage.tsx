import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const UpdatePasswordPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [passwordData, setPasswordData] = useState<Password | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const { design } = useDesign();

    // 🔥 Selector del formulario según la librería activa
    const FormComponent = design === "tailwind"
        ? CreateOrUpdateValidator
        : CreateOrUpdateValidatorBootstrap;

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        if (!id) return;
        const [passwordRes, usersRes] = await Promise.all([
            passwordService.getPasswordById(Number(id)),
            userService.getUsers(),
        ]);

        setPasswordData(passwordRes);
        setUsers(usersRes || []);
    };

    const validationSchema = Yup.object({
        content: Yup.string()
            .required("La contraseña es obligatoria")
            .min(8, "Debe tener al menos 8 caracteres")
            .max(100, "La contraseña no puede exceder los 100 caracteres"),
        startAt: Yup.date().required("Debe ingresar una fecha de inicio"),
        endAt: Yup.date()
            .required("Debe ingresar una fecha de expiración")
            .min(Yup.ref("startAt"), "La fecha de expiración debe ser posterior al inicio"),
    });

    // ✅ Función para formatear fechas al formato esperado por el backend
    const formatDate = (dateString: string) => {
        return dateString.includes(":") ? dateString : `${dateString} 00:00:00`;
    };

    // ✅ Acción de actualización
    const handleUpdatePassword = async (updatedPassword: Password) => {
        try {
            if (!passwordData?.id) return;

            // 🔹 Formateamos las fechas antes de enviar
            const formattedPassword = {
                ...updatedPassword,
                startAt: formatDate(updatedPassword.startAt),
                endAt: formatDate(updatedPassword.endAt),
            };

            const response = await passwordService.updatePassword(passwordData.id, formattedPassword);

            if (response) {
                Swal.fire({
                    title: "Actualizado ✅",
                    text: "La contraseña se ha actualizado correctamente",
                    icon: "success",
                    timer: 2500,
                    showConfirmButton: false,
                });
                navigate("/api/passwords");
            } else {
                Swal.fire({
                    title: "Error ❌",
                    text: "No se pudo actualizar la contraseña",
                    icon: "error",
                });
            }
        } catch (error) {
            console.error("Error al actualizar contraseña:", error);
            Swal.fire({
                title: "Error ❌",
                text: "Ocurrió un problema al actualizar la contraseña",
                icon: "error",
            });
        }
    };


    if (!passwordData) {
        return <p className="text-center mt-10 text-gray-600">Cargando contraseña...</p>;
    }

    return (
        <div>
            <Breadcrumb pageName="Actualizar Contraseña" />
            <h2 className="text-2xl font-bold text-graydark mb-6">Actualizar Contraseña</h2>

            <FormComponent<Password>
                mode={2}
                title="Formulario de Actualización de Contraseña"
                entity={passwordData}
                fields={[
                    { name: "content", label: "Contraseña", type: "password" },
                    { name: "startAt", label: "Inicio de Validez", type: "date" },
                    { name: "endAt", label: "Fin de Validez", type: "date" },
                    {
                        name: "user_id",
                        label: "Usuario",
                        type: "select",
                        options: users.map((u) => ({ value: String(u.id), label: u.name ? u.name : "Usuario " + u.id })),
                        readOnly: true,
                    },
                ]}
                validationSchema={validationSchema}
                handleUpdate={handleUpdatePassword}
            />
        </div>
    );
};

export default UpdatePasswordPage;

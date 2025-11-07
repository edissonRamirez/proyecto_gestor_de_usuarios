import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { User } from "../../models/User";
import SecurityService from "../../services/securityService";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate } from "react-router-dom";

// 🔹 Importaciones nuevas
import { signInWithGitHub } from "../../firebaseConfig";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔸 Login normal (Flask)
  const handleLogin = async (user: User) => {
    console.log("aqui " + JSON.stringify(user));
    try {
      const response = await SecurityService.login(user);
      console.log("Usuario autenticado:", response);
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  };

  // 🔸 Nuevo login con Firebase + GitHub
  const handleGitHubLogin = async () => {
    try {
      const userData = await signInWithGitHub();
      console.log("Usuario autenticado con GitHub:", userData);

      // Guardar en localStorage y Redux
      localStorage.setItem("user", JSON.stringify(userData));
      dispatch(setUser(userData));

      navigate("/"); // Redirigir al inicio
    } catch (error) {
      console.error("Error en el login con GitHub:", error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Sign In" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          {/* Columna izquierda */}
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <img
                className="hidden dark:block"
                src={"/images/logo/logo.svg"}
                alt="Logo"
                width={176}
                height={32}
              />
              <img
                className="dark:hidden"
                src={"/images/logo/logo-dark.svg"}
                alt="Logo"
                width={176}
                height={32}
              />

              <p className="2xl:px-20">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                suspendisse.
              </p>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">Start for free</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to TailAdmin
              </h2>

              {/* 🔹 Formulario tradicional */}
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={Yup.object({
                  email: Yup.string()
                    .email("Email inválido")
                    .required("El email es obligatorio"),
                  password: Yup.string().required(
                    "La contraseña es obligatoria"
                  ),
                })}
                onSubmit={(values) => {
                  const formattedValues = { ...values };
                  handleLogin(formattedValues);
                }}
              >
                {({ handleSubmit }) => (
                  <Form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-4 p-6 bg-white rounded-md shadow-md"
                  >
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-lg font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="w-full border rounded-md p-2"
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-lg font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className="w-full border rounded-md p-2"
                      />
                      <ErrorMessage
                        name="password"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Botón de enviar */}
                    <button
                      type="submit"
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    >
                      Login
                    </button>

                    {/* 🔹 Botón alternativo: Login con GitHub */}
                    <button
                      type="button"
                      onClick={handleGitHubLogin}
                      className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-70 dark:border-strokedark dark:bg-meta-4"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-black dark:text-white"
                      >
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.746.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.304 3.495.997.108-.776.42-1.305.763-1.606-2.665-.305-5.466-1.332-5.466-5.932 0-1.31.47-2.382 1.236-3.222-.123-.304-.536-1.528.117-3.176 0 0 1.008-.322 3.301 1.23a11.44 11.44 0 0 1 3.003-.404 11.4 11.4 0 0 1 3.003.404c2.291-1.552 3.297-1.23 3.297-1.23.655 1.648.242 2.872.12 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.807 5.624-5.48 5.921.43.37.814 1.096.814 2.21 0 1.595-.015 2.88-.015 3.27 0 .32.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                      Sign in with GitHub
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

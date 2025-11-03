import React from "react";
import { User } from "../models/User";

interface ProfileViewProps {
  photo_url?: string;
  phone?: string;
  user?: User;
}

const ProfileView: React.FC<ProfileViewProps> = ({ photo_url, phone, user }) => {
  return (
    <div className="flex flex-col items-center w-full p-6">
      {/* Encabezado */}
      <h2 className="text-3xl font-bold text-gray-800 mb-10">
        {user?.name || "User"} - Profile
      </h2>

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row items-center justify-center bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl">
        {/* Imagen del perfil */}
        <div className="flex justify-center md:justify-start w-full md:w-1/2 mb-6 md:mb-0">
          <img
            src={photo_url || "/default-avatar.png"}
            alt="Foto de perfil"
            className="w-48 h-48 rounded-md object-cover border-2 border-gray-300"
          />
        </div>

        {/* Información del usuario */}
        <div className="w-full md:w-1/2 text-left space-y-4 pl-0 md:pl-8">
          <p className="text-lg text-gray-700">
            <strong>Name:</strong> {user?.name || "Sin nombre"}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Email:</strong> {user?.email || "Sin correo"}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Phone:</strong> {phone || "No registrado"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

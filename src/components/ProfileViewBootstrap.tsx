import React from "react";
import { User } from "../models/User";

interface ProfileViewProps {
  photo_url?: string;
  phone?: string;
  user?: User;
}

const ProfileViewBootstrap: React.FC<ProfileViewProps> = ({ photo_url, phone, user }) => {
  return (
    <div className="container p-4">
      <h2 className="text-center mb-4">
        {user?.name || "User"} - Profile
      </h2>

      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "800px" }}>
        <div className="row align-items-center">

          {/* Foto */}
          <div className="col-md-4 text-center">
            <img
              src={photo_url}
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.jpg";
              }}
              alt="Foto de perfil"
              className="img-thumbnail mb-3"
              width={180}
            />
          </div>

          {/* Info */}
          <div className="col-md-8">
            <p><strong>Name:</strong> {user?.name || "Sin nombre"}</p>
            <p><strong>Email:</strong> {user?.email || "Sin correo"}</p>
            <p><strong>Phone:</strong> {phone || "No registrado"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewBootstrap;

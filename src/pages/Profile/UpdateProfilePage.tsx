import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Profile } from "../../models/Profile";
import { profileService } from "../../services/profileService";
import ProfileFormValidator from "../../components/ProfileFormValidator";
import { useNavigate } from "react-router-dom";

const UpdateProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // <- aquí viene el profile_id
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      console.warn("No hay usuario autenticado en localStorage.");
      return;
    }

    const user = JSON.parse(storedUser);

    // Creamos un perfil base con datos del usuario autenticado (GitHub)
    const profileData: Profile = {
      id: id ? Number(id) : undefined, // <- lo obtenemos de la URL
      photo_url: user.avatar_url || "",
      phone: "",
      user: {
        id: undefined, // este no importa, lo maneja backend
        name: user.name,
        email: user.email,
      },
    };

    setProfile(profileData);
  }, [id]);

  const handleUpdate = async (values: Profile, file?: File) => {
    if (!id) {
      alert("Error: No se encontró el ID del perfil en la URL");
      return;
    }

    const updated = await profileService.createOrUpdateProfile(Number(id), values, file);
    if (updated) {
      alert("Perfil actualizado correctamente ✅");
      setProfile(updated);
      navigate(`/api/profile`);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
        {profile ? (
          <ProfileFormValidator profile={profile} handleUpdate={handleUpdate} />
        ) : (
          <p className="text-center text-gray-500">Cargando perfil...</p>
        )}
      </div>
    </div>
  );
};

export default UpdateProfilePage;

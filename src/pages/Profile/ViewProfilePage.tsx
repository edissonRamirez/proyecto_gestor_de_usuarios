import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { Profile } from "../../models/Profile";
import { User } from "../../models/User";
import { profileService } from "../../services/profileService";
import { userService } from "../../services/userService";
import Breadcrumb from "../../components/Breadcrumb";
import ProfileView from "../../components/ProfileView";
import { useDesign } from "../../context/DesignContext";
import ProfileViewBootstrap from "../../components/ProfileViewBootstrap";

const ViewProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { design } = useDesign();

  const ProfileComponent = design === "tailwind" ? ProfileView : ProfileViewBootstrap;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!id) return;

        // 1️⃣ Obtener perfil
        const profileData = await profileService.getProfileById(Number(id));
        if (!profileData) {
          Swal.fire("Error", "Perfil no encontrado", "error");
          return;
        }

        setProfile(profileData);

        // 2️⃣ Obtener usuario asociado
        if (profileData.user_id) {
          const userData = await userService.getUserById(profileData.user_id);
          setUser(userData);
        }

      } catch (error) {
        console.error("Error al cargar perfil:", error);
        Swal.fire("Error", "No se pudieron cargar los datos del perfil", "error");
      }
    };

    loadProfile();
  }, [id]);

  if (!profile)
    return <p className="text-center text-gray-500 mt-10">Cargando perfil...</p>;

  const urlText = profile.photo ?? "—";



  return (
    <div className="p-6">
      <Breadcrumb pageName="Perfil de Usuario" />

      {/* Aquí usamos tu componente ProfileView */}
      <ProfileComponent
        user={user ?? undefined}
        photo_url={urlText}
        phone={profile.phone ?? undefined}
      />
    </div>
  );
};

export default ViewProfilePage;

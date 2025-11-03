import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { profileService } from "../../services/profileService";
import { Profile } from "../../models/Profile";
import ProfileFormValidator from "../../components/ProfileFormValidator";

const UpdateProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await profileService.getProfileById(Number(id));
      setProfile(data);
    };
    fetchProfile();
  }, [id]);

  const handleUpdate = async (values: Profile, file?: File) => {
    const updated = await profileService.createOrUpdateProfile(Number(id), values, file);
    if (updated) {
      alert("Perfil actualizado correctamente ✅");
      setProfile(updated);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {profile ? (
        <ProfileFormValidator profile={profile} handleUpdate={handleUpdate} />
      ) : (
        <p className="text-center text-gray-500">Cargando perfil...</p>
      )}
    </div>
  );
};

export default UpdateProfilePage;

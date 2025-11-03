import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Profile } from "../../models/Profile";
import { profileService } from "../../services/profileService";
import ProfileView from "../../components/ProfileView";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
      const data = await profileService.getProfileById(Number(id));
      setProfile(data);
    };

  return (
    <div className="p-6 flex justify-center">
      {profile ? (
        <ProfileView
          photo_url={profile.photo_url}
          phone={profile.phone}
          user={profile.user}
        />
      ) : (
        <p className="text-gray-500 mt-10">No se encontró el perfil.</p>
      )}
    </div>
  );
};

export default ProfilePage;

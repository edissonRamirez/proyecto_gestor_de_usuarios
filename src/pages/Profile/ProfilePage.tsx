import ProfileView from "../../components/ProfileView";

const ProfilePage: React.FC = () => {
  const storedUser = localStorage.getItem("user");
  console.log("Stored User: ", storedUser);
  
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="p-6 flex justify-center">
      {user ? (
        <ProfileView
          photo_url={user.avatar_url}
          phone={"No registrado"}
          user={{
            name: user.name || "Sin nombre",
            email: user.email,
          }}
        />
      ) : (
        <p className="text-gray-500 mt-10 text-center">
          No hay usuario autenticado.
        </p>
      )}
    </div>
  );
};

export default ProfilePage;

import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";

// 🔹 Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBJdQJrOZtjELCU291dyKqucU2ou1Q2jvo",
  authDomain: "frontend-app-2025-2.firebaseapp.com",
  projectId: "frontend-app-2025-2",
  storageBucket: "frontend-app-2025-2.firebasestorage.app",
  messagingSenderId: "400399921425",
  appId: "1:400399921425:web:c750fed0127ed26445dcb0",
  measurementId: "G-P2CGSTPT8L"
};

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const githubProvider = new GithubAuthProvider();

// 🔹 Función de inicio de sesión con GitHub
export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    // 🔹 Intentar obtener un nombre válido
    const displayName =
      user.displayName ||
      user.providerData[0]?.displayName ||
      user.providerData[0]?.uid ||
      "GitHub User";

    return {
      name: displayName,
      email: user.email,
      avatar_url: user.photoURL,
      uid: user.uid,
    };
  } catch (error) {
    console.error("Error al iniciar sesión con GitHub:", error);
    throw error;
  }
};

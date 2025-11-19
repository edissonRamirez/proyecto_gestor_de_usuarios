import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider,signInWithPopup } from "firebase/auth";

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

// ------------------------------
//     🔵 LOGIN CON GITHUB
// ------------------------------
export const githubProvider = new GithubAuthProvider();

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

// ------------------------------
//     🔴 LOGIN CON GOOGLE
// ------------------------------
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    return {
      name: user.displayName || "Google User",
      email: user.email,
      avatar_url: user.photoURL,
      uid: user.uid,
    };
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
};


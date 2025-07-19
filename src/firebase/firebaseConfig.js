import { initializeApp } from "firebase/app";
import { getAuth ,GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNYN6OEcBdiBYPYrbzQ_3cvTGLg9j0F3o",
  authDomain: "react-blog-a1fa0.firebaseapp.com",
  projectId: "react-blog-a1fa0",
  storageBucket: "react-blog-a1fa0.firebasestorage.app",
  messagingSenderId: "952201435713",
  appId: "1:952201435713:web:cf201ba98e21893cd6c4c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
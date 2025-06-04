import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiZ8W9Fd_ypi4FlhmMQOFwKLRUQ3Ahd_k",
  authDomain: "rapid-app-ccd5a.firebaseapp.com",
  projectId: "rapid-app-ccd5a",
  storageBucket: "rapid-app-ccd5a.firebasestorage.app",
  messagingSenderId: "297611359314",
  appId: "1:297611359314:web:774463c3e841a5a2029b8b",
  measurementId: "G-142PF8NS21",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication services
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Get user role
    const userRole = await getUserRole(userCredential.user.uid);
    return { user: userCredential.user, role: userRole, error: null };
  } catch (error) {
    return { user: null, role: null, error: error.message };
  }
};

export const registerWithEmailAndPassword = async (
  email,
  password,
  department
) => {
  try {
    // Create the user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Check if this is the first user (will be admin)
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    const isFirstUser = usersSnapshot.empty;

    // Set the user's role in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      role: isFirstUser ? "admin" : department, // First user is admin
      createdAt: new Date().toISOString(),
    });

    return {
      user: userCredential.user,
      error: null,
      isAdmin: isFirstUser,
    };
  } catch (error) {
    console.error("Registration error:", error);
    let errorMessage = "An error occurred during registration.";

    // Firebase error codes
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "This email is already registered.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address.";
        break;
      case "auth/operation-not-allowed":
        errorMessage = "Email/password accounts are not enabled.";
        break;
      case "auth/weak-password":
        errorMessage = "Password is too weak.";
        break;
      default:
        errorMessage = error.message;
    }

    return { user: null, error: errorMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Firestore services
export const setUserRole = async (userId, role) => {
  try {
    await setDoc(doc(db, "users", userId), {
      role,
      createdAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getUserRole = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

export { auth, db };

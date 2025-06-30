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
  query,
  where,
  updateDoc,
  addDoc,
  serverTimestamp,
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

    // Check if this is the first user (will be superadmin)
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    const isFirstUser = usersSnapshot.empty;

    // Set the user's role in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      role: isFirstUser ? "superadmin" : department, // First user is superadmin
      createdAt: new Date().toISOString(),
    });

    return {
      user: userCredential.user,
      error: null,
      isAdmin: isFirstUser,
      role: isFirstUser ? "superadmin" : department,
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

export const createAdminUser = async (
  email,
  password,
  department,
  createdByUid,
  profileData = {}
) => {
  try {
    // Verify the creator is a SuperAdmin
    const creatorRole = await getUserRole(createdByUid);
    if (creatorRole !== "superadmin") {
      return {
        user: null,
        error: "Only SuperAdmin users can create admin accounts",
      };
    }

    // Create the user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Set the user's role and profile data
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      role: "admin",
      department,
      createdBy: createdByUid,
      createdAt: new Date().toISOString(),
      name: profileData.name || "",
      username: profileData.username || "",
      phoneNumber: profileData.phoneNumber || "",
      country: profileData.country || "",
      state: profileData.state || "",
      city: profileData.city || "",
      address: profileData.address || "",
      postalCode: profileData.postalCode || "",
    });

    return {
      user: userCredential.user,
      error: null,
      role: "admin",
    };
  } catch (error) {
    console.error("Admin creation error:", error);
    let errorMessage = "An error occurred during admin creation.";

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

// Check if SuperAdmin exists
export const checkSuperAdminExists = async () => {
  try {
    const usersRef = collection(db, "users");
    const superAdminQuery = query(usersRef, where("role", "==", "superadmin"));
    const querySnapshot = await getDocs(superAdminQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking for SuperAdmin:", error);
    return false;
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

// Profile services
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { profile: userDoc.data(), error: null };
    }
    return { profile: null, error: "User profile not found" };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { profile: null, error: error.message };
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      name: profileData.name || "",
      username: profileData.username || "",
      phoneNumber: profileData.phoneNumber || "",
      country: profileData.country || "",
      state: profileData.state || "",
      city: profileData.city || "",
      address: profileData.address || "",
      postalCode: profileData.postalCode || "",
      updatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { error: error.message };
  }
};

// Function to record user activities
export const recordActivity = async (user, description) => {
  try {
    const activitiesRef = collection(db, "recent-activities");
    await addDoc(activitiesRef, {
      user: user,
      description: description,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error recording activity:", error);
  }
};

export { auth, db };

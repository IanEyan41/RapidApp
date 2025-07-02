import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import {
  auth,
  db,
  updateUserProfile,
  getUserProfile,
} from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "../Dashboard/Sidebar";
import NotificationPanel from "../Dashboard/NotificationPanel";
import { useTheme } from "../../services/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { malaysiaStates, malaysiaCities } from "../../utils/malaysiaData";

// Success Popup Component
const ProfileSuccessPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content employee-success-popup">
        <div className="employee-success-icon">✓</div>
        <h2>Success</h2>
        <p>Your profile has been updated successfully!</p>
        <button className="ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    phoneNumber: "",
    email: "",
    country: "Malaysia", // Default to Malaysia
    state: "",
    city: "",
    address: "",
    postalCode: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [availableCities, setAvailableCities] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/");
          return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);

          // Set display name from profile or email
          if (userData.name) {
            setUserName(userData.name);
          } else {
            setUserName(user.email.split("@")[0]);
          }

          // Set profile data
          const profileDataFromDb = {
            name: userData.name || "",
            username: userData.username || "",
            phoneNumber: userData.phoneNumber || "",
            email: userData.email || user.email,
            country: "Malaysia", // Always set to Malaysia
            state: userData.state || "",
            city: userData.city || "",
            address: userData.address || "",
            postalCode: userData.postalCode || "",
          };

          setProfileData(profileDataFromDb);
          setFormData(profileDataFromDb);

          // Check if malaysiaCities is defined before accessing it
          if (
            typeof malaysiaCities !== "undefined" &&
            userData.state &&
            malaysiaStates.includes(userData.state) &&
            malaysiaCities[userData.state]
          ) {
            setAvailableCities(malaysiaCities[userData.state]);
          } else {
            setAvailableCities([]);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAvailableCities([]);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateUserProfile(user.uid, formData);
      setProfileData(formData);
      setIsEditing(false);

      // Show success popup
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If state is changed, update the available cities and reset the city
    if (name === "state") {
      // Only set cities if the state exists in our data
      const cities = value && malaysiaCities ? malaysiaCities[value] || [] : [];
      setAvailableCities(cities);

      setFormData({
        ...formData,
        [name]: value,
        city: "", // Reset city when state changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className={`dashboard-container ${theme}-theme`}>
      <Sidebar userRole={userRole} />

      <div className="main-content">
        <header className="dashboard-header">
          <h1>Profile</h1>
          <div className="header-controls">
            <div className="search-bar">
              <input type="text" placeholder="Search Anything..." />
            </div>
            <div className="theme-toggle" onClick={toggleTheme}>
              {theme === "dark" ? (
                <BsSun className="theme-icon" />
              ) : (
                <BsMoon className="theme-icon" />
              )}
            </div>
            <div className="user-profile">
              <div className="user-avatar">
                <FaUserCircle className="user-icon" />
              </div>
              <span className="user-name">{userName}</span>
            </div>
          </div>
        </header>

        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              <FaUserCircle className="profile-avatar-icon" />
            </div>
            {!isEditing && (
              <button className="edit-profile-btn" onClick={handleEditProfile}>
                Edit Profile
              </button>
            )}
          </div>

          <div className="profile-form">
            <div className="profile-field full-width">
              <label>Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="profile-value">{profileData.name}</div>
              )}
            </div>

            <div className="profile-field full-width">
              <label>Username</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                />
              ) : (
                <div className="profile-value">{profileData.username}</div>
              )}
            </div>

            <div className="profile-field">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="profile-value">{profileData.phoneNumber}</div>
              )}
            </div>

            <div className="profile-field">
              <label>E-mail</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  disabled
                />
              ) : (
                <div className="profile-value">{profileData.email}</div>
              )}
            </div>

            <div className="profile-field">
              <label>Country</label>
              {isEditing ? (
                <input
                  type="text"
                  name="country"
                  value="Malaysia"
                  disabled
                  className="disabled-input"
                />
              ) : (
                <div className="profile-value">Malaysia</div>
              )}
            </div>

            <div className="profile-field">
              <label>State</label>
              {isEditing ? (
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select State</option>
                  {malaysiaStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="profile-value">{profileData.state}</div>
              )}
            </div>

            <div className="profile-field">
              <label>City</label>
              {isEditing ? (
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.state}
                >
                  <option value="">Select City</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="profile-value">{profileData.city}</div>
              )}
            </div>

            <div className="profile-field full-width">
              <label>Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                />
              ) : (
                <div className="profile-value">{profileData.address}</div>
              )}
            </div>

            <div className="profile-field">
              <label>Postal/ZIP Code</label>
              {isEditing ? (
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postal/zip code"
                />
              ) : (
                <div className="profile-value">{profileData.postalCode}</div>
              )}
            </div>

            {isEditing && (
              <div className="profile-actions">
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSaveProfile}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <NotificationPanel />

      {/* Success Popup */}
      {showSuccessPopup && (
        <ProfileSuccessPopup onClose={handleCloseSuccessPopup} />
      )}
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css"; // You can style the component with your custom CSS
import avatarPlaceholder from "../assets/images/avatar.jpg";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);  // State for the selected image
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [profilePicture, setProfilePicture] = useState(null); // State for storing profile picture URL
  const [uploadSuccess, setUploadSuccess] = useState(null); // State for upload success message

  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        // Fetch user profile data (excluding profile picture)
        const response = await axios.get(
          `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-retrieve-profile?username=${username}`
        );

        if (response.status === 200 && response.data) {
          setProfileData(response.data);
          
          // Fetch profile picture URL using the new Cloud Function
          const pictureResponse = await axios.get(
            `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-get-profile-picture?username=${username}`
          );
          
          if (pictureResponse.status === 200 && pictureResponse.data.profilePictureUrl) {
            setProfilePicture(pictureResponse.data.profilePictureUrl);
          }
        } else {
          setError("Failed to fetch profile data.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setSelectedImage(file);  // Set the selected image file
      setImagePreview(URL.createObjectURL(file));  // Create a local URL for preview
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    try {
      // Step 1: Get the signed URL from the Cloud Function
      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-profile-picture",
        {
          username: username,
          filename: selectedImage.name,
          contentType: selectedImage.type,
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to get signed URL");
      }

      const { uploadUrl, filename } = response.data;

      // Step 2: Upload the image using the signed URL
      const uploadResponse = await axios.put(uploadUrl, selectedImage, {
        headers: {
          "Content-Type": selectedImage.type,
        },
      });

      if (uploadResponse.status === 200) {
        console.log("Profile picture uploaded successfully!");

         // Set the success message
         setUploadSuccess("Profile picture uploaded successfully!");

        // Step 3: Re-fetch the profile data to update the UI with the new profile picture
        const profileResponse = await axios.get(
          `https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/puntualia-retrieve-profile?username=${username}`
        );
        console.log("Profile Data:", profileResponse.data);

        if (profileResponse.status === 200 && profileResponse.data) {
          setProfileData(profileResponse.data);
        } else {
          console.error("Failed to fetch updated profile data");
        }
      } else {
        throw new Error("Failed to upload image to Cloud Storage");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload profile picture.");
    }
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      <div className="profile-container">
        <div className="profile-details">
          <p><strong>Username:</strong> {profileData.username}</p>
          <p><strong>Fullname:</strong> {profileData.fullname}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Business:</strong> {profileData.company}</p>
          <p><strong>Slug:</strong> {profileData.businessSlug}</p>
          <p><strong>Address:</strong> {profileData.address}</p>
          <p><strong>Phone:</strong> {profileData.phone}</p>
          <p><strong>City:</strong> {profileData.city}</p>
        </div>
        <div className="profile-picture">
          <img
            src={imagePreview || profilePicture || avatarPlaceholder}
            alt="Profile"
            className="profile-image"
          />
           <p className="profile-picture-note">
    This picture will appear on the user interface for your business.
  </p>
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="profile-image-input"
              style={{ display: "none" }}  // Hide the default file input
            />
            <label htmlFor="profile-image-input" className="upload-button">
              Choose Image
            </label>
            <button onClick={handleImageUpload} className="upload-button">
              Upload
            </button>
          </div>
          {/* Success message */}

          {uploadSuccess && <p className="upload-success-message">{uploadSuccess}</p>}

        </div>
      </div>
    </div>
  );
};

export default Profile;

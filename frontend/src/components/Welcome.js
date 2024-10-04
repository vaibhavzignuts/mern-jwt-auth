import React from "react";
import { useAuth } from "../hooks/Authhook";

const Welcome = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect or show a message
    } catch (error) {
      console.error("Logout failed", error);
      // Handle error (show message to user)
    }
  };

  return (
    <div>
      {user && <h1>Welcome, {user.name}!</h1>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Welcome;

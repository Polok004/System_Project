import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const updateUser = (data) => {
    setCurrentUser(data);
    localStorage.setItem("user", JSON.stringify(data));  // Store updated user in localStorage
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // Check if the stored user exists in localStorage before setting
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []); // Only run once on mount

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

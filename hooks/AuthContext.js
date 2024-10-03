import React, { createContext, useState, useEffect, useContext } from 'react';



const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

 const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
   
  };

  const value = {
    user,
    logout,
    loading,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider
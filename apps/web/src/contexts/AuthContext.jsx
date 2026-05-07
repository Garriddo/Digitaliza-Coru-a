import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(pb.authStore.model);
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial check
    const checkAuth = async () => {
      setIsAuthenticated(pb.authStore.isValid);
      if (pb.authStore.isValid && pb.authStore.model) {
        try {
          // Fetch full user record to ensure we have latest plan and estado
          const fullUser = await pb.collection('users').getOne(pb.authStore.model.id, { $autoCancel: false });
          setCurrentUser(fullUser);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();

    const unsubscribe = pb.authStore.onChange((token, model) => {
      setIsAuthenticated(!!token);
      setCurrentUser(model);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
    // Fetch full user record to ensure all fields (plan, estado) are properly loaded
    const fullUser = await pb.collection('users').getOne(authData.record.id, { $autoCancel: false });
    setCurrentUser(fullUser);
    return authData;
  };

  const register = async (email, password, name) => {
    const data = {
      email,
      password,
      passwordConfirm: password,
      name,
    };
    const record = await pb.collection('users').create(data, { $autoCancel: false });
    return record;
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
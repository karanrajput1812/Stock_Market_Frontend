import React, { createContext, useState, useContext } from 'react';
import { apiClient } from '../components/UserComponent/Api/ApiClient';
import { executeJwtAuthenticationService } from '../components/UserComponent/Api/AuthenticationApiService';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  async function settingUserId(userId) {
    setUserId(userId);
    console.log("Setting user ID:", userId);
  } 

  async function login(username, password) {
    try {
      console.log('Login successful');
      const response = await executeJwtAuthenticationService(username, password);
      if (response.status === 200) {
        
        const jwtToken = 'Bearer ' + response.data.token
        setIsAuthenticated(true);
        setUsername(username);
        setToken(jwtToken);

        if (!apiClient.interceptors.request.handlers.length) {
          apiClient.interceptors.request.use((config) => {
            console.log('Intercepting request and adding JWT token');
            config.headers.Authorization = jwtToken;
            return config;
          });
        }

        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      logout();
      console.error('Login error:', error);
      return false;
    }
  }

  function logout() {
    setIsAuthenticated(false);
    setToken(null);
    setUsername(''); 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, token, login, logout,settingUserId,userId }}>
      {children}
    </AuthContext.Provider>
  );
}
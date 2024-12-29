import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authenticated_user, login, logout, register, googleLog} from '../endpoints';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();
    
    const get_authenticated_user = async () => {
      const access_token = localStorage.getItem('access_token');
        try {
          const user = await authenticated_user();
          setUser(user);
        } catch (error) {
          setUser(null); // If the request fails, set the user to null
        } finally {
          setLoading(false); // Set loading to false after request completes
        }
    };

    const loginUser = async (username, password) => {
        const user = await login(username, password)
        if (user) {
          setUser(user)
          nav('/project-dashboard')
        } else {
          alert('Incorrect Email or password')
        }
    }

    const logoutUser = async () => {
      await logout();
      setUser(null);  // Clear user state
      window.location.href = '/login';
    }

    const registerUser = async (username, email, password, passwordConfirm) => {
      
      try {
        if(password === passwordConfirm){
        await register(username, email, password)
        console.log('user signed up')
        alert('User successfully registered')
        nav('/login')
      }
      } catch {
        alert('error registering user')
        console.log("user didn'signed up")

      }
    };
    const googleLoginUser = async (token) => {
      try {
          // Call the backend API for Google login
          const response = await axios.post(googleLog,{credential :token}, {withCredentials:true}); 
          console.log(response.data);
          if (response?.data?.access_token && response?.data?.refresh_token) {
              // Store tokens in localStorage
              localStorage.setItem('access_token', response.data.access_token);
              localStorage.setItem('refresh_token', response.data.refresh_token);

              // Set user state (if user info is returned in the response)
              setUser(response.data.user);
              window.location.href = '/project-dashboard';
          } else {
              alert('Google login faileded');
          }
      } catch (error) {
          console.error('Google login failed', error);
          alert('Failed to log in with Google');
      }
  };
  
    useEffect(() => {
        get_authenticated_user();
    }, [window.location.pathname])

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, registerUser, googleLoginUser }}>
          {children}
        </AuthContext.Provider>
      );
}

export const useAuth = () => useContext(AuthContext);
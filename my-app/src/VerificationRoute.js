import React from 'react';
import { Navigate } from 'react-router-dom';

const VerificationRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token_access");

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default VerificationRoute;

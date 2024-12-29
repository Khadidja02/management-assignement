import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      nav('/login');
    }
  }, [loading, user, nav]);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  return user ? children : null;

};

export default PrivateRoute;
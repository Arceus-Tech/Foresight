import { Navigate } from 'react-router-dom';
import { useContext, ReactNode } from 'react';
import AuthContext from './AuthContext';

function PrivateRoute({ children }: { children: ReactNode }) {
  const user = useContext(AuthContext);

  return !user ? <Navigate to="/login" /> : children;
}

export default PrivateRoute;

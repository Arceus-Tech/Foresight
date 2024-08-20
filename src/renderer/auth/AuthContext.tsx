import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
  exp: number;
  iat: number;
  username?: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: DecodedToken | null;
  authTokens: AuthTokens | null;
  loginUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<DecodedToken | null>(() => {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? jwtDecode(tokens) : null;
  });

  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens) : null;
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const username = e.currentTarget.username.value;
      const password = e.currentTarget.password.value;

      const response = await fetch(`${process.env.CRM_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data) {
        localStorage.setItem('authTokens', JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        navigate('/');
      } else {
        alert('Something went wrong while logging in the user!');
      }
    },
    [navigate],
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem('authTokens');
    setAuthTokens(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const updateToken = async () => {
      if (!authTokens) return;

      const response = await fetch(
        `${process.env.CRM_URL}/api/token/refresh/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: authTokens.refresh }),
        },
      );

      const data = await response.json();
      if (response.status === 200 && data) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
      } else {
        logoutUser();
      }

      setLoading(false);
    };

    if (loading) {
      updateToken();
    }

    const REFRESH_INTERVAL = 1000 * 60 * 4; // 4 minutes
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [authTokens, loading, logoutUser]); // Removed updateToken from dependencies

  const contextData = useMemo(
    () => ({
      user,
      authTokens,
      loginUser,
      logoutUser,
    }),
    [user, authTokens, loginUser, logoutUser],
  ); // Removed loginUser and logoutUser from useMemo dependencies

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}

export default AuthContext;


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  badges: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=John',
  badges: ['Debater', 'Question Master']
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (location.pathname !== '/auth') {
      // Redirect to auth page if not authenticated and not already there
      navigate('/auth');
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast.success('Logged in successfully');
        navigate('/');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (name && email && password) {
        const newUser = {
          ...mockUser,
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${name}`
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        toast.success('Registered successfully');
        navigate('/');
      } else {
        throw new Error('Please fill all required fields');
      }
    } catch (error) {
      toast.error('Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

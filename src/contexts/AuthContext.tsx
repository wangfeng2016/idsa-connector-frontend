import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { type UserRole } from './RoleContext';

interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// 预定义的用户角色映射
const getUserRole = (username: string): UserRole | null => {
  switch (username) {
    case 'admin':
      return {
        type: 'enterprise',
        name: '企业用户',
        permissions: ['data:provide', 'data:manage', 'data:consume', 'data:subscribe'],
        organizationId: 'enterprise-org'
      };
    default:
      return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    // 简单的用户名密码验证（实际项目中应该调用后端API）
    const validCredentials = [
      { username: 'admin', password: 'admin' }
    ];

    const credential = validCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (credential) {
      const role = getUserRole(username);
      if (role) {
        setUser({ username, role });
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
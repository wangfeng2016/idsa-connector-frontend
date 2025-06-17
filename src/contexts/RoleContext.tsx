import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface UserRole {
  type: 'enterprise';
  name: string;
  permissions: string[];
  organizationId: string;
}

interface RoleContextType {
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
}

const defaultRole: UserRole = {
  type: 'enterprise',
  name: '企业用户',
  permissions: ['data:provide', 'data:manage', 'data:consume', 'data:subscribe'],
  organizationId: 'enterprise-org'
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(defaultRole);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const hasPermission = (permission: string) => {
    return currentRole.permissions.includes('*') || currentRole.permissions.includes(permission);
  };

  const value: RoleContextType = {
    currentRole,
    switchRole,
    hasPermission
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export { RoleContext };
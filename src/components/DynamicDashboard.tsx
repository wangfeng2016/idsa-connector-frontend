import React from 'react';
import { useRole } from '../contexts/RoleContext';
import ProviderDashboard from '../pages/provider/Dashboard';

const DynamicDashboard: React.FC = () => {
  const { currentRole } = useRole();

  switch (currentRole.type) {
//    case 'consumer':
//      return <ConsumerDashboard />;
    case 'enterprise':
      return <ProviderDashboard />;
    default:
      return <ProviderDashboard />;
  }
};

export default DynamicDashboard;
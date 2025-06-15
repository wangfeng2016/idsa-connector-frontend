import React from 'react';
import { useRole } from '../contexts/RoleContext';
import OperatorDashboard from '../pages/operator/Dashboard';
import ProviderDashboard from '../pages/provider/Dashboard';

const DynamicDashboard: React.FC = () => {
  const { currentRole } = useRole();

  switch (currentRole.type) {
    case 'operator':
      return <OperatorDashboard />;
    case 'enterprise':
      return <ProviderDashboard />;
    default:
      return <OperatorDashboard />;
  }
};

export default DynamicDashboard;
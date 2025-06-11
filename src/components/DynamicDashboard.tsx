import React from 'react';
import { useRole } from '../contexts/RoleContext';
import OperatorDashboard from '../pages/operator/Dashboard';
import ProviderDashboard from '../pages/provider/Dashboard';
import ConsumerDashboard from '../pages/consumer/Dashboard';

const DynamicDashboard: React.FC = () => {
  const { currentRole } = useRole();

  switch (currentRole.type) {
    case 'operator':
      return <OperatorDashboard />;
    case 'provider':
      return <ProviderDashboard />;
    case 'consumer':
      return <ConsumerDashboard />;
    default:
      return <OperatorDashboard />;
  }
};

export default DynamicDashboard;
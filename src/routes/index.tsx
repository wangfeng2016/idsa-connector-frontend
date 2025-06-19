import { createHashRouter } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '../layouts/MainLayout';
import ToBeConstructed from '../pages/ToBeConstructed';

import DynamicDashboard from '../components/DynamicDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';



// 懒加载页面组件 - 提供者
const ProviderDataDiscovery = lazy(() => import('../pages/provider/resources/DataDiscovery'));
const ProviderResourceList = lazy(() => import('../pages/provider/resources/ResourceList'));

const ProviderResourceEdit = lazy(() => import('../pages/provider/resources/ResourceEdit'));
const ProviderPolicyList = lazy(() => import('../pages/provider/policies/PolicyList'));
const ProviderPolicyEdit = lazy(() => import('../pages/provider/policies/PolicyEdit'));
const ProviderDatasetPolicyEdit = lazy(() => import('../pages/provider/policies/DatasetPolicyEdit'));
const ProviderDatasetPolicyList = lazy(() => import('../pages/provider/policies/DatasetPolicyList'));
const ProviderConnectorStatus = lazy(() => import('../pages/provider/connections/ConnectorStatus'));
const ProviderDataExchange = lazy(() => import('../pages/provider/connections/DataExchange'));
const ProviderExchangeLogs = lazy(() => import('../pages/provider/connections/ExchangeLogs'));
const ProviderMarketplace = lazy(() => import('../pages/provider/ecosystem/Marketplace'));
const ProviderOnShelf = lazy(() => import('../pages/provider/ecosystem/onshelf'));
const ProviderServiceDiscovery = lazy(() => import('../pages/provider/ecosystem/ServiceDiscovery'));
const ProviderTransactions = lazy(() => import('../pages/provider/ecosystem/Transactions'));
const ProviderSystemConfig = lazy(() => import('../pages/provider/system/SystemConfig'));
// 提供者系统备份、插件、更新组件已映射到ToBeConstructed
const ProviderAuthentication = lazy(() => import('../pages/provider/identity/Authentication'));
const ProviderCertificateManagement = lazy(() => import('../pages/provider/identity/CertificateManagement'));
const ProviderRegisterDataSpace = lazy(() => import('../pages/provider/identity/RegisterDataSpace'));
const DatasetUsageAnalysis = lazy(() => import('../pages/provider/analytics/DatasetUsageAnalysis'));
const ProviderComplianceReports = lazy(() => import('../pages/provider/analytics/ComplianceReports'));
const ProviderDashboards = lazy(() => import('../pages/provider/analytics/Dashboards'));

const ProviderValueAssessment = lazy(() => import('../pages/provider/analytics/ValueAssessment'));


// 待构建的提供者组件
const ProviderToBeConstructed = () => <ToBeConstructed pageName="提供者功能页面" />;

// 懒加载页面组件 - 消费者
const ConsumerConnectorStatus = lazy(() => import('../pages/consumer/connections/ConnectorStatus'));
const ConsumerDataExchange = lazy(() => import('../pages/consumer/connections/DataExchange'));

const router = createHashRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DynamicDashboard />,
      },

      
      // 企业用户路由
      {
        path: 'enterprise/resources',
        element: <ProviderResourceList />,
      },
      {
        path: 'enterprise/resources/edit',
        element: <ProviderResourceEdit />,
      },
      {
        path: 'enterprise/quality',
        element: <ProviderToBeConstructed />,
      },


      {
        path: 'enterprise/policies',
        element: <ProviderPolicyList />,
      },
      {
        path: 'enterprise/policies/edit',
        element: <ProviderPolicyEdit />,
      },
      {
        path: 'enterprise/policies/dataset-policy-edit',
        element: <ProviderDatasetPolicyEdit />,
      },
      {
        path: 'enterprise/policies/dataset-policy-list',
        element: <ProviderDatasetPolicyList />,
      },
      {
        path: 'enterprise/publishing',
        element: <ProviderToBeConstructed />,
      },
      {
        path: 'enterprise/connections',
        element: <ProviderConnectorStatus />,
      },
      {
        path: 'enterprise/connections/exchange',
        element: <ProviderDataExchange />,
      },
      {
        path: 'enterprise/connections/logs',
        element: <ProviderExchangeLogs />,
      },
      {
        path: 'enterprise/ecosystem',
        element: <ProviderMarketplace />,
      },
      {
        path: 'enterprise/ecosystem/onshelf',
        element: <ProviderOnShelf />,
      },
      {
        path: 'enterprise/ecosystem/services',
        element: <ProviderServiceDiscovery />,
      },
      {
        path: 'enterprise/resources/data-discovery',
        element: <ProviderDataDiscovery />,
      },
      {
        path: 'enterprise/ecosystem/transactions',
        element: <ProviderTransactions />,
      },
      {
        path: 'enterprise/analytics',
        element: <DatasetUsageAnalysis />,
      },
      {
        path: 'enterprise/revenue',
        element: <ProviderToBeConstructed />,
      },
      {
        path: 'enterprise/system',
        element: <ProviderSystemConfig />,
      },
      {
        path: 'enterprise/system/backup',
        element: <ProviderToBeConstructed />,
      },
      {
        path: 'enterprise/system/plugins',
        element: <ProviderToBeConstructed />,
      },
      {
        path: 'enterprise/system/updates',
        element: <ProviderToBeConstructed />,
      },
      {
        path: 'enterprise/identity/register-dataspace',
        element: <ProviderRegisterDataSpace />,
      },
      {
        path: 'enterprise/auth',
        element: <ProviderAuthentication />,
      },
      {
        path: 'enterprise/auth/certificates',
        element: <ProviderCertificateManagement />,
      },
      {
        path: 'enterprise/analytics/compliance',
        element: <ProviderComplianceReports />,
      },
      {
        path: 'enterprise/analytics/dashboards',
        element: <ProviderDashboards />,
      },
      {
        path: 'enterprise/analytics/value',
        element: <ProviderValueAssessment />,
      },
      {
        path: 'enterprise/consumer-connections',
        element: <ConsumerConnectorStatus />,
      },
      {
        path: 'enterprise/consumer-connections/exchange',
        element: <ConsumerDataExchange />,
      },

      // 404页面
      {
        path: '*',
        element: <div>404 Not Found</div>,
      },
    ],
  },
]);

export default router;
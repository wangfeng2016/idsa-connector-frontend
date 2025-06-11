import { createHashRouter } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '../layouts/MainLayout';
import ToBeConstructed from '../pages/ToBeConstructed';
import { DataCatalogProvider } from '../contexts/DataCatalogContext';
import DynamicDashboard from '../components/DynamicDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';

// 懒加载页面组件 - 运营方
const OperatorResourceList = lazy(() => import('../pages/operator/resources/ResourceList'));
const OperatorResourceEdit = lazy(() => import('../pages/operator/resources/ResourceEdit'));
const OperatorPolicyList = lazy(() => import('../pages/operator/policies/PolicyList'));
const OperatorPolicyEdit = lazy(() => import('../pages/operator/policies/PolicyEdit'));
const OperatorConnectorStatus = lazy(() => import('../pages/operator/connections/ConnectorStatus'));
const OperatorDataExchange = lazy(() => import('../pages/operator/connections/DataExchange'));
const OperatorExchangeLogs = lazy(() => import('../pages/operator/connections/ExchangeLogs'));
const OperatorMarketplace = lazy(() => import('../pages/operator/ecosystem/Marketplace'));
const OperatorParticipants = lazy(() => import('../pages/operator/ecosystem/Participants'));
const OperatorServiceDiscovery = lazy(() => import('../pages/operator/ecosystem/ServiceDiscovery'));
const OperatorTransactions = lazy(() => import('../pages/operator/ecosystem/Transactions'));
const OperatorSystemConfig = lazy(() => import('../pages/operator/system/SystemConfig'));
const OperatorBackup = lazy(() => import('../pages/operator/system/Backup'));
const OperatorPlugins = lazy(() => import('../pages/operator/system/Plugins'));
const OperatorUpdates = lazy(() => import('../pages/operator/system/Updates'));
const OperatorAuthentication = lazy(() => import('../pages/operator/operation/Authentication'));
const OperatorCertificateManagement = lazy(() => import('../pages/operator/operation/CertificateManagement'));
const OperatorRegistrationApproval = lazy(() => import('../pages/operator/operation/RegistrationApproval'));
const OperatorComplianceReports = lazy(() => import('../pages/operator/analytics/ComplianceReports'));
const OperatorDashboards = lazy(() => import('../pages/operator/analytics/Dashboards'));

const OperatorValueAssessment = lazy(() => import('../pages/operator/analytics/ValueAssessment'));
const OperatorAccessControl = lazy(() => import('../pages/operator/security/AccessControl'));
const OperatorAuditLogs = lazy(() => import('../pages/operator/security/AuditLogs'));
const OperatorSecurityCompliance = lazy(() => import('../pages/operator/security/Compliance'));

// 待构建的运营方组件
const OperatorToBeConstructed = () => <ToBeConstructed pageName="运营方功能页面" />;

// 懒加载页面组件 - 提供者
const ProviderDataDiscovery = lazy(() => import('../pages/provider/resources/DataDiscovery'));
const ProviderResourceList = lazy(() => import('../pages/provider/resources/ResourceList'));
const ProviderDataCatalogManagement = lazy(() => import('../pages/provider/resources/DataCatalogManagement'));
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
const ConsumerResourceList = lazy(() => import('../pages/consumer/resources/ResourceList'));
const ConsumerResourceEdit = lazy(() => import('../pages/consumer/resources/ResourceEdit'));
const ConsumerPolicyList = lazy(() => import('../pages/consumer/policies/PolicyList'));
const ConsumerPolicyEdit = lazy(() => import('../pages/consumer/policies/PolicyEdit'));
const ConsumerConnectorStatus = lazy(() => import('../pages/consumer/connections/ConnectorStatus'));
const ConsumerDataExchange = lazy(() => import('../pages/consumer/connections/DataExchange'));
const ConsumerExchangeLogs = lazy(() => import('../pages/consumer/connections/ExchangeLogs'));
const ConsumerMarketplace = lazy(() => import('../pages/consumer/ecosystem/marketplace'));
const ConsumerServiceDiscovery = lazy(() => import('../pages/consumer/ecosystem/ServiceDiscovery'));
const ConsumerTransactions = lazy(() => import('../pages/consumer/ecosystem/Transactions'));
const ConsumerSystemConfig = lazy(() => import('../pages/consumer/system/SystemConfig'));
// 消费者系统备份、插件、更新组件已映射到ToBeConstructed
const ConsumerAuthentication = lazy(() => import('../pages/consumer/identity/Authentication'));
const ConsumerCertificateManagement = lazy(() => import('../pages/consumer/identity/CertificateManagement'));
const ConsumerRegisterDataSpace = lazy(() => import('../pages/consumer/identity/RegisterDataspace'));
const ConsumerComplianceReports = lazy(() => import('../pages/consumer/analytics/ComplianceReports'));
const ConsumerDashboards = lazy(() => import('../pages/consumer/analytics/Dashboards'));

const ConsumerValueAssessment = lazy(() => import('../pages/consumer/analytics/ValueAssessment'));

// 消费者其他功能组件已映射到ToBeConstructed

// 待构建的消费者组件
const ConsumerToBeConstructed = () => <ToBeConstructed pageName="消费者功能页面" />;
const ConsumerDataSubscription = lazy(() => import('../pages/consumer/subscriptions/DataSubscription'));
const ConsumerManageSubscription = lazy(() => import('../pages/consumer/subscriptions/ManageSubscription'));

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
      // 运营方路由
      {
        path: 'operator/resources',
        element: <OperatorResourceList />,
      },
      {
        path: 'operator/resources/edit',
        element: <OperatorResourceEdit />,
      },
      {
        path: 'operator/policies',
        element: <OperatorPolicyList />,
      },
      {
        path: 'operator/policies/edit',
        element: <OperatorPolicyEdit />,
      },
      {
        path: 'operator/connections',
        element: <OperatorConnectorStatus />,
      },
      {
        path: 'operator/connections/exchange',
        element: <OperatorDataExchange />,
      },
      {
        path: 'operator/connections/logs',
        element: <OperatorExchangeLogs />,
      },
      {
        path: 'operator/ecosystem',
        element: <OperatorMarketplace />,
      },
      {
        path: 'operator/ecosystem/participants',
        element: <OperatorParticipants />,
      },
      {
        path: 'operator/ecosystem/services',
        element: <OperatorServiceDiscovery />,
      },
      {
        path: 'operator/ecosystem/transactions',
        element: <OperatorTransactions />,
      },
      {
        path: 'operator/system',
        element: <OperatorSystemConfig />,
      },
      {
        path: 'operator/system/backup',
        element: <OperatorBackup />,
      },
      {
        path: 'operator/system/plugins',
        element: <OperatorPlugins />,
      },
      {
        path: 'operator/system/updates',
        element: <OperatorUpdates />,
      },
      {
        path: 'operator/operation/auth',
        element: <OperatorAuthentication />,
      },
      {
        path: 'operator/operation/certificates',
        element: <OperatorCertificateManagement />,
      },
      {
        path: 'operator/operation/registration-approval',
        element: <OperatorRegistrationApproval />,
      },
      {
        path: 'operator/analytics',
        element: <OperatorComplianceReports />,
      },
      {
        path: 'operator/analytics/compliance',
        element: <OperatorComplianceReports />,
      },
      {
        path: 'operator/analytics/dashboards',
        element: <OperatorDashboards />,
      },
      {
        path: 'operator/analytics/value',
        element: <OperatorValueAssessment />,
      },
      {
        path: 'operator/governance',
        element: <OperatorToBeConstructed />,
      },
      {
        path: 'operator/monitoring',
        element: <OperatorToBeConstructed />,
      },
      {
        path: 'operator/security/access',
        element: <OperatorAccessControl />,
      },
      {
        path: 'operator/security/audit',
        element: <OperatorAuditLogs />,
      },
      {
        path: 'operator/security/compliance',
        element: <OperatorSecurityCompliance />,
      },
      
      // 提供者路由
      {
        path: 'provider/resources',
        element: <ProviderResourceList />,
      },
      {
        path: 'provider/resources/edit',
        element: <ProviderResourceEdit />,
      },
      {
        path: 'provider/quality',
        element: <ProviderToBeConstructed />,
      },
      {
        path: 'provider/catalog',
        element: (
          <DataCatalogProvider>
            <ProviderDataCatalogManagement />
          </DataCatalogProvider>
        ),
      },

      {
        path: 'provider/policies',
        element: <ProviderPolicyList />,
      },
      {
        path: 'provider/policies/edit',
        element: <ProviderPolicyEdit />,
      },
      {
        path: 'provider/policies/dataset-policy-edit',
        element: <ProviderDatasetPolicyEdit />,
      },
      {
        path: 'provider/policies/dataset-policy-list',
        element: <ProviderDatasetPolicyList />,
      },
      {
        path: 'provider/publishing',
        element: <ProviderToBeConstructed />,
      },
      {
        path: 'provider/connections',
        element: <ProviderConnectorStatus />,
      },
      {
        path: 'provider/connections/exchange',
        element: <ProviderDataExchange />,
      },
      {
        path: 'provider/connections/logs',
        element: <ProviderExchangeLogs />,
      },
      {
        path: 'provider/ecosystem',
        element: <ProviderMarketplace />,
      },
      {
        path: 'provider/ecosystem/onshelf',
        element: <ProviderOnShelf />,
      },
      {
        path: 'provider/ecosystem/services',
        element: <ProviderServiceDiscovery />,
      },
      {
        path: 'provider/resources/data-discovery',
        element: <ProviderDataDiscovery />,
      },
      {
        path: 'provider/ecosystem/transactions',
        element: <ProviderTransactions />,
      },
      {
        path: 'provider/analytics',
        element: <DatasetUsageAnalysis />,
      },
      {
        path: 'provider/revenue',
        element: <ProviderToBeConstructed />,
      },
      {
        path: 'provider/system',
        element: <ProviderSystemConfig />,
      },
      {
        path: 'provider/system/backup',
        element: <ProviderToBeConstructed />,
      },
      {
        path: 'provider/system/plugins',
        element: <ProviderToBeConstructed />,
      },
      {
        path: 'provider/system/updates',
        element: <ProviderToBeConstructed />,
      },
      {
        path: 'provider/identity/register-dataspace',
        element: <ProviderRegisterDataSpace />,
      },
      {
        path: 'provider/auth',
        element: <ProviderAuthentication />,
      },
      {
        path: 'provider/auth/certificates',
        element: <ProviderCertificateManagement />,
      },
      {
        path: 'provider/analytics/compliance',
        element: <ProviderComplianceReports />,
      },
      {
        path: 'provider/analytics/dashboards',
        element: <ProviderDashboards />,
      },
      {
        path: 'provider/analytics/value',
        element: <ProviderValueAssessment />,
      },
      
      // 消费者路由
      {
        path: 'consumer/resources',
        element: <ConsumerResourceList />,
      },
      {
        path: 'consumer/resources/edit',
        element: <ConsumerResourceEdit />,
      },
      {
        path: 'consumer/policies',
        element: <ConsumerPolicyList />,
      },
      {
        path: 'consumer/policies/edit',
        element: <ConsumerPolicyEdit />,
      },
      {
        path: 'consumer/connections',
        element: <ConsumerConnectorStatus />,
      },
      {
        path: 'consumer/connections/exchange',
        element: <ConsumerDataExchange />,
      },
      {
        path: 'consumer/connections/logs',
        element: <ConsumerExchangeLogs />,
      },
      {
        path: 'consumer/ecosystem',
        element: <ConsumerMarketplace />,
      },
      {
        path: 'consumer/ecosystem/participants',
        element: <ConsumerToBeConstructed />,
      },
      {
        path: 'consumer/ecosystem/services',
        element: <ConsumerServiceDiscovery />,
      },
      {
        path: 'consumer/ecosystem/transactions',
        element: <ConsumerTransactions />,
      },
      {
        path: 'consumer/system',
        element: <ConsumerSystemConfig />,
      },
      {
        path: 'consumer/system/backup',
        element: <ConsumerToBeConstructed />,
      },
      {
        path: 'consumer/system/plugins',
        element: <ConsumerToBeConstructed />,
      },
      {
        path: 'consumer/system/updates',
        element: <ConsumerToBeConstructed />,
      },
      {
        path: 'consumer/identity/register-dataspace',
        element: <ConsumerRegisterDataSpace />,
      },
      {
        path: 'consumer/auth',
        element: <ConsumerAuthentication />,
      },
      {
        path: 'consumer/auth/certificates',
        element: <ConsumerCertificateManagement />,
      },
      {
        path: 'consumer/analytics',
        element: <ConsumerComplianceReports />,
      },
      {
        path: 'consumer/analytics/compliance',
        element: <ConsumerComplianceReports />,
      },
      {
        path: 'consumer/analytics/dashboards',
        element: <ConsumerDashboards />,
      },
      {
        path: 'consumer/analytics/value',
        element: <ConsumerValueAssessment />,
      },
      {
        path: 'consumer/discovery',
        element: <ConsumerToBeConstructed />,
      },
      {
        path: 'consumer/subscriptions',
        element: <ConsumerManageSubscription />,
      },
      {
        path: 'consumer/subscriptions/subscribe',
        element: <ConsumerDataSubscription />,
      },
      {
        path: 'consumer/monitoring',
        element: <ConsumerToBeConstructed />,
      },
      {
        path: 'consumer/integration',
        element: <ConsumerToBeConstructed />,
      },
      {
        path: 'consumer/procurement',
        element: <ConsumerToBeConstructed />,
      },
      {
        path: 'consumer/costs',
        element: <ConsumerToBeConstructed />,
      },
      {
        path: 'consumer/lineage',
        element: <ConsumerToBeConstructed />,
      },
      {
        path: 'consumer/quality',
        element: <ConsumerToBeConstructed />,
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
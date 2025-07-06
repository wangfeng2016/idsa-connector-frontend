import { createHashRouter } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '../layouts/MainLayout';
import ToBeConstructed from '../pages/ToBeConstructed';

import DynamicDashboard from '../components/DynamicDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';



// 数据集管理组件
const ProviderResourceList = lazy(() => import('../pages/provider/resources/ResourceList'));
const ProviderResourceDetail = lazy(() => import('../pages/provider/resources/ResourceDetail'));
const ProviderResourceUpload = lazy(() => import('../pages/provider/resources/ResourceUpload'));
const ProviderResourceTransform = lazy(() => import('../pages/provider/resources/ResourceTransform'));
const ProviderPolicyList = lazy(() => import('../pages/provider/policies/PolicyList'));
const ProviderPolicyEdit = lazy(() => import('../pages/provider/policies/PolicyEdit'));
const ProviderResourcePolicyEdit = lazy(() => import('../pages/provider/policies/ResourcePolicyEdit'));
const ProviderResourcePolicyList = lazy(() => import('../pages/provider/policies/ResourcePolicyList'));
const ProviderConnectorStatus = lazy(() => import('../pages/provider/connections/ConnectorStatus'));
const ProviderDataExchange = lazy(() => import('../pages/provider/connections/DataExchange'));
const ProviderExchangeLogs = lazy(() => import('../pages/provider/connections/ExchangeLogs'));
const ConsumerMarketplace = lazy(() => import('../pages/consumer/ecosystem/Marketplace'));
const ProviderSystemConfig = lazy(() => import('../pages/provider/system/SystemConfig'));
// 提供者系统备份、插件、更新组件已映射到ToBeConstructed
const ResourceUsageAnalysis = lazy(() => import('../pages/provider/analytics/ResourceUsageAnalysis'));
const ProviderComplianceReports = lazy(() => import('../pages/provider/analytics/ComplianceReports'));
const ProviderDashboards = lazy(() => import('../pages/provider/analytics/Dashboards'));

const ProviderValueAssessment = lazy(() => import('../pages/provider/analytics/ValueAssessment'));


// 待构建的提供者组件
const ProviderToBeConstructed = () => <ToBeConstructed pageName="提供者功能页面" />;

// 懒加载页面组件 - 消费者
const ConsumerConnectorStatus = lazy(() => import('../pages/consumer/connections/ConnectorStatus'));
const ConsumerDataExchange = lazy(() => import('../pages/consumer/connections/DataExchange'));
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

      
      // 数据集管理路由
      {
        path: 'enterprise/resources',
        element: <ProviderResourceList />,
      },
      {
        path: 'enterprise/resources/upload',
        element: <ProviderResourceUpload />,
      },
      {
        path: 'enterprise/resources/transform',
        element: <ProviderResourceTransform />,
      },
      {
        path: 'enterprise/resources/:id',
        element: <ProviderResourceDetail />,
      },
      {
        path: 'enterprise/resources/edit/:id',
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
        path: 'enterprise/policies/management',
        element: <ToBeConstructed pageName="策略管理" />,
      },
      {
        path: 'enterprise/policies/resources-policy-edit',
        element: <ProviderResourcePolicyEdit />,
      },
      {
        path: 'enterprise/policies/resources-policy-list',
        element: <ProviderResourcePolicyList />,
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
        element: <ConsumerMarketplace />,
      },
      {
        path: 'enterprise/analytics',
        element: <ResourceUsageAnalysis />,
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
      {
        path: 'enterprise/subscriptions/subscribe',
        element: <ConsumerDataSubscription />,
      },
      {
        path: 'enterprise/subscriptions',
        element: <ConsumerManageSubscription />,
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
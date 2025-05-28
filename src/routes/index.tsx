import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// 懒加载页面组件
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

// 加载中组件
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    }}
  >
    <CircularProgress />
  </Box>
);

// 懒加载包装器
const lazyLoad = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

// 页面组件
const Dashboard = lazy(() => import('../pages/Dashboard'));

// 数据资源管理
const ResourceList = lazy(() => import('../pages/resources/ResourceList'));
const ResourceEdit = lazy(() => import('../pages/resources/ResourceEdit'));

// 数据使用控制策略管理
const PolicyList = lazy(() => import('../pages/policies/PolicyList'));
const PolicyEditor = lazy(() => import('../pages/policies/PolicyEditor'));

// 数据连接与交换管理
const ConnectorStatus = lazy(() => import('../pages/connections/ConnectorStatus'));
const ExchangeLogs = lazy(() => import('../pages/connections/ExchangeLogs'));

// 身份与安全管理
const Authentication = lazy(() => import('../pages/identity/Authentication'));
const CertificateManagement = lazy(() => import('../pages/identity/CertificateManagement'));
const AccessControl = lazy(() => import('../pages/security/AccessControl'));
const AuditLogs = lazy(() => import('../pages/security/AuditLogs'));
const Compliance = lazy(() => import('../pages/security/Compliance'));

// 数据空间生态交互
const Marketplace = lazy(() => import('../pages/ecosystem/Marketplace'));
const Transactions = lazy(() => import('../pages/ecosystem/Transactions'));
const ServiceDiscovery = lazy(() => import('../pages/ecosystem/ServiceDiscovery'));
const Participants = lazy(() => import('../pages/ecosystem/Participants'));

// 分析与报表
const DataFlow = lazy(() => import('../pages/analytics/DataFlow'));
const ValueAssessment = lazy(() => import('../pages/analytics/ValueAssessment'));
const ComplianceReports = lazy(() => import('../pages/analytics/ComplianceReports'));
const Dashboards = lazy(() => import('../pages/analytics/Dashboards'));

// 系统配置与管理
const SystemConfig = lazy(() => import('../pages/system/SystemConfig'));
const Plugins = lazy(() => import('../pages/system/Plugins'));
const Backup = lazy(() => import('../pages/system/Backup'));
const Updates = lazy(() => import('../pages/system/Updates'));

// 错误页面
const NotFound = lazy(() => import('../pages/errors/NotFound'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: lazyLoad(Dashboard),
      },
      // 数据资源管理
      {
        path: 'resources',
        element: lazyLoad(ResourceList),
      },
      {
        path: 'resources/edit',
        element: lazyLoad(ResourceEdit),
      },
      {
        path: 'resources/edit/:id',
        element: lazyLoad(ResourceEdit),
      },
      // 数据使用控制策略管理
      {
        path: 'policies',
        element: lazyLoad(PolicyList),
      },
      {
        path: 'policies/editor',
        element: lazyLoad(PolicyEditor),
      },
      {
        path: 'policies/editor/:id',
        element: lazyLoad(PolicyEditor),
      },
      // 数据连接与交换管理
      {
        path: 'connections/status',
        element: lazyLoad(ConnectorStatus),
      },
      {
        path: 'connections/logs',
        element: lazyLoad(ExchangeLogs),
      },
      // 身份与安全管理
      {
        path: 'security/auth',
        element: lazyLoad(Authentication),
      },
      {
        path: 'security/certificates',
        element: lazyLoad(CertificateManagement),
      },
      {
        path: 'security/access',
        element: lazyLoad(AccessControl),
      },
      {
        path: 'security/audit',
        element: lazyLoad(AuditLogs),
      },
      {
        path: 'security/compliance',
        element: lazyLoad(Compliance),
      },
      // 数据空间生态交互
      {
        path: 'ecosystem/marketplace',
        element: lazyLoad(Marketplace),
      },
      {
        path: 'ecosystem/transactions',
        element: lazyLoad(Transactions),
      },
      {
        path: 'ecosystem/services',
        element: lazyLoad(ServiceDiscovery),
      },
      {
        path: 'ecosystem/participants',
        element: lazyLoad(Participants),
      },
      // 分析与报表
      {
        path: 'analytics/flow',
        element: lazyLoad(DataFlow),
      },
      {
        path: 'analytics/value',
        element: lazyLoad(ValueAssessment),
      },
      {
        path: 'analytics/compliance',
        element: lazyLoad(ComplianceReports),
      },
      {
        path: 'analytics/dashboards',
        element: lazyLoad(Dashboards),
      },
      // 系统配置与管理
      {
        path: 'system/config',
        element: lazyLoad(SystemConfig),
      },
      {
        path: 'system/plugins',
        element: lazyLoad(Plugins),
      },
      {
        path: 'system/backup',
        element: lazyLoad(Backup),
      },
      {
        path: 'system/updates',
        element: lazyLoad(Updates),
      },
      // 404页面
      {
        path: '*',
        element: lazyLoad(NotFound),
      },
    ],
  },
]);

export default router;
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import useResponsive from '../hooks/useResponsive';
import { useRole } from '../contexts/RoleContext';

// 图标导入
import StorageIcon from '@mui/icons-material/Storage';
import PolicyIcon from '@mui/icons-material/Policy';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SecurityIcon from '@mui/icons-material/Security';
import StoreIcon from '@mui/icons-material/Store';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import ListIcon from '@mui/icons-material/List';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ExploreIcon from '@mui/icons-material/Explore';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TuneIcon from '@mui/icons-material/Tune';
import ExtensionIcon from '@mui/icons-material/Extension';
import BackupIcon from '@mui/icons-material/Backup';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import BusinessIcon from '@mui/icons-material/Business';
// 新增角色特定图标
import GavelIcon from '@mui/icons-material/Gavel';
import PublishIcon from '@mui/icons-material/Publish';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MonitorIcon from '@mui/icons-material/Monitor';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

interface SidebarProps {
  open: boolean;
  onDrawerToggle: () => void;
  drawerWidth: number;
}

const openedMixin = (theme: any, drawerWidth: number) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden' as const,
});

const closedMixin = (theme: any) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden' as const,
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface CustomDrawerProps {
  open?: boolean;
  drawerWidth?: number;
}

const Drawer = styled(MuiDrawer, { 
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth' 
})<CustomDrawerProps>(({ theme, open, drawerWidth }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap' as const,
  boxSizing: 'border-box' as const,
  ...(open && {
    ...openedMixin(theme, drawerWidth!),
    '& .MuiDrawer-paper': openedMixin(theme, drawerWidth!),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

interface MenuGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
}

// 数据空间运营方菜单配置
const operatorMenuGroups: MenuGroup[] = [
  {
    id: 'resources',
    title: '数据资源管理',
    icon: <StorageIcon />,
    items: [
      { id: 'resource-list', title: '资源列表', path: '/operator/resources', icon: <FolderIcon /> },
      { id: 'resource-create', title: '创建资源', path: '/operator/resources/create', icon: <DescriptionIcon /> },
    ],
  },
  {
    id: 'policy-management',
    title: '数据使用控制策略管理',
    icon: <PolicyIcon />,
    items: [
      { id: 'policy-list', title: '策略列表', path: '/operator/policies', icon: <DescriptionIcon /> },
      { id: 'policy-create', title: '创建策略', path: '/operator/policies/create', icon: <DescriptionIcon /> },
    ],
  },
  {
    id: 'connection-management',
    title: '数据连接与交换管理',
    icon: <SyncAltIcon />,
    items: [
      { id: 'connector-status', title: '连接器状态', path: '/operator/connections', icon: <SwapHorizIcon /> },
      { id: 'data-exchange', title: '数据交换', path: '/operator/connections/exchange', icon: <SwapHorizIcon /> },
      { id: 'exchange-logs', title: '交换日志', path: '/operator/connections/logs', icon: <ReceiptLongIcon /> },
    ],
  },
  {
    id: 'ecosystem',
    title: '数据空间生态交互',
    icon: <StoreIcon />,
    items: [
      { id: 'marketplace', title: '数据市场浏览', path: '/operator/ecosystem', icon: <ShoppingCartIcon /> },
      { id: 'participants', title: '参与方目录', path: '/operator/ecosystem/participants', icon: <PeopleIcon /> },
      { id: 'service-discovery', title: '服务发现', path: '/operator/ecosystem/services', icon: <ExploreIcon /> },
      { id: 'transactions', title: '交易管理', path: '/operator/ecosystem/transactions', icon: <ReceiptIcon /> },
    ],
  },
  {
    id: 'system',
    title: '系统配置与管理',
    icon: <SettingsIcon />,
    items: [
      { id: 'system-params', title: '系统参数配置', path: '/operator/system', icon: <TuneIcon /> },
      { id: 'backup', title: '备份与恢复', path: '/operator/system/backup', icon: <BackupIcon /> },
      { id: 'plugins', title: '插件管理', path: '/operator/system/plugins', icon: <ExtensionIcon /> },
      { id: 'updates', title: '系统更新管理', path: '/operator/system/updates', icon: <SystemUpdateIcon /> },
    ],
  },

  {
    id: 'analytics',
    title: '分析与报表',
    icon: <BarChartIcon />,
    items: [
      { id: 'data-flow', title: '数据流通分析', path: '/operator/analytics', icon: <TimelineIcon /> },
      { id: 'compliance-reports', title: '合规报表', path: '/operator/analytics/compliance', icon: <SummarizeIcon /> },
      { id: 'dashboards', title: '自定义仪表盘', path: '/operator/analytics/dashboards', icon: <DashboardIcon /> },
      { id: 'value-assessment', title: '价值评估', path: '/operator/analytics/value', icon: <AssessmentIcon /> },
    ],
  },
  {
    id: 'operator-management',
    title: '运营方管理',
    icon: <AdminPanelSettingsIcon />,
    items: [
      { id: 'registration-approval', title: '机构注册审核', path: '/operator/operation/registration-approval', icon: <VerifiedUserIcon /> },
      { id: 'space-governance', title: '数据空间治理', path: '/operator/governance', icon: <GavelIcon /> },
      { id: 'global-policies', title: '全局策略管理', path: '/operator/policies', icon: <PolicyIcon /> },
      { id: 'monitoring', title: '全局监控', path: '/operator/monitoring', icon: <MonitorIcon /> },
      { id: 'authentication', title: '身份认证配置', path: '/operator/operation/auth', icon: <VpnKeyIcon /> },
      { id: 'certificates', title: '证书管理', path: '/operator/operation/certificates', icon: <VpnKeyIcon /> },
    ],
  },
  {
    id: 'operator-security',
    title: '高级安全管理',
    icon: <SecurityIcon />,
    items: [
      { id: 'access-control', title: '访问控制管理', path: '/operator/security/access', icon: <AdminPanelSettingsIcon /> },
      { id: 'audit-logs', title: '安全审计日志', path: '/operator/security/audit', icon: <ReceiptLongIcon /> },
      { id: 'compliance', title: '合规性检查', path: '/operator/security/compliance', icon: <FactCheckIcon /> },
    ],
  },
];

// 数据提供者菜单配置
const providerMenuGroups: MenuGroup[] = [
  {
    id: 'resources',
    title: '数据资源管理',
    icon: <StorageIcon />,
    items: [
      { id: 'data-discovery', title: '数据发现', path: '/provider/resources/data-discovery', icon: <ExploreIcon /> },
      { id: 'resource-list', title: '资源列表', path: '/provider/resources', icon: <FolderIcon /> },
      { id: 'catalog-management', title: '数据目录管理', path: '/provider/catalog', icon: <LibraryBooksIcon /> },
    ],
  },
  {
    id: 'policy-management',
    title: '数据使用策略管理',
    icon: <PolicyIcon />,
    items: [
      { id: 'dataset-policy-edit', title: '数据集策略管理', path: '/provider/policies/dataset-policy-edit', icon: <DescriptionIcon /> },
      { id: 'dataset-policy-list', title: '数据集策略列表', path: '/provider/policies/dataset-policy-list', icon: <ListIcon /> },
    ],
  },
  {
    id: 'ecosystem',
    title: '数据空间生态交互',
    icon: <StoreIcon />,
    items: [
      { id: 'register-dataspace', title: '数据空间机构注册', path: '/provider/identity/register-dataspace', icon: <BusinessIcon /> },
      { id: 'onshelf', title: '数据发布', path: '/provider/ecosystem/onshelf', icon: <PublishIcon /> },
      { id: 'marketplace', title: '数据市场浏览', path: '/provider/ecosystem', icon: <ShoppingCartIcon /> },
      { id: 'usage-analytics', title: '数据使用分析', path: '/provider/analytics', icon: <AnalyticsIcon /> },
    ],
  },
  {
    id: 'connection-management',
    title: '数据连接与交换管理',
    icon: <SyncAltIcon />,
    items: [
      { id: 'connector-status', title: '连接器状态', path: '/provider/connections', icon: <SwapHorizIcon /> },
      { id: 'data-exchange', title: '数据交换', path: '/provider/connections/exchange', icon: <SwapHorizIcon /> },
    ],
  },
  {
    id: 'system',
    title: '系统配置与管理',
    icon: <SettingsIcon />,
    items: [
      { id: 'system-params', title: '系统参数配置', path: '/provider/system', icon: <TuneIcon /> },
      { id: 'updates', title: '系统更新管理', path: '/provider/system/updates', icon: <SystemUpdateIcon /> },
    ],
  },


];

// 数据消费者菜单配置
const consumerMenuGroups: MenuGroup[] = [
  {
    id: 'ecosystem',
    title: '数据空间生态交互',
    icon: <StoreIcon />,
    items: [
      { id: 'register-dataspace', title: '数据空间机构注册', path: '/consumer/identity/register-dataspace', icon: <BusinessIcon /> },
      { id: 'marketplace', title: '数据市场浏览', path: '/consumer/ecosystem', icon: <ShoppingCartIcon /> },
      { id: 'data-subscription', title: '数据订阅', path: '/consumer/subscriptions/subscribe', icon: <SubscriptionsIcon /> },
      { id: 'subscription-management', title: '订阅管理', path: '/consumer/subscriptions', icon: <SubscriptionsIcon /> },
    ],
  },
  {
    id: 'connection-management',
    title: '数据连接与交换管理',
    icon: <SyncAltIcon />,
    items: [
      { id: 'connector-status', title: '连接器状态', path: '/consumer/connections', icon: <SwapHorizIcon /> },
      { id: 'data-exchange', title: '数据交换', path: '/consumer/connections/exchange', icon: <SwapHorizIcon /> },
    ],
  },
  {
    id: 'system',
    title: '系统配置与管理',
    icon: <SettingsIcon />,
    items: [
      { id: 'system-params', title: '系统参数配置', path: '/consumer/system', icon: <TuneIcon /> },
      { id: 'updates', title: '系统更新管理', path: '/consumer/system/updates', icon: <SystemUpdateIcon /> },
    ],
  },
];



// 根据角色获取菜单组
const getMenuGroupsByRole = (roleType: string) => {
  const roleMenus = {
    operator: operatorMenuGroups,
    provider: providerMenuGroups,
    consumer: consumerMenuGroups,
  };
  
  return roleMenus[roleType as keyof typeof roleMenus] || [];
};

const Sidebar = ({ open, onDrawerToggle, drawerWidth }: SidebarProps) => {
  const responsive = useResponsive();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole } = useRole();
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});
  
  // 根据当前角色获取菜单组
  const menuGroups = getMenuGroupsByRole(currentRole.type);

  // 在小屏幕上使用临时抽屉
  const isTemporaryDrawer = responsive.isDown('md');

  const handleGroupClick = (groupId: string) => {
    setOpenGroups({
      ...openGroups,
      [groupId]: !openGroups[groupId],
    });
  };

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  // 渲染侧边栏内容
  const drawerContent = (
    <>
      <DrawerHeader>
        <IconButton onClick={onDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuGroups.map((group) => {
          const isGroupExpanded = openGroups[group.id];
          const isGroupActive = group.items.some((item) => location.pathname === item.path);

          return (
            <div key={group.id}>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => handleGroupClick(group.id)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    bgcolor: isGroupActive ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: isGroupActive ? 'primary.main' : 'inherit',
                    }}
                  >
                    {group.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={group.title}
                    sx={{ opacity: open ? 1 : 0, color: isGroupActive ? 'primary.main' : 'inherit' }}
                  />
                  {open && (openGroups[group.id] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              <Collapse in={open && isGroupExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {group.items.map((item) => {
                    const isItemActive = location.pathname === item.path;

                    return (
                      <ListItemButton
                        key={item.id}
                        onClick={() => handleItemClick(item.path)}
                        sx={{
                          pl: 4,
                          bgcolor: isItemActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: 3,
                            color: isItemActive ? 'primary.main' : 'inherit',
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          sx={{ color: isItemActive ? 'primary.main' : 'inherit' }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </div>
          );
        })}
      </List>
    </>
  );

  // 根据屏幕尺寸选择抽屉类型
  if (isTemporaryDrawer) {
    return (
      <MuiDrawer
        variant="temporary"
        open={open}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // 提高移动端性能
        }}
        sx={{
          display: { xs: 'block', sm: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </MuiDrawer>
    );
  }

  // 桌面端使用持久抽屉
  return (
    <Drawer
      variant="permanent"
      open={open}
      drawerWidth={drawerWidth}
      sx={{
        display: { xs: 'none', sm: 'none', md: 'block' },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
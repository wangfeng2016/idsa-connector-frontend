import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
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
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useResponsive from '../hooks/useResponsive';

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
  overflowX: 'hidden',
});

const closedMixin = (theme: any) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
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

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth' })(
  ({ theme, open, drawerWidth }: any) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme, drawerWidth),
      '& .MuiDrawer-paper': openedMixin(theme, drawerWidth),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

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

const menuGroups: MenuGroup[] = [
  {
    id: 'data-resources',
    title: '数据资源管理',
    icon: <StorageIcon />,
    items: [
      { id: 'resource-list', title: '资源列表', path: '/resources', icon: <FolderIcon /> },
      { id: 'resource-edit', title: '资源编辑', path: '/resources/edit', icon: <DescriptionIcon /> },
    ],
  },
  {
    id: 'policy-management',
    title: '数据使用控制策略管理',
    icon: <PolicyIcon />,
    items: [
      { id: 'policy-list', title: '策略列表', path: '/policies', icon: <DescriptionIcon /> },
      { id: 'policy-editor', title: '策略编辑器', path: '/policies/editor', icon: <DescriptionIcon /> },
    ],
  },
  {
    id: 'connection-management',
    title: '数据连接与交换管理',
    icon: <SyncAltIcon />,
    items: [
      { id: 'connector-status', title: '连接器状态', path: '/connections/status', icon: <SwapHorizIcon /> },
      { id: 'exchange-logs', title: '交换日志', path: '/connections/logs', icon: <ReceiptLongIcon /> },
    ],
  },
  {
    id: 'identity-security',
    title: '身份与安全管理',
    icon: <SecurityIcon />,
    items: [
      { id: 'authentication', title: '身份认证配置', path: '/security/auth', icon: <VpnKeyIcon /> },
      { id: 'certificates', title: '证书管理', path: '/security/certificates', icon: <VpnKeyIcon /> },
      { id: 'access-control', title: '访问控制管理', path: '/security/access', icon: <AdminPanelSettingsIcon /> },
      { id: 'audit-logs', title: '安全审计日志', path: '/security/audit', icon: <ReceiptLongIcon /> },
      { id: 'compliance', title: '合规性检查', path: '/security/compliance', icon: <FactCheckIcon /> },
    ],
  },
  {
    id: 'ecosystem',
    title: '数据空间生态交互',
    icon: <StoreIcon />,
    items: [
      { id: 'marketplace', title: '数据市场浏览', path: '/ecosystem/marketplace', icon: <ShoppingCartIcon /> },
      { id: 'transactions', title: '交易管理', path: '/ecosystem/transactions', icon: <ReceiptIcon /> },
      { id: 'service-discovery', title: '服务发现', path: '/ecosystem/services', icon: <ExploreIcon /> },
      { id: 'participants', title: '参与方目录', path: '/ecosystem/participants', icon: <PeopleIcon /> },
    ],
  },
  {
    id: 'analytics',
    title: '分析与报表',
    icon: <BarChartIcon />,
    items: [
      { id: 'data-flow', title: '数据流通分析', path: '/analytics/flow', icon: <TimelineIcon /> },
      { id: 'value-assessment', title: '价值评估', path: '/analytics/value', icon: <AssessmentIcon /> },
      { id: 'compliance-reports', title: '合规报表', path: '/analytics/compliance', icon: <SummarizeIcon /> },
      { id: 'dashboards', title: '自定义仪表盘', path: '/analytics/dashboards', icon: <DashboardIcon /> },
    ],
  },
  {
    id: 'system',
    title: '系统配置与管理',
    icon: <SettingsIcon />,
    items: [
      { id: 'system-params', title: '系统参数配置', path: '/system/config', icon: <TuneIcon /> },
      { id: 'plugins', title: '插件管理', path: '/system/plugins', icon: <ExtensionIcon /> },
      { id: 'backup', title: '备份与恢复', path: '/system/backup', icon: <BackupIcon /> },
      { id: 'updates', title: '系统更新管理', path: '/system/updates', icon: <SystemUpdateIcon /> },
    ],
  },
];

const Sidebar = ({ open, onDrawerToggle, drawerWidth }: SidebarProps) => {
  const theme = useTheme();
  const responsive = useResponsive();
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});

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
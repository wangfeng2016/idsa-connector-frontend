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
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import ListIcon from '@mui/icons-material/List';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExploreIcon from '@mui/icons-material/Explore';
import TuneIcon from '@mui/icons-material/Tune';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import BusinessIcon from '@mui/icons-material/Business';
import DatasetIcon from '@mui/icons-material/Dataset';
// 新增角色特定图标
import PublishIcon from '@mui/icons-material/Publish';
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



// 企业用户菜单配置
const enterpriseMenuGroups: MenuGroup[] = [
  {
    id: 'data-providing',
    title: '数据提供',
    icon: <PublishIcon />,
    items: [
      { id: 'data-discovery', title: '数据发现', path: '/enterprise/resources/data-discovery', icon: <ExploreIcon /> },
      { id: 'resource-list', title: '资源列表', path: '/enterprise/resources', icon: <FolderIcon /> },
      { id: 'dataset-management', title: '数据集管理', path: '/enterprise/datasets', icon: <DatasetIcon /> },
      { id: 'policy-management', title: '策略管理', path: '/enterprise/policies/management', icon: <TuneIcon /> },
      { id: 'dataset-policy-edit', title: '新增数据供应', path: '/enterprise/policies/dataset-policy-edit', icon: <DescriptionIcon /> },
      { id: 'dataset-policy-list', title: '数据供应列表', path: '/enterprise/policies/dataset-policy-list', icon: <ListIcon /> },
      { id: 'connector-status', title: '连接器状态', path: '/enterprise/connections', icon: <SwapHorizIcon /> },
      { id: 'data-exchange', title: '数据交换', path: '/enterprise/connections/exchange', icon: <SwapHorizIcon /> },
      { id: 'register-dataspace', title: '数据空间机构注册', path: '/enterprise/identity/register-dataspace', icon: <BusinessIcon /> },
    ],
  },
  {
    id: 'data-consuming',
    title: '数据消费',
    icon: <SubscriptionsIcon />,
    items: [
      { id: 'marketplace', title: '数据市场浏览', path: '/enterprise/ecosystem', icon: <ShoppingCartIcon /> },
      { id: 'data-subscription', title: '数据订阅', path: '/enterprise/subscriptions/subscribe', icon: <SubscriptionsIcon /> },
      { id: 'subscription-management', title: '订阅管理', path: '/enterprise/subscriptions', icon: <SubscriptionsIcon /> },
      { id: 'consumer-connector-status', title: '连接器状态', path: '/enterprise/consumer-connections', icon: <SwapHorizIcon /> },
      { id: 'consumer-data-exchange', title: '数据交换', path: '/enterprise/consumer-connections/exchange', icon: <SwapHorizIcon /> },
    ],
  },
  {
    id: 'system-management',
    title: '系统管理',
    icon: <SettingsIcon />,
    items: [
      { id: 'system-params', title: '系统参数配置', path: '/enterprise/system', icon: <TuneIcon /> },
      { id: 'updates', title: '系统更新管理', path: '/enterprise/system/updates', icon: <SystemUpdateIcon /> },
    ],
  },
];





// 根据角色获取菜单组
const getMenuGroupsByRole = (roleType: string) => {
  const roleMenus = {
    enterprise: enterpriseMenuGroups,
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
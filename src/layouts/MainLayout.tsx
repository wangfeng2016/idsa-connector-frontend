import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import useResponsive from '../hooks/useResponsive';

// 响应式侧边栏宽度
const getDrawerWidth = (screenSize: string) => {
  switch (screenSize) {
    case 'xs':
    case 'sm':
      return 240;
    case 'md':
      return 260;
    case 'lg':
    case 'xl':
      return 280;
    default:
      return 240;
  }
};

interface MainProps {
  open: boolean;
  drawerWidth: number;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth' })(
  ({ theme, open, drawerWidth }: MainProps & { theme?: any }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    height: '100%',
    overflow: 'auto',
    [theme.breakpoints.up('md')]: {
      marginLeft: open ? 0 : -drawerWidth,
      padding: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  }),
);

const MainLayout = () => {
  const responsive = useResponsive();
  const [open, setOpen] = useState(!responsive.isDown('md')); // 在小屏幕上默认关闭侧边栏
  const drawerWidth = getDrawerWidth(responsive.currentBreakpoint || 'md');

  // 监听屏幕尺寸变化，自动调整侧边栏状态
  useEffect(() => {
    if (responsive.isDown('md') && open) {
      setOpen(false);
    } else if (!responsive.isDown('md') && !open) {
      setOpen(true);
    }
  }, [responsive.currentBreakpoint, responsive.isDown, open]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <CssBaseline />
      <Topbar open={open} onDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
      <Sidebar open={open} onDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
      <Main open={open} drawerWidth={drawerWidth}>
        <Box sx={{ py: responsive.value({ xs: 6, sm: 7, md: 8, lg: 8, xl: 9 }, 8) }}>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
};

export default MainLayout;
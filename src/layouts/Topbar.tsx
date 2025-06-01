import { useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import type { ComponentProps } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Box from '@mui/material/Box';
import useResponsive from '../hooks/useResponsive';
import logoWhite from '../assets/images/磐云logo-white.png';

// 使用React.ComponentProps获取AppBar的props类型
type MuiAppBarProps = ComponentProps<typeof MuiAppBar>;

// 扩展AppBar的props
interface CustomAppBarProps extends MuiAppBarProps {
  open?: boolean;
  drawerWidth?: number;
}

interface TopbarProps {
  open: boolean;
  onDrawerToggle: () => void;
  drawerWidth: number;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth',
})<CustomAppBarProps>(
  ({ theme, open, drawerWidth }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      [theme.breakpoints.up('md')]: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    }),
  }),
);

const Topbar = ({ open, onDrawerToggle, drawerWidth }: TopbarProps) => {
  const responsive = useResponsive();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <AppBar position="fixed" open={open} drawerWidth={drawerWidth}>
      <Toolbar sx={{ pr: responsive.value({ xs: 1, sm: 2, md: 3 }, 3) }}>
        {/* 磐云Logo */}
        <Box
          component="img"
          src={logoWhite}
          alt="磐云Logo"
          sx={{
            height: responsive.value({ xs: 28, sm: 32, md: 36 }, 36),
            marginRight: responsive.value({ xs: 1, sm: 2, md: 3 }, 3),
            objectFit: 'contain'
          }}
        />
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerToggle}
          edge="start"
          sx={{
            marginRight: responsive.value({ xs: 1, sm: 2, md: 5 }, 5),
            ...(open && responsive.isUp('md') && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography 
          variant={responsive.value({ xs: 'subtitle1', sm: 'h6', md: 'h6' }, 'h6')} 
          noWrap 
          component="div" 
          sx={{ flexGrow: 1 }}
        >
          IDS Connector GUI
        </Typography>

        <Box sx={{ display: 'flex' }}>
          {/* 在小屏幕上隐藏帮助按钮 */}
          {!responsive.isXs && (
            <IconButton color="inherit">
              <HelpIcon />
            </IconButton>
          )}

          <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* 在小屏幕上隐藏设置按钮 */}
          {!responsive.isXs && (
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          )}

          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Box>

        {/* 用户菜单 */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="个人资料" />
          </MenuItem>
          {/* 在小屏幕上显示设置选项 */}
          {responsive.isXs && (
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="设置" />
            </MenuItem>
          )}
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="退出登录" />
          </MenuItem>
        </Menu>

        {/* 通知菜单 */}
        <Menu
          anchorEl={notificationAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
        >
          <MenuItem onClick={handleNotificationMenuClose}>通知 1</MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>通知 2</MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>通知 3</MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>通知 4</MenuItem>
          <Divider />
          <MenuItem onClick={handleNotificationMenuClose}>查看所有通知</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
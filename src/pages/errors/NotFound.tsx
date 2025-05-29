import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Fade
} from '@mui/material';
import {
  SentimentDissatisfied as SadIcon,
  Home as HomeIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  HelpOutline as HelpIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Storage as ResourcesIcon,
  Policy as PolicyIcon
} from '@mui/icons-material';

// Suggested routes to display
const suggestedRoutes = [
  { path: '/', name: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/resources', name: 'Resources', icon: <ResourcesIcon /> },
  { path: '/policies', name: 'Policies', icon: <PolicyIcon /> },
  { path: '/security', name: 'Security', icon: <SecurityIcon /> },
  { path: '/system/config', name: 'System Configuration', icon: <SettingsIcon /> }
];

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fadeIn, setFadeIn] = useState(false);
  
  // Trigger fade-in animation
  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Handle navigation to home
  const goToHome = () => {
    navigate('/');
  };

  // Handle navigation back
  const goBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Fade in={fadeIn} timeout={800}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SadIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h2" component="h1" gutterBottom>
              404
            </Typography>
            <Typography variant="h4" gutterBottom>
              Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              The page you are looking for doesn't exist or has been moved.
              <br />
              <code>{location.pathname}</code>
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HomeIcon />}
                onClick={goToHome}
                size="large"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outlined"
                startIcon={<BackIcon />}
                onClick={goBack}
                size="large"
              >
                Go Back
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* 帮助信息 - Flex布局 */}
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              '& > *': {
                flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' },
                minWidth: { xs: '100%', md: '300px' }
              }
            }}
          >
            <Card 
              variant="outlined"
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SearchIcon sx={{ mr: 1, color: 'primary.main' }} /> Looking for something?
                </Typography>
                <Typography variant="body2" paragraph>
                  Here are some popular pages that might help you find what you're looking for:
                </Typography>
                <List dense>
                  {suggestedRoutes.map((route) => (
                    <ListItem 
                      button 
                      key={route.path} 
                      onClick={() => navigate(route.path)}
                      sx={{ 
                        borderRadius: 2, 
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          transform: 'translateX(8px)'
                        } 
                      }}
                    >
                      <ListItemIcon>
                        {route.icon}
                      </ListItemIcon>
                      <ListItemText primary={route.name} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
            
            <Card 
              variant="outlined"
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <HelpIcon sx={{ mr: 1, color: 'warning.main' }} /> Need Help?
                </Typography>
                <Typography variant="body2" paragraph>
                  If you believe this is an error, please try the following:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Check the URL" 
                      secondary="Make sure the URL is spelled correctly and doesn't contain any typos." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Clear your browser cache" 
                      secondary="Sometimes outdated cached pages can cause issues." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Contact system administrator" 
                      secondary="If you believe this page should exist, contact your system administrator." 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default NotFound;
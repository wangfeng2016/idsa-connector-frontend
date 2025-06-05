import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import router from './routes';
import { RoleProvider } from './contexts/RoleContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RoleProvider>
        <RouterProvider router={router} />
      </RoleProvider>
    </ThemeProvider>
  );
}

export default App;

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
  interface BreakpointOverrides {
    xxl: true;
  }
}

// 定义响应式断点
const breakpoints = {
  values: {
    xs: 0,      // 手机
    sm: 600,    // 平板垂直方向
    md: 960,    // 平板水平方向
    lg: 1280,   // 桌面显示器
    xl: 1920,   // 大型桌面显示器
    xxl: 2560,  // 超大屏幕/4K显示器
  },
};

// 创建主题
export const theme = createTheme({
  // 添加自定义断点
  breakpoints,
  
  palette: {
    primary: {
      main: '#46cade',
      light: '#daf4f8',
      dark: '#166f7c',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff6f61',
      light: '#ffc5c0',
      dark: '#b01000',
      contrastText: '#fff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#fff',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#fff',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#fff',
    },
    success: {
      main: '#199788',
      light: '#54e2d1',
      dark: '#116359',  
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: [
      'ui-sans-serif',
      'system-ui',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      'Segoe UI Symbol',
      '"Noto Color Emoji"',
    ].join(','),
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    // 响应式排版设置
    h1: {
      fontSize: '2.5rem',
      '@media (max-width:960px)': {
        fontSize: '2rem',
      },
      '@media (max-width:600px)': {
        fontSize: '1.8rem',
      },
    },
    h2: {
      fontSize: '2rem',
      '@media (max-width:960px)': {
        fontSize: '1.8rem',
      },
      '@media (max-width:600px)': {
        fontSize: '1.6rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      '@media (max-width:960px)': {
        fontSize: '1.5rem',
      },
      '@media (max-width:600px)': {
        fontSize: '1.3rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      '@media (max-width:960px)': {
        fontSize: '1.3rem',
      },
      '@media (max-width:600px)': {
        fontSize: '1.2rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontSize: '1.1rem',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '0.95rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      '@media (max-width:600px)': {
        fontSize: '0.85rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
      // 响应式按钮大小
      variants: [
        {
          props: { size: 'small' },
          style: {
            padding: '4px 8px',
            fontSize: '0.8125rem',
          },
        },
        {
          props: { size: 'medium' },
          style: {
            padding: '6px 12px',
            fontSize: '0.875rem',
          },
        },
        {
          props: { size: 'large' },
          style: {
            padding: '8px 16px',
            fontSize: '0.9375rem',
          },
        },
      ],
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    // 响应式卡片组件
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        },
      },
    },
    // 响应式表格组件
    MuiTableCell: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '8px',
          },
        },
        head: {
          fontWeight: 600,
        },
      },
    },
    // 响应式表单组件
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
    // 响应式Drawer组件
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#fff',
        },
      },
    },
  },
  status: {
    danger: '#e53e3e',
  },
});

export default theme;

// 创建自定义响应式Hook
export const useResponsiveValue = <T extends unknown>(
  values: { [key: string]: T },
  defaultValue: T
): T => {
  const theme = createTheme();
  const { breakpoints } = theme;
  
  // 根据当前屏幕尺寸返回相应的值
  const getCurrentValue = (): T => {
    const width = window.innerWidth;
    
    if (width >= breakpoints.values.xxl && values.xxl !== undefined) {
      return values.xxl;
    }
    if (width >= breakpoints.values.xl && values.xl !== undefined) {
      return values.xl;
    }
    if (width >= breakpoints.values.lg && values.lg !== undefined) {
      return values.lg;
    }
    if (width >= breakpoints.values.md && values.md !== undefined) {
      return values.md;
    }
    if (width >= breakpoints.values.sm && values.sm !== undefined) {
      return values.sm;
    }
    if (values.xs !== undefined) {
      return values.xs;
    }
    
    return defaultValue;
  };
  
  return getCurrentValue();
};
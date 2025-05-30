import { type ReactNode } from 'react';
import { Box } from '@mui/material';
import useResponsive from '../hooks/useResponsive';

interface ResponsiveContainerProps {
  children: ReactNode;
  maxWidth?: number | string;
  disablePadding?: boolean;
}

/**
 * 响应式容器组件，根据屏幕尺寸自动调整内容区域的宽度和内边距
 */
const ResponsiveContainer = ({
  children,
  maxWidth = 1200,
  disablePadding = false,
}: ResponsiveContainerProps) => {
  const responsive = useResponsive();
  
  // 根据屏幕尺寸调整内边距
  const padding = responsive.value(
    { xs: 2, sm: 3, md: 4, lg: 4, xl: 5 },
    3
  );

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: maxWidth,
        mx: 'auto', // 水平居中
        px: disablePadding ? 0 : padding, // 水平内边距
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Box>
  );
};

export default ResponsiveContainer;
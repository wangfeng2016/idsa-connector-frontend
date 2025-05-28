import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type BreakpointOrNull = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | null;

export default function useResponsive() {
  const theme = useTheme();

  // 检查当前断点是否匹配
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  // Pre-compute common breakpoint queries
  const downXs = useMediaQuery(theme.breakpoints.down('xs'));
  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const downLg = useMediaQuery(theme.breakpoints.down('lg'));
  const downXl = useMediaQuery(theme.breakpoints.down('xl'));
  
  const upXs = useMediaQuery(theme.breakpoints.up('xs'));
  const upSm = useMediaQuery(theme.breakpoints.up('sm'));
  const upMd = useMediaQuery(theme.breakpoints.up('md'));
  const upLg = useMediaQuery(theme.breakpoints.up('lg'));
  const upXl = useMediaQuery(theme.breakpoints.up('xl'));

  // 获取当前活动的断点
  const getCurrentBreakpoint = (): BreakpointOrNull => {
    if (isXs) return 'xs';
    if (isSm) return 'sm';
    if (isMd) return 'md';
    if (isLg) return 'lg';
    if (isXl) return 'xl';
    return null;
  };

  // 检查是否小于指定断点 - 使用预先计算的值
  const isDown = (breakpoint: string) => {
    switch (breakpoint) {
      case 'xs': return downXs;
      case 'sm': return downSm;
      case 'md': return downMd;
      case 'lg': return downLg;
      case 'xl': return downXl;
      default: return false;
    }
  };

  // 检查是否大于指定断点 - 使用预先计算的值
  const isUp = (breakpoint: string) => {
    switch (breakpoint) {
      case 'xs': return upXs;
      case 'sm': return upSm;
      case 'md': return upMd;
      case 'lg': return upLg;
      case 'xl': return upXl;
      default: return false;
    }
  };

  // 检查是否在指定断点之间
  const isBetween = (start: string, end: string) => {
    return isUp(start) && isDown(end);
  };

  // 根据断点返回不同的值
  const value = <T extends unknown>(
    values: { [key: string]: T },
    defaultValue: T
  ): T => {
    const breakpoint = getCurrentBreakpoint();
    if (breakpoint !== null && values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
    return defaultValue;
  };

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isDown,
    isUp,
    isBetween,
    value,
    currentBreakpoint: getCurrentBreakpoint(),
  };
}

// 使用示例：
// const responsive = useResponsive();
// 
// // 检查当前断点
// if (responsive.isXs) {
//   // 在超小屏幕上执行的逻辑
// }
// 
// // 根据断点返回不同的值
// const padding = responsive.value(
//   { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
//   3 // 默认值
// );
// 
// // 检查是否小于特定断点
// if (responsive.isDown('md')) {
//   // 在小于md断点的屏幕上执行的逻辑
// }
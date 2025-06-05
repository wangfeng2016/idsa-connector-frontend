import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';

interface BreakpointState {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
}

interface LayoutConfig {
  // 侧边栏配置
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  sidebarAutoCollapse: boolean;
  
  // 面板配置
  panelSpacing: number;
  panelMinWidth: number;
  panelMaxWidth: number;
  
  // 网格配置
  gridColumns: number;
  gridSpacing: number;
  
  // 卡片配置
  cardMinWidth: number;
  cardMaxWidth: number;
  cardAspectRatio: number;
  
  // 表格配置
  tablePageSize: number;
  tableRowHeight: number;
  
  // 工具栏配置
  toolbarHeight: number;
  toolbarCompact: boolean;
  
  // 过滤栏配置
  filterBarCollapsed: boolean;
  filterBarHeight: number;
}

interface ViewportInfo {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  touchDevice: boolean;
}

interface ResponsiveActions {
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  toggleFilterBar: () => void;
  setGridColumns: (columns: number) => void;
  setTablePageSize: (size: number) => void;
  resetLayout: () => void;
}

interface UseCatalogResponsiveReturn {
  // 断点状态
  breakpoints: BreakpointState;
  currentBreakpoint: Breakpoint;
  
  // 视口信息
  viewport: ViewportInfo;
  
  // 布局配置
  layout: LayoutConfig;
  
  // 响应式操作
  actions: ResponsiveActions;
  
  // 工具函数
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallScreen: boolean;
  isLargeScreen: boolean;
  
  // 布局计算
  getOptimalColumns: (containerWidth: number, itemMinWidth: number) => number;
  getOptimalPageSize: (containerHeight: number, itemHeight: number) => number;
  shouldCollapseSidebar: () => boolean;
  shouldUseCompactMode: () => boolean;
}

/**
 * 数据目录响应式布局Hook
 * 提供完整的响应式布局管理功能
 */
export const useCatalogResponsive = (): UseCatalogResponsiveReturn => {
  const theme = useTheme();
  
  // 断点检测
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));
  
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  
  // 视口状态
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    deviceType: 'desktop',
    touchDevice: 'ontouchstart' in window
  });
  
  // 布局状态
  const [layoutState, setLayoutState] = useState({
    sidebarCollapsed: false,
    sidebarAutoCollapse: true,
    filterBarCollapsed: false,
    gridColumns: 3,
    tablePageSize: 25
  });

  // 断点状态
  const breakpoints: BreakpointState = {
    xs: isXs,
    sm: isSm,
    md: isMd,
    lg: isLg,
    xl: isXl
  };

  // 当前断点
  const currentBreakpoint: Breakpoint = useMemo(() => {
    if (isXs) return 'xs';
    if (isSm) return 'sm';
    if (isMd) return 'md';
    if (isLg) return 'lg';
    return 'xl';
  }, [isXs, isSm, isMd, isLg]);

  // 设备类型判断
  const isMobile = isXs;
  const isTablet = isSm || isMd;
  const isDesktop = isLgUp;
  const isSmallScreen = !isMdUp;
  const isLargeScreen = isLgUp;

  // 更新视口信息
  const updateViewport = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation = width > height ? 'landscape' : 'portrait';
    
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (width < theme.breakpoints.values.sm) {
      deviceType = 'mobile';
    } else if (width < theme.breakpoints.values.lg) {
      deviceType = 'tablet';
    }
    
    setViewport({
      width,
      height,
      orientation,
      deviceType,
      touchDevice: 'ontouchstart' in window
    });
  }, [theme.breakpoints.values]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      updateViewport();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateViewport]);

  // 自动折叠侧边栏
  useEffect(() => {
    if (layoutState.sidebarAutoCollapse) {
      const shouldCollapse = isSmallScreen;
      if (shouldCollapse !== layoutState.sidebarCollapsed) {
        setLayoutState(prev => ({
          ...prev,
          sidebarCollapsed: shouldCollapse
        }));
      }
    }
  }, [isSmallScreen, layoutState.sidebarAutoCollapse, layoutState.sidebarCollapsed]);

  // 自动调整网格列数
  useEffect(() => {
    let optimalColumns = 3;
    
    if (isXs) {
      optimalColumns = 1;
    } else if (isSm) {
      optimalColumns = 2;
    } else if (isMd) {
      optimalColumns = 3;
    } else if (isLg) {
      optimalColumns = 4;
    } else {
      optimalColumns = 5;
    }
    
    if (optimalColumns !== layoutState.gridColumns) {
      setLayoutState(prev => ({
        ...prev,
        gridColumns: optimalColumns
      }));
    }
  }, [currentBreakpoint, isXs, isSm, isMd, isLg, layoutState.gridColumns]);

  // 自动调整表格页面大小
  useEffect(() => {
    let optimalPageSize = 25;
    
    if (isMobile) {
      optimalPageSize = 10;
    } else if (isTablet) {
      optimalPageSize = 15;
    } else {
      optimalPageSize = 25;
    }
    
    if (optimalPageSize !== layoutState.tablePageSize) {
      setLayoutState(prev => ({
        ...prev,
        tablePageSize: optimalPageSize
      }));
    }
  }, [isMobile, isTablet, layoutState.tablePageSize]);

  // 布局配置
  const layout: LayoutConfig = useMemo(() => {
    const baseConfig = {
      // 侧边栏配置
      sidebarWidth: layoutState.sidebarCollapsed ? 64 : (isSmallScreen ? 240 : 280),
      sidebarCollapsed: layoutState.sidebarCollapsed,
      sidebarAutoCollapse: layoutState.sidebarAutoCollapse,
      
      // 面板配置
      panelSpacing: isSmallScreen ? 8 : 16,
      panelMinWidth: isSmallScreen ? 200 : 300,
      panelMaxWidth: isSmallScreen ? 400 : 600,
      
      // 网格配置
      gridColumns: layoutState.gridColumns,
      gridSpacing: isSmallScreen ? 8 : 16,
      
      // 卡片配置
      cardMinWidth: isSmallScreen ? 280 : 320,
      cardMaxWidth: isSmallScreen ? 400 : 480,
      cardAspectRatio: 1.2,
      
      // 表格配置
      tablePageSize: layoutState.tablePageSize,
      tableRowHeight: isSmallScreen ? 48 : 56,
      
      // 工具栏配置
      toolbarHeight: isSmallScreen ? 48 : 56,
      toolbarCompact: isSmallScreen,
      
      // 过滤栏配置
      filterBarCollapsed: layoutState.filterBarCollapsed,
      filterBarHeight: isSmallScreen ? 48 : 56
    };
    
    return baseConfig;
  }, [
    layoutState,
    isSmallScreen
  ]);

  // 切换侧边栏
  const toggleSidebar = useCallback(() => {
    setLayoutState(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
      sidebarAutoCollapse: false // 手动操作时禁用自动折叠
    }));
  }, []);

  // 折叠侧边栏
  const collapseSidebar = useCallback(() => {
    setLayoutState(prev => ({
      ...prev,
      sidebarCollapsed: true
    }));
  }, []);

  // 展开侧边栏
  const expandSidebar = useCallback(() => {
    setLayoutState(prev => ({
      ...prev,
      sidebarCollapsed: false
    }));
  }, []);

  // 切换过滤栏
  const toggleFilterBar = useCallback(() => {
    setLayoutState(prev => ({
      ...prev,
      filterBarCollapsed: !prev.filterBarCollapsed
    }));
  }, []);

  // 设置网格列数
  const setGridColumns = useCallback((columns: number) => {
    setLayoutState(prev => ({
      ...prev,
      gridColumns: Math.max(1, Math.min(6, columns))
    }));
  }, []);

  // 设置表格页面大小
  const setTablePageSize = useCallback((size: number) => {
    setLayoutState(prev => ({
      ...prev,
      tablePageSize: Math.max(5, Math.min(100, size))
    }));
  }, []);

  // 重置布局
  const resetLayout = useCallback(() => {
    setLayoutState({
      sidebarCollapsed: false,
      sidebarAutoCollapse: true,
      filterBarCollapsed: false,
      gridColumns: 3,
      tablePageSize: 25
    });
  }, []);

  // 响应式操作
  const actions: ResponsiveActions = {
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
    toggleFilterBar,
    setGridColumns,
    setTablePageSize,
    resetLayout
  };

  // 计算最优列数
  const getOptimalColumns = useCallback((containerWidth: number, itemMinWidth: number) => {
    const availableWidth = containerWidth - (layout.panelSpacing * 2);
    const columns = Math.floor(availableWidth / (itemMinWidth + layout.gridSpacing));
    return Math.max(1, Math.min(6, columns));
  }, [layout.panelSpacing, layout.gridSpacing]);

  // 计算最优页面大小
  const getOptimalPageSize = useCallback((containerHeight: number, itemHeight: number) => {
    const availableHeight = containerHeight - layout.toolbarHeight - layout.filterBarHeight;
    const rows = Math.floor(availableHeight / itemHeight);
    return Math.max(5, Math.min(50, rows));
  }, [layout.toolbarHeight, layout.filterBarHeight]);

  // 判断是否应该折叠侧边栏
  const shouldCollapseSidebar = useCallback(() => {
    return isSmallScreen || viewport.width < 1200;
  }, [isSmallScreen, viewport.width]);

  // 判断是否应该使用紧凑模式
  const shouldUseCompactMode = useCallback(() => {
    return isSmallScreen || viewport.height < 600;
  }, [isSmallScreen, viewport.height]);

  return {
    breakpoints,
    currentBreakpoint,
    viewport,
    layout,
    actions,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isLargeScreen,
    getOptimalColumns,
    getOptimalPageSize,
    shouldCollapseSidebar,
    shouldUseCompactMode
  };
};

export default useCatalogResponsive;
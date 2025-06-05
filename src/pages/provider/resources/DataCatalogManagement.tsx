import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  Button
} from '@mui/material';
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  AccountTree as AccountTreeIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  FileUpload as ImportIcon,
  GetApp as ExportIcon,
  Add as AddIcon
} from '@mui/icons-material';

// 自定义hooks和contexts
import { useDataCatalog, type CatalogViewType, type CatalogDataResource } from '../../../contexts/DataCatalogContext';
import useResponsive from '../../../hooks/useResponsive';

// 组件
import CatalogStatsPanel from './components/catalog/CatalogStatsPanel';
import CatalogTagManager from './components/catalog/CatalogTagManager';
import CatalogTimelineView from './components/catalog/CatalogTimelineView';
import CatalogGraphView from './components/catalog/CatalogGraphView';
import CatalogMatrixView from './components/catalog/CatalogMatrixView';
import CatalogHierarchyView from './components/catalog/CatalogHierarchyView';
import CatalogFilterBar from './components/catalog/CatalogFilterBar';
import CatalogDimensionPanel from './components/catalog/CatalogDimensionPanel';
import CatalogResourceGrid from './components/catalog/CatalogResourceGrid';
import CategoryManagementDialog from './components/catalog/CategoryManagementDialog';

/**
 * 数据目录管理页面
 * 实现多维度分类视图、标签系统、关联关系等功能
 */
const DataCatalogManagement: React.FC = () => {
  const responsive = useResponsive();
  const {
    viewType,
    setViewType,
    dimensions,
    getCatalogStats,
    exportCatalog,
    importCatalog
  } = useDataCatalog();

  // 本地状态
  const [selectedTab, setSelectedTab] = useState(0);
  const [showDimensionPanel, setShowDimensionPanel] = useState(true);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [selectedDimensionId, setSelectedDimensionId] = useState<string | null>(null);
  const [selectedResources, setSelectedResources] = useState<CatalogDataResource[]>([]); // 用于存储选中的资源数

  // 视图类型配置
  const viewTypeConfig = [
    { type: 'hierarchy' as CatalogViewType, label: '层次视图', icon: ViewListIcon },
    { type: 'matrix' as CatalogViewType, label: '矩阵视图', icon: ViewModuleIcon },
    { type: 'graph' as CatalogViewType, label: '关系图', icon: AccountTreeIcon },
    { type: 'timeline' as CatalogViewType, label: '时间线', icon: TimelineIcon }
  ];

  // 标签页配置
  const tabConfig = [
    { label: '分类浏览', value: 0 },
    { label: '标签管理', value: 1 },
    { label: '关联关系', value: 2 },
    { label: '质量分析', value: 3 }
  ];

  // 处理导出
  const handleExport = async () => {
    try {
      const data = await exportCatalog();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-catalog-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // 处理导入
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          await importCatalog(text);
        } catch (error) {
          console.error('Import failed:', error);
        }
      }
    };
    input.click();
  };

  // 渲染视图内容
  const renderViewContent = () => {
    switch (viewType) {
      case 'hierarchy':
        return <CatalogHierarchyView />;
      case 'matrix':
        return <CatalogMatrixView />;
      case 'graph':
        return <CatalogGraphView />;
      case 'timeline':
        return <CatalogTimelineView />;
      default:
        return <CatalogHierarchyView />;
    }
  };

  // 渲染标签页内容
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
            {/* 左侧维度面板 */}
            {showDimensionPanel && (
              <Box sx={{ 
                width: responsive.isXs ? '100%' : 300, 
                flexShrink: 0,
                display: responsive.isXs && !showDimensionPanel ? 'none' : 'block'
              }}>
                <CatalogDimensionPanel 
                  onDimensionSelect={setSelectedDimensionId}
                  onManageCategories={() => setCategoryDialogOpen(true)}
                />
              </Box>
            )}
            
            {/* 右侧内容区域 */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              minWidth: 0
            }}>
              {/* 过滤栏 */}
              <Box sx={{ mb: 2 }}>
                <CatalogFilterBar />
              </Box>
              
              {/* 视图内容 */}
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                {renderViewContent()}
              </Box>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              标签管理
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setTagDialogOpen(true)}
              sx={{ mb: 2 }}
            >
              添加标签
            </Button>
            {/* 标签列表组件 */}
            <CatalogResourceGrid viewMode="tags" />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              关联关系分析
            </Typography>
            <CatalogGraphView showRelationsOnly />
          </Box>
        );
      case 3:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              数据质量分析
            </Typography>
            <CatalogStatsPanel />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* 页面头部 */}
      <Paper sx={{ 
        p: 2, 
        borderRadius: 0, 
        borderBottom: 1, 
        borderColor: 'divider',
        flexShrink: 0
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="h5" component="h1" gutterBottom>
              数据目录管理
            </Typography>
            <Typography variant="body2" color="text.secondary">
              多维度分类 • 标签系统 • 关联关系 • 知识管理
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            flexWrap: 'wrap'
          }}>
            {/* 统计信息 */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              mr: 2,
              flexWrap: 'wrap'
            }}>
              {(() => {
                const stats = getCatalogStats();
                return [
                  { label: '总资源', value: stats.totalResources },
                  { label: '已分类', value: stats.categorizedResources },
                  { label: '已标记', value: stats.taggedResources }
                ].map(stat => (
                  <Chip 
                    key={stat.label}
                    label={`${stat.label}: ${stat.value}`}
                    size="small"
                    variant="outlined"
                  />
                ));
              })()}
            </Box>
            
            {/* 视图切换按钮 */}
            <Box sx={{ 
              display: 'flex', 
              border: 1, 
              borderColor: 'divider', 
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              {viewTypeConfig.map(({ type, label, icon: Icon }) => (
                <Tooltip key={type} title={label}>
                  <IconButton
                    size="small"
                    onClick={() => setViewType(type)}
                    sx={{
                      borderRadius: 0,
                      bgcolor: viewType === type ? 'primary.main' : 'transparent',
                      color: viewType === type ? 'primary.contrastText' : 'text.primary',
                      '&:hover': {
                        bgcolor: viewType === type ? 'primary.dark' : 'action.hover'
                      }
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
            
            <Divider orientation="vertical" flexItem />
            
            {/* 操作按钮 */}
            <Tooltip title="导入目录">
              <IconButton onClick={handleImport}>
                <ImportIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="导出目录">
              <IconButton onClick={handleExport}>
                <ExportIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="设置">
              <IconButton>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* 标签页 */}
        <Box sx={{ mt: 2 }}>
          <Tabs 
            value={selectedTab} 
            onChange={(_, newValue) => setSelectedTab(newValue)}
            variant={responsive.isXs ? 'scrollable' : 'standard'}
            scrollButtons="auto"
          >
            {tabConfig.map(tab => (
              <Tab key={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Box>
      </Paper>
      
      {/* 主内容区域 */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}>
        {renderTabContent()}
      </Box>
      
      {/* 对话框 */}
      <CategoryManagementDialog 
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        dimensionId={selectedDimensionId}
      />
      
      <CatalogTagManager
        selectedResources={selectedResources}
      />
    </Box>
  );
};

export default DataCatalogManagement;
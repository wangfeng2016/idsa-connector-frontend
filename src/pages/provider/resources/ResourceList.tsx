import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

// 自定义hooks
import { useResourceData } from '../../../hooks/useResourceData';
import { useResourceFilters } from '../../../hooks/useResourceFilters';
import { useResourceActions } from '../../../hooks/useResourceActions';
import { useResourceView } from '../../../hooks/useResourceView';
import useResponsive from '../../../hooks/useResponsive';

// 导入FilterState和DataResource类型
import { type FilterState, type DataResource } from '../../../contexts/ResourceContext';

// 组件
import ResourceHeader from './components/ResourceHeader';
import ResourceToolbar from './components/ResourceToolbar';
import ResourceFilterBar from './components/ResourceFilterBar';
import ResourceListView from './components/ResourceListView';
import ResourceCardView from './components/ResourceCardView';

import ResourceDetailPanel from './components/ResourceDetailPanel';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';

/**
 * 资源列表页面
 * 使用自定义hooks管理状态和业务逻辑，组件只负责渲染UI
 */
const ResourceList = () => {
  const navigate = useNavigate();
  const responsive = useResponsive();
  
  // 使用自定义hooks
  const { 
    resources, 
    loading, 
    error, 
    getResourceStats 
  } = useResourceData();
  
  const { 
    filterState, 
    updateFilterState, 
    resetFilters, 
    filteredResources, 
    filterOptions 
  } = useResourceFilters(resources);
  
  const { 
    selectedResources, 
    setSelectedResources, 
    detailPanelResource, 
    deleteDialogOpen, 
    resourcesForDeletion,
    toggleFavorite, 
    openDeleteDialog, 
    closeDeleteDialog, 
    confirmDelete, 
    viewResourceDetails, 
    closeDetailPanel, 
    bulkDelete, 
    exportResources 
  } = useResourceActions(resources);
  
  const { 
    viewType, 
    setViewType, 
    sortModel, 
    setSortModel, 
    page, 
    setPage, 
    pageSize, 
    setPageSize, 
    columnVisibility, 
    toggleColumnVisibility 
  } = useResourceView();

  // 本地状态
  //const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 处理菜单打开
  //const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  //  setAnchorEl(event.currentTarget);
  //};

  // 处理菜单关闭
  //const handleMenuClose = () => {
  //  setAnchorEl(null);
  //};

  // 处理资源编辑
  const handleEditResource = (id: number) => {
    navigate(`/enterprise/resources/edit/${id}`);
  };

  // 处理添加资源
  const handleAddResource = () => {
    navigate('/enterprise/resources/edit/create');
  };

  // 获取资源统计信息
  const stats = getResourceStats();

  // 创建适配器函数，将(field, value)格式转换为Partial<FilterState>格式
  const handleFilterChange = (field: keyof FilterState, value: any) => {
    updateFilterState({ [field]: value });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 页面标题和统计信息 */}
      <ResourceHeader 
        stats={stats} 
        onAddResource={handleAddResource} 
      />
      
      {/* 工具栏：视图切换、批量操作、列可见性 */}
      <ResourceToolbar 
        viewType={viewType}
        onViewTypeChange={setViewType}
        selectedCount={selectedResources.length}
        onBulkDelete={bulkDelete}
        onExport={() => exportResources(selectedResources.map(r => r.id))}
        columnVisibility={columnVisibility}
        onToggleColumnVisibility={toggleColumnVisibility}
      />
      
      {/* 过滤栏：搜索、快速过滤、高级过滤 */}
      <ResourceFilterBar 
        filterState={filterState}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
      />
      
      {/* 主内容区域 */}
      <Paper 
        elevation={1} 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'row', 
          overflow: 'hidden',
          mt: 2
        }}
      >
        {/* 资源列表区域 */}
        <Box sx={{ 
          flex: detailPanelResource ? (responsive.isDown('md') ? 1 : 0.7) : 1, 
          display: detailPanelResource && responsive.isDown('sm') ? 'none' : 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography>加载中...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : filteredResources.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography>没有找到匹配的资源</Typography>
            </Box>
          ) : (
            <>
              {viewType === 'list' && (
                <ResourceListView 
                  resources={filteredResources}
                  selectedResources={selectedResources}
                  onSelectionChange={setSelectedResources}
                  onViewDetails={viewResourceDetails}
                  onEdit={handleEditResource}
                  onDelete={id => openDeleteDialog([id])}
                  onToggleFavorite={toggleFavorite}
                  sortModel={sortModel}
                  onSortModelChange={setSortModel}
                  page={page}
                  onPageChange={setPage}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  columnVisibility={columnVisibility}
                />
              )}
              
              {viewType === 'card' && (
                <ResourceCardView 
                  resources={filteredResources}
                  onViewDetails={viewResourceDetails}
                  onEdit={handleEditResource}
                  onDelete={id => openDeleteDialog([id])}
                  onToggleFavorite={toggleFavorite}
                  page={page}
                  onPageChange={setPage}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                />
              )}
              

            </>
          )}
        </Box>
        
        {/* 详情面板 */}
        {detailPanelResource && (
          <ResourceDetailPanel 
            resource={detailPanelResource}
            onClose={closeDetailPanel}
            onEdit={() => handleEditResource(detailPanelResource.id)}
            onDelete={() => openDeleteDialog([detailPanelResource.id])}
            onToggleFavorite={() => toggleFavorite(detailPanelResource.id)}
          />
        )}
      </Paper>
      
      {/* 删除确认对话框 */}
      <DeleteConfirmDialog 
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        resources={resourcesForDeletion.map(id => resources.find(r => r.id === id)).filter(Boolean) as DataResource[]}
      />
    </Box>
  );
};

export default ResourceList;
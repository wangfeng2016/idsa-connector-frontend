import { useState } from 'react';
import { type GridSortModel } from '@mui/x-data-grid';

/**
 * 自定义Hook，用于处理资源列表的视图状态
 */
export const useResourceView = () => {
  // 视图类型：列表、卡片、树状图
  const [viewType, setViewType] = useState<'list' | 'card' | 'tree'>('list');
  
  // 排序模型
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  
  // 分页设置
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  
  // 列可见性设置
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    id: true,
    name: true,
    type: true,
    domain: true,
    owner: true,
    accessLevel: true,
    status: true,
    qualityScore: true,
    usageFrequency: true,
    dataVolume: true,
    lastAccessed: true,
    tags: true,
    actions: true,
  });

  // 切换视图类型
  const changeViewType = (type: 'list' | 'card' | 'tree') => {
    setViewType(type);
  };

  // 处理排序变化
  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  // 处理分页变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 处理每页显示数量变化
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0); // 重置到第一页
  };

  // 切换列可见性
  const toggleColumnVisibility = (columnName: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  // 重置视图设置
  const resetViewSettings = () => {
    setViewType('list');
    setSortModel([]);
    setPage(0);
    setPageSize(10);
    setColumnVisibility({
      id: true,
      name: true,
      type: true,
      domain: true,
      owner: true,
      accessLevel: true,
      status: true,
      qualityScore: true,
      usageFrequency: true,
      dataVolume: true,
      lastAccessed: true,
      tags: true,
      actions: true,
    });
  };

  return {
    viewType,
    setViewType: changeViewType,
    sortModel,
    setSortModel: handleSortModelChange,
    page,
    setPage: handlePageChange,
    pageSize,
    setPageSize: handlePageSizeChange,
    columnVisibility,
    toggleColumnVisibility,
    resetViewSettings,
  };
};
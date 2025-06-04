import { useState, useMemo } from 'react';
import { type DataResource, type FilterState } from '../contexts/ResourceContext';

// 默认过滤状态
const defaultFilterState: FilterState = {
  searchTerm: '',
  status: 'all',
  domain: 'all',
  onlyFavorites: false,
  dataType: 'all',
  accessLevel: 'all',
  owner: 'all',
  qualityScore: null,
  usageFrequency: null,
  tags: [],
  showAdvancedFilter: false,
};

/**
 * 自定义Hook，用于处理资源过滤逻辑
 */
export const useResourceFilters = (resources: DataResource[]) => {
  // 过滤状态
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);

  // 更新过滤状态
  const updateFilterState = (updates: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...updates }));
  };

  // 重置过滤器
  const resetFilters = () => {
    setFilterState(defaultFilterState);
  };

  // 应用过滤器获取过滤后的资源
  const filteredResources = useMemo(() => {
    if (resources.length === 0) return [];

    let filtered = [...resources];

    // 搜索词过滤
    if (filterState.searchTerm) {
      const searchLower = filterState.searchTerm.toLowerCase();
      filtered = filtered.filter(
        resource =>
          resource.name.toLowerCase().includes(searchLower) ||
          resource.description.toLowerCase().includes(searchLower) ||
          resource.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // 状态过滤
    if (filterState.status !== 'all') {
      filtered = filtered.filter(resource => resource.status === filterState.status);
    }

    // 业务域过滤
    if (filterState.domain !== 'all') {
      filtered = filtered.filter(resource => resource.domain === filterState.domain);
    }

    // 收藏过滤
    if (filterState.onlyFavorites) {
      filtered = filtered.filter(resource => resource.isFavorite);
    }

    // 数据类型过滤
    if (filterState.dataType !== 'all') {
      filtered = filtered.filter(resource => resource.type === filterState.dataType);
    }

    // 访问级别过滤
    if (filterState.accessLevel !== 'all') {
      filtered = filtered.filter(resource => resource.accessLevel === filterState.accessLevel);
    }

    // 所有者过滤
    if (filterState.owner !== 'all') {
      filtered = filtered.filter(resource => resource.owner === filterState.owner);
    }

    // 质量评分过滤
    if (filterState.qualityScore !== null) {
      filtered = filtered.filter(resource => resource.qualityScore >= filterState.qualityScore!);
    }

    // 使用频率过滤
    if (filterState.usageFrequency !== null) {
      filtered = filtered.filter(resource => resource.usageFrequency >= filterState.usageFrequency!);
    }

    // 标签过滤
    if (filterState.tags.length > 0) {
      filtered = filtered.filter(resource =>
        filterState.tags.some(tag => resource.tags.includes(tag))
      );
    }

    return filtered;
  }, [resources, filterState]);

  // 获取唯一的过滤选项
  const filterOptions = useMemo(() => {
    const domains = new Set<string>();
    const statuses = new Set<string>();
    const dataTypes = new Set<string>();
    const accessLevels = new Set<string>();
    const owners = new Set<string>();
    const allTags = new Set<string>();

    resources.forEach(resource => {
      domains.add(resource.domain);
      statuses.add(resource.status);
      dataTypes.add(resource.type);
      accessLevels.add(resource.accessLevel);
      owners.add(resource.owner);
      resource.tags.forEach(tag => allTags.add(tag));
    });

    return {
      domains: Array.from(domains).sort(),
      statuses: Array.from(statuses).sort(),
      dataTypes: Array.from(dataTypes).sort(),
      accessLevels: Array.from(accessLevels).sort(),
      owners: Array.from(owners).sort(),
      tags: Array.from(allTags).sort(),
    };
  }, [resources]);

  return {
    filterState,
    updateFilterState,
    resetFilters,
    filteredResources,
    filterOptions,
  };
};
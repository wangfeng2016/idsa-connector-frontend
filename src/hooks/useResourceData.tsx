import { useState, useEffect } from 'react';
import { type DataResource, mockResources } from '../contexts/ResourceContext';

/**
 * 自定义Hook，用于处理资源数据的加载和管理
 */
export const useResourceData = () => {
  // 资源数据状态
  const [resources, setResources] = useState<DataResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载资源数据
  const loadResources = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 模拟API调用
      // 在实际应用中，这里会是一个API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      setResources(mockResources);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
      setError('加载资源失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    loadResources();
  }, []);

  // 获取资源统计信息
  const getResourceStats = () => {
    const total = resources.length;
    const active = resources.filter(r => r.status === 'active').length;
    const inactive = resources.filter(r => r.status === 'inactive').length;
    const pending = resources.filter(r => r.status === 'pending').length;

    return {
      total,
      active,
      inactive,
      pending,
    };
  };

  return {
    resources,
    setResources,
    loading,
    error,
    loadResources,
    getResourceStats,
  };
};
import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Category as CategoryIcon,
  Label as LabelIcon,
  Storage as StorageIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import { useDataCatalog } from '../../../../../contexts/DataCatalogContext';
import type { DimensionType } from '../../../../../contexts/DataCatalogContext';
import useResponsive from '../../../../../hooks/useResponsive';

interface CatalogStatsPanelProps {
  onRefresh?: () => void;
}

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  description?: string;
}

interface QualityDistribution {
  excellent: number; // 80-100
  good: number;      // 60-79
  poor: number;      // 0-59
}

interface TypeDistribution {
  [type: string]: number;
}

interface DomainDistribution {
  [domain: string]: number;
}

/**
 * 数据目录统计面板组件
 * 展示各种统计信息和指标
 */
const CatalogStatsPanel: React.FC<CatalogStatsPanelProps> = ({ onRefresh }) => {
  const responsive = useResponsive();
  const {
    dimensions,
    getCategoriesByDimension,
    getFilteredResources,
    getFavoriteResources,
    getDimensionStats,
    getCategoryStats,
    getTagStats,
    getResourceQualityColor,
    tags
  } = useDataCatalog();

  const resources = getFilteredResources();
  const favoriteResources = getFavoriteResources();

  // 基础统计
  const basicStats = useMemo(() => {
    const totalResources = resources.length;
    const totalDimensions = dimensions.filter(d => d.isEnabled).length;
    const totalCategories = dimensions.reduce((total, dim) => 
      total + getCategoriesByDimension(dim.id).length, 0);
    const totalTags = tags.length;
    const totalFavorites = favoriteResources.length;
    
    // 计算平均质量分数
    const qualityScores = resources
      .map(r => r.qualityScore)
      .filter(score => score !== undefined) as number[];
    const avgQuality = qualityScores.length > 0 
      ? Math.round(qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length)
      : 0;
    
    // 计算总使用频次
    const totalUsage = resources.reduce((sum, r) => sum + (r.usageFrequency || 0), 0);
    
    // 计算数据量（模拟）
    const totalDataVolume = resources.reduce((sum, r) => {
      const volume = typeof r.dataVolume === 'number' ? r.dataVolume : Math.random() * 1000; // GB
      return sum + volume;
    }, 0);
    
    return {
      totalResources,
      totalDimensions,
      totalCategories,
      totalTags,
      totalFavorites,
      avgQuality,
      totalUsage,
      totalDataVolume: Math.round(totalDataVolume)
    };
  }, [resources, dimensions, getCategoriesByDimension, tags, favoriteResources]);

  // 质量分布
  const qualityDistribution = useMemo((): QualityDistribution => {
    const distribution = { excellent: 0, good: 0, poor: 0 };
    
    resources.forEach(resource => {
      const score = resource.qualityScore || 0;
      if (score >= 80) {
        distribution.excellent++;
      } else if (score >= 60) {
        distribution.good++;
      } else {
        distribution.poor++;
      }
    });
    
    return distribution;
  }, [resources]);

  // 类型分布
  const typeDistribution = useMemo((): TypeDistribution => {
    const distribution: TypeDistribution = {};
    
    resources.forEach(resource => {
      distribution[resource.type] = (distribution[resource.type] || 0) + 1;
    });
    
    return distribution;
  }, [resources]);

  // 领域分布
  const domainDistribution = useMemo((): DomainDistribution => {
    const distribution: DomainDistribution = {};
    
    resources.forEach(resource => {
      distribution[resource.domain] = (distribution[resource.domain] || 0) + 1;
    });
    
    return distribution;
  }, [resources]);

  // 热门标签（使用最多的标签）
  const popularTags = useMemo(() => {
    return tags
      .map(tag => ({
        ...tag,
        usageCount: getTagStats().find((stat: any) => stat.id === tag.id)?.resourceCount || 0
      }))
      .filter(tag => tag.usageCount > 0)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10);
  }, [tags, getTagStats]);

  // 热门分类（资源最多的分类）
  const popularCategories = useMemo(() => {
    const allCategoryStats = getCategoryStats();
    return allCategoryStats
      .filter((category: any) => category.resourceCount > 0)
      .sort((a: any, b: any) => b.resourceCount - a.resourceCount)
      .slice(0, 10);
  }, [getCategoryStats]);

  // 维度统计
  const dimensionStats = useMemo(() => {
    return dimensions
      .filter(d => d.isEnabled)
      .map(dimension => ({
        ...dimension,
        stats: getDimensionStats().find((stat: any) => stat.id === dimension.id) || { resourceCount: 0, categoryCount: 0 }
      }))
      .sort((a, b) => b.stats.resourceCount - a.stats.resourceCount);
  }, [dimensions, getDimensionStats]);

  // 统计卡片数据
  const statCards: StatCard[] = [
    {
      title: '总资源数',
      value: basicStats.totalResources,
      icon: <StorageIcon />,
      color: '#2196f3',
      trend: { value: 12, direction: 'up' },
      description: '数据目录中的资源总数'
    },
    {
      title: '分类维度',
      value: basicStats.totalDimensions,
      icon: <CategoryIcon />,
      color: '#4caf50',
      description: '启用的分类维度数量'
    },
    {
      title: '分类数量',
      value: basicStats.totalCategories,
      icon: <AssessmentIcon />,
      color: '#ff9800',
      trend: { value: 5, direction: 'up' },
      description: '所有维度的分类总数'
    },
    {
      title: '标签数量',
      value: basicStats.totalTags,
      icon: <LabelIcon />,
      color: '#9c27b0',
      description: '可用标签总数'
    },
    {
      title: '收藏资源',
      value: basicStats.totalFavorites,
      icon: <StarIcon />,
      color: '#f44336',
      description: '用户收藏的资源数量'
    },
    {
      title: '平均质量',
      value: `${basicStats.avgQuality}%`,
      icon: <SpeedIcon />,
      color: getResourceQualityColor(basicStats.avgQuality),
      trend: { value: 3, direction: 'up' },
      description: '所有资源的平均质量分数'
    },
    {
      title: '总使用次数',
      value: basicStats.totalUsage.toLocaleString(),
      icon: <ViewIcon />,
      color: '#607d8b',
      trend: { value: 25, direction: 'up' },
      description: '所有资源的累计使用次数'
    },
    {
      title: '数据量',
      value: `${basicStats.totalDataVolume} GB`,
      icon: <StorageIcon />,
      color: '#795548',
      description: '所有资源的总数据量'
    }
  ];

  // 获取质量分布百分比
  const getQualityPercentage = (count: number) => {
    return resources.length > 0 ? Math.round((count / resources.length) * 100) : 0;
  };

  // 获取类型/领域分布的前几名
  const getTopItems = (distribution: Record<string, number>, limit: number = 5) => {
    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 标题栏 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          数据目录统计
        </Typography>
        
        <Tooltip title="刷新统计">
          <IconButton onClick={onRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* 统计卡片 */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4,
        justifyContent: 'space-between'
      }}>
        {statCards.map((card, index) => (
          <Box key={index} sx={{ 
            flex: '1 1 280px',
            minWidth: '280px',
            maxWidth: '320px'
          }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 1
                }}>
                  <Avatar sx={{ bgcolor: card.color, width: 40, height: 40 }}>
                    {card.icon}
                  </Avatar>
                  
                  {card.trend && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: card.trend.direction === 'up' ? 'success.main' : 'error.main'
                    }}>
                      {card.trend.direction === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {card.trend.value}%
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {card.value}
                </Typography>
                
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {card.title}
                </Typography>
                
                {card.description && (
                  <Typography variant="caption" color="text.secondary">
                    {card.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 3
      }}>
        {/* 第一行：质量分布和类型分布 */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3,
          flexWrap: 'wrap'
        }}>
          {/* 质量分布 */}
          <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PieChartIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                质量分布
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              {/* 优秀 */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">优秀 (80-100%)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {qualityDistribution.excellent} ({getQualityPercentage(qualityDistribution.excellent)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={getQualityPercentage(qualityDistribution.excellent)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#4caf50'
                    }
                  }}
                />
              </Box>
              
              {/* 良好 */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">良好 (60-79%)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {qualityDistribution.good} ({getQualityPercentage(qualityDistribution.good)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={getQualityPercentage(qualityDistribution.good)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#ff9800'
                    }
                  }}
                />
              </Box>
              
              {/* 较差 */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">较差 (0-59%)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {qualityDistribution.poor} ({getQualityPercentage(qualityDistribution.poor)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={getQualityPercentage(qualityDistribution.poor)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#f44336'
                    }
                  }}
                />
              </Box>
            </Box>
          </Paper>
          </Box>
          
          {/* 维度统计 */}
          <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                维度统计
              </Typography>
            </Box>
            
            <List dense>
              {dimensionStats.map((dimension, index) => (
                <ListItem key={dimension.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: dimension.color || 'primary.main',
                        width: 32,
                        height: 32
                      }}
                    >
                      <CategoryIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {dimension.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip 
                            label={`${dimension.stats.categoryCount} 分类`} 
                            size="small" 
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                          <Chip 
                            label={`${dimension.stats.resourceCount} 资源`} 
                            size="small" 
                            sx={{ 
                              height: 20, 
                              fontSize: '0.7rem',
                              bgcolor: dimension.color || 'primary.main',
                              color: 'white'
                            }}
                          />
                        </Box>
                      </Box>
                    }
                    secondary={
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((dimension.stats.resourceCount / resources.length) * 100, 100)}
                        sx={{
                          mt: 1,
                          height: 4,
                          borderRadius: 2,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: dimension.color || 'primary.main'
                          }
                        }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          </Box>
          
          {/* 类型分布 */}
          <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShowChartIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                资源类型分布
              </Typography>
            </Box>
            
            <List dense>
              {getTopItems(typeDistribution).map(([type, count], index) => {
                const percentage = Math.round((count / resources.length) * 100);
                const colors = ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336'];
                const color = colors[index % colors.length];
                
                return (
                  <ListItem key={type} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: color, width: 32, height: 32 }}>
                        <StorageIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {count} ({percentage}%)
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            mt: 1,
                            height: 4,
                            borderRadius: 2,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: color
                            }
                          }}
                        />
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
          </Box>
        </Box>
        
        {/* 第二行：热门标签 */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3,
          flexWrap: 'wrap'
        }}>
          {/* 热门标签 */}
          <Box sx={{ flex: '1 1 100%', width: '100%' }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LabelIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  热门标签
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {popularTags.map((tag) => (
                  <Tooltip key={tag.id} title={tag.description}>
                    <Badge badgeContent={tag.usageCount} color="primary">
                      <Chip
                        label={tag.name}
                        size="small"
                        sx={{
                          bgcolor: tag.color,
                          color: 'white',
                          '&:hover': {
                            opacity: 0.8
                          }
                        }}
                      />
                    </Badge>
                  </Tooltip>
                ))}
              </Box>
              
              {popularTags.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  暂无标签使用统计
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CatalogStatsPanel;
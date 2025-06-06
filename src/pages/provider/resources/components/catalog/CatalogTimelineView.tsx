import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  Event as EventIcon,
  Create as CreateIcon,
  Update as UpdateIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  DateRange as DateRangeIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

import { useDataCatalog } from '../../../../../contexts/DataCatalogContext';
import type { CatalogDataResource } from '../../../../../contexts/DataCatalogContext';
import useResponsive from '../../../../../hooks/useResponsive';

interface CatalogTimelineViewProps {
  onResourceSelect?: (resource: CatalogDataResource) => void;
}

interface TimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'accessed' | 'shared' | 'quality_change';
  timestamp: Date;
  resource: CatalogDataResource;
  description: string;
  metadata?: any;
}

/**
 * 数据目录时间线视图组件
 * 按时间顺序展示资源的生命周期事件
 */
const CatalogTimelineView: React.FC<CatalogTimelineViewProps> = ({ onResourceSelect }) => {
  const responsive = useResponsive();
  const {
    getFilteredResources,
    toggleResourceFavorite,
    getResourceQualityColor
  } = useDataCatalog();

  // 本地状态
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [eventTypes, setEventTypes] = useState<string[]>(['all']);
  const [_selectedResource, setSelectedResource] = useState<CatalogDataResource | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  // 事件类型配置
  const eventTypeConfig = {
    created: { label: '创建', icon: CreateIcon, color: '#4caf50' },
    updated: { label: '更新', icon: UpdateIcon, color: '#2196f3' },
    accessed: { label: '访问', icon: ViewIcon, color: '#ff9800' },
    shared: { label: '分享', icon: ShareIcon, color: '#9c27b0' },
    quality_change: { label: '质量变化', icon: AssessmentIcon, color: '#f44336' }
  };

  // 生成时间线事件
  const timelineEvents = useMemo(() => {
    const resources = getFilteredResources();
    const events: TimelineEvent[] = [];
    const now = new Date();
    const timeRangeMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000
    }[timeRange];

    resources.forEach(resource => {
      // 创建事件
      if (resource.metadata?.createdAt) {
        const createdDate = new Date(resource.metadata.createdAt);
        if (now.getTime() - createdDate.getTime() <= timeRangeMs) {
          events.push({
            id: `${resource.id}-created`,
            type: 'created',
            timestamp: createdDate,
            resource,
            description: `资源 "${resource.name}" 被创建`
          });
        }
      }

      // 更新事件
      if (resource.metadata?.updatedAt) {
        const updatedDate = new Date(resource.metadata.updatedAt);
        if (now.getTime() - updatedDate.getTime() <= timeRangeMs) {
          events.push({
            id: `${resource.id}-updated`,
            type: 'updated',
            timestamp: updatedDate,
            resource,
            description: `资源 "${resource.name}" 被更新`
          });
        }
      }

      // 访问事件
      if (resource.lastAccessed) {
        const accessedDate = new Date(resource.lastAccessed);
        if (now.getTime() - accessedDate.getTime() <= timeRangeMs) {
          events.push({
            id: `${resource.id}-accessed`,
            type: 'accessed',
            timestamp: accessedDate,
            resource,
            description: `资源 "${resource.name}" 被访问`,
            metadata: { usageCount: resource.usageFrequency }
          });
        }
      }

      // 模拟质量变化事件
      const qualityChangeDate = new Date(now.getTime() - Math.random() * timeRangeMs);
      if (Math.random() > 0.7) { // 30% 概率有质量变化
        events.push({
          id: `${resource.id}-quality`,
          type: 'quality_change',
          timestamp: qualityChangeDate,
          resource,
          description: `资源 "${resource.name}" 质量分数更新为 ${resource.qualityScore || 0}%`,
          metadata: { qualityScore: resource.qualityScore }
        });
      }
    });

    // 按时间排序（最新的在前）
    return events
      .filter(event => 
        eventTypes.includes('all') || eventTypes.includes(event.type)
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [getFilteredResources, timeRange, eventTypes]);

  // 按日期分组事件
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: TimelineEvent[] } = {};
    
    timelineEvents.forEach(event => {
      const dateKey = event.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });
    
    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [timelineEvents]);

  // 获取事件图标
  const getEventIcon = (type: string) => {
    const config = eventTypeConfig[type as keyof typeof eventTypeConfig];
    if (!config) return <EventIcon />;
    
    const IconComponent = config.icon;
    return <IconComponent />;
  };

  // 获取事件颜色
  const getEventColor = (type: string) => {
    const config = eventTypeConfig[type as keyof typeof eventTypeConfig];
    return config?.color || '#666';
  };

  // 处理资源菜单
  const handleResourceMenu = (event: React.MouseEvent, resource: CatalogDataResource) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget as HTMLElement);
    setSelectedResource(resource);
  };

  // 关闭菜单
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedResource(null);
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 工具栏 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* 时间范围选择 */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>时间范围</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                label="时间范围"
              >
                <MenuItem value="day">今天</MenuItem>
                <MenuItem value="week">本周</MenuItem>
                <MenuItem value="month">本月</MenuItem>
                <MenuItem value="year">本年</MenuItem>
              </Select>
            </FormControl>
            
            {/* 事件统计 */}
            <Typography variant="body2" color="text.secondary">
              共 {timelineEvents.length} 个事件
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* 过滤器 */}
            <Tooltip title="事件过滤">
              <IconButton
                size="small"
                onClick={(e) => setFilterAnchor(e.currentTarget)}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
      
      {/* 时间线内容 */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 2 }}>
        {groupedEvents.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <DateRangeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              暂无事件
            </Typography>
            <Typography variant="body2" color="text.secondary">
              在选定的时间范围内没有找到相关事件
            </Typography>
          </Paper>
        ) : (
          groupedEvents.map(([dateKey, events]) => (
            <Box key={dateKey} sx={{ mb: 4 }}>
              {/* 日期标题 */}
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  color: 'primary.main',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <DateRangeIcon />
                {formatDate(dateKey)}
                <Chip 
                  label={events.length} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 1 }}
                />
              </Typography>
              
              {/* 事件时间线 */}
              <Timeline position={responsive.isXs ? 'right' : 'alternate'}>
                {events.map((event, index) => (
                  <TimelineItem key={event.id}>
                    <TimelineOppositeContent
                      sx={{ 
                        m: 'auto 0',
                        display: responsive.isXs ? 'none' : 'block'
                      }}
                      align={index % 2 === 0 ? 'right' : 'left'}
                      variant="body2"
                      color="text.secondary"
                    >
                      {formatTime(event.timestamp)}
                    </TimelineOppositeContent>
                    
                    <TimelineSeparator>
                      <TimelineDot 
                        sx={{ 
                          bgcolor: getEventColor(event.type),
                          color: 'white'
                        }}
                      >
                        {getEventIcon(event.type)}
                      </TimelineDot>
                      {index < events.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 2
                          }
                        }}
                        onClick={() => onResourceSelect?.(event.resource)}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            mb: 1
                          }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {event.description}
                              </Typography>
                              {responsive.isXs && (
                                <Typography variant="caption" color="text.secondary">
                                  {formatTime(event.timestamp)}
                                </Typography>
                              )}
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {/* 收藏按钮 */}
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleResourceFavorite(event.resource.id);
                                }}
                              >
                                {event.resource.isFavorite ? (
                                  <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                                ) : (
                                  <StarBorderIcon sx={{ fontSize: 16 }} />
                                )}
                              </IconButton>
                              
                              {/* 更多操作 */}
                              <IconButton
                                size="small"
                                onClick={(e) => handleResourceMenu(e, event.resource)}
                              >
                                <MoreVertIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          </Box>
                          
                          {/* 资源信息 */}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            mb: 1
                          }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                              <Typography variant="caption">
                                {event.resource.name.charAt(0).toUpperCase()}
                              </Typography>
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {event.resource.name}
                            </Typography>
                          </Box>
                          
                          {/* 标签和指标 */}
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1
                          }}>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Chip 
                                label={event.resource.type} 
                                size="small" 
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                              <Chip 
                                label={eventTypeConfig[event.type as keyof typeof eventTypeConfig]?.label || event.type} 
                                size="small" 
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.7rem',
                                  bgcolor: getEventColor(event.type),
                                  color: 'white'
                                }}
                              />
                            </Box>
                            
                            {/* 质量分数 */}
                            {event.resource.qualityScore !== undefined && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={event.resource.qualityScore}
                                  sx={{
                                    width: 40,
                                    height: 4,
                                    borderRadius: 2,
                                    bgcolor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: getResourceQualityColor(event.resource.qualityScore)
                                    }
                                  }}
                                />
                                <Typography variant="caption">
                                  {event.resource.qualityScore}%
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          
                          {/* 事件元数据 */}
                          {event.metadata && (
                            <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                              {event.type === 'accessed' && event.metadata.usageCount && (
                                <Typography variant="caption" color="text.secondary">
                                  累计访问: {event.metadata.usageCount} 次
                                </Typography>
                              )}
                              {event.type === 'quality_change' && event.metadata.qualityScore && (
                                <Typography variant="caption" color="text.secondary">
                                  质量分数: {event.metadata.qualityScore}%
                                </Typography>
                              )}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>
          ))
        )}
      </Box>
      
      {/* 事件过滤菜单 */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            事件类型
          </Typography>
          {Object.entries(eventTypeConfig).map(([type, config]) => (
            <MenuItem
              key={type}
              onClick={() => {
                const newTypes = eventTypes.includes(type)
                  ? eventTypes.filter(t => t !== type)
                  : [...eventTypes.filter(t => t !== 'all'), type];
                setEventTypes(newTypes.length === 0 ? ['all'] : newTypes);
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: config.color
                  }}
                />
                {config.label}
                {(eventTypes.includes(type) || eventTypes.includes('all')) && (
                  <Typography variant="caption" sx={{ ml: 'auto' }}>✓</Typography>
                )}
              </Box>
            </MenuItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <MenuItem
            onClick={() => setEventTypes(['all'])}
          >
            全部事件
            {eventTypes.includes('all') && (
              <Typography variant="caption" sx={{ ml: 'auto' }}>✓</Typography>
            )}
          </MenuItem>
        </Box>
      </Menu>
      
      {/* 资源操作菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>查看详情</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>分享资源</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CatalogTimelineView;
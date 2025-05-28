import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Search as SearchIcon,
  CalendarToday as CalendarTodayIcon,
  GetApp as GetAppIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

// 合规报告类型定义
interface ComplianceReport {
  id: number;
  title: string;
  type: 'gdpr' | 'security' | 'quality' | 'usage';
  status: 'passed' | 'warning' | 'failed';
  score: number;
  date: string;
  issues: number;
  critical: number;
  author: string;
  size: string;
}

// 模拟数据
const mockReports: ComplianceReport[] = [
  {
    id: 1,
    title: '数据隐私合规报告 - Q2 2024',
    type: 'gdpr',
    status: 'passed',
    score: 95,
    date: '2024-06-01',
    issues: 3,
    critical: 0,
    author: '合规团队',
    size: '2.5 MB',
  },
  {
    id: 2,
    title: '数据安全审计报告',
    type: 'security',
    status: 'warning',
    score: 78,
    date: '2024-05-15',
    issues: 8,
    critical: 1,
    author: '安全团队',
    size: '3.2 MB',
  },
  {
    id: 3,
    title: '数据质量评估报告',
    type: 'quality',
    status: 'passed',
    score: 92,
    date: '2024-05-10',
    issues: 5,
    critical: 0,
    author: '数据管理团队',
    size: '1.8 MB',
  },
  {
    id: 4,
    title: '数据使用合规报告',
    type: 'usage',
    status: 'failed',
    score: 65,
    date: '2024-04-28',
    issues: 12,
    critical: 3,
    author: '合规团队',
    size: '2.1 MB',
  },
];

// 合规统计
const complianceStats = {
  totalReports: 4,
  passedReports: 2,
  warningReports: 1,
  failedReports: 1,
  avgScore: 82.5,
  totalIssues: 28,
  criticalIssues: 4,
};

const ComplianceReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reports] = useState<ComplianceReport[]>(mockReports);

  // 获取报告类型颜色
  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'gdpr':
        return 'primary';
      case 'security':
        return 'error';
      case 'quality':
        return 'success';
      case 'usage':
        return 'warning';
      default:
        return 'default';
    }
  };

  // 获取报告类型名称
  const getReportTypeName = (type: string) => {
    switch (type) {
      case 'gdpr':
        return '数据隐私';
      case 'security':
        return '安全审计';
      case 'quality':
        return '数据质量';
      case 'usage':
        return '使用合规';
      default:
        return type;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'success';
      case 'warning':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  // 获取状态名称
  const getStatusName = (status: string) => {
    switch (status) {
      case 'passed':
        return '通过';
      case 'warning':
        return '警告';
      case 'failed':
        return '失败';
      default:
        return status;
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        合规报告
      </Typography>

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                报告总数
              </Typography>
              <Typography variant="h3">{complianceStats.totalReports}</Typography>
              <Box display="flex" mt={1}>
                <Chip
                  label={`通过: ${complianceStats.passedReports}`}
                  size="small"
                  color="success"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`警告: ${complianceStats.warningReports}`}
                  size="small"
                  color="warning"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`失败: ${complianceStats.failedReports}`}
                  size="small"
                  color="error"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                平均合规评分
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h3" sx={{ mr: 1 }}>{complianceStats.avgScore}</Typography>
                <Typography variant="body1">/100</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={complianceStats.avgScore}
                color={complianceStats.avgScore >= 90 ? 'success' : complianceStats.avgScore >= 70 ? 'warning' : 'error'}
                sx={{ mt: 1, mb: 1, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                发现问题
              </Typography>
              <Typography variant="h3">{complianceStats.totalIssues}</Typography>
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                <ErrorIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 18 }} />
                其中 {complianceStats.criticalIssues} 个严重问题
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 搜索和筛选 */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="搜索报告标题或作者..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>报告类型</InputLabel>
            <Select
              value={typeFilter}
              label="报告类型"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="gdpr">数据隐私</MenuItem>
              <MenuItem value="security">安全审计</MenuItem>
              <MenuItem value="quality">数据质量</MenuItem>
              <MenuItem value="usage">使用合规</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>状态</InputLabel>
            <Select
              value={statusFilter}
              label="状态"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="passed">通过</MenuItem>
              <MenuItem value="warning">警告</MenuItem>
              <MenuItem value="failed">失败</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* 报告表格 */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>报告标题</TableCell>
              <TableCell>类型</TableCell>
              <TableCell>状态</TableCell>
              <TableCell align="right">评分</TableCell>
              <TableCell align="right">问题数</TableCell>
              <TableCell align="right">生成日期</TableCell>
              <TableCell align="right">作者</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{report.title}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getReportTypeName(report.type)}
                    color={getReportTypeColor(report.type)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {getStatusIcon(report.status)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {getStatusName(report.status)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <Typography
                      variant="body2"
                      color={
                        report.score >= 90
                          ? 'success.main'
                          : report.score >= 70
                          ? 'warning.main'
                          : 'error.main'
                      }
                      sx={{ mr: 1, fontWeight: 'bold' }}
                    >
                      {report.score}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={report.score}
                      color={
                        report.score >= 90 ? 'success' : report.score >= 70 ? 'warning' : 'error'
                      }
                      sx={{ width: 60, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {report.issues} <Typography component="span" color="error" variant="body2">{report.critical > 0 ? `(${report.critical}个严重)` : ''}</Typography>
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <CalendarTodayIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{report.date}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{report.author}</TableCell>
                <TableCell align="right">
                  <Box>
                    <Tooltip title="查看报告">
                      <IconButton size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="下载报告">
                      <IconButton size="small">
                        <GetAppIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="分享报告">
                      <IconButton size="small">
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<DescriptionIcon />}
          sx={{ mr: 2 }}
        >
          生成新报告
        </Button>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
        >
          高级筛选
        </Button>
      </Box>
    </Box>
  );
};

export default ComplianceReports;
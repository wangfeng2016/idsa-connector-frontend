import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Paper,
  LinearProgress,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { useDropzone } from 'react-dropzone'; // 暂时注释掉，使用原生文件上传

interface ResourceMetadata {
  title: string; // 名称
  description: string; // 描述
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'other'; // 类型
  format: string; // 格式
  keywords: string[]; // 关键词
}

interface UploadedFile {
  file: File;
  preview?: {
    headers: string[];
    rows: string[][];
    totalRows: number;
  };
}

const steps = ['上传文件', '预览数据', '设置元数据', '完成创建'];

const ResourceUpload: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [metadata, setMetadata] = useState<ResourceMetadata>({
    title: '',
    description: '',
    type: 'document',
    format: '',
    keywords: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      // 模拟文件上传进度
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            // 模拟文件预览数据
            const preview = {
              headers: ['ID', '姓名', '年龄', '城市', '职业'],
              rows: [
                ['1', '张三', '28', '北京', '工程师'],
                ['2', '李四', '32', '上海', '设计师'],
                ['3', '王五', '25', '广州', '产品经理'],
                ['4', '赵六', '30', '深圳', '数据分析师'],
                ['5', '钱七', '27', '杭州', '前端开发'],
              ],
              totalRows: 15000,
            };
            setUploadedFile({ file, preview });
            setMetadata(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, ''), format: file.name.split('.').pop()?.toUpperCase() || '' }));
            setActiveStep(1);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleNext = () => {
    if (activeStep === 2) {
      // 验证元数据
      if (!metadata.title || !metadata.description || !metadata.format) {
        setError('请填写所有必填字段');
        return;
      }
    }
    setError(null);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !metadata.keywords.includes(tagInput.trim())) {
      setMetadata({
        ...metadata,
        keywords: [...metadata.keywords, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMetadata({
      ...metadata,
      keywords: metadata.keywords.filter(tag => tag !== tagToRemove),
    });
  };

  const handleCreateResource = () => {
    // 模拟创建资源
    setTimeout(() => {
      navigate('/enterprise/resources');
    }, 1000);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              上传数据文件
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              支持 CSV、Excel (xlsx/xls)、JSON 格式文件，最大 100MB
            </Typography>
            
            {!uploadedFile && (
              <Paper
                sx={{
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <UploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  点击选择文件上传
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  支持的格式：CSV, XLSX, XLS, JSON
                </Typography>
              </Paper>
            )}

            {isUploading && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" gutterBottom>
                  上传进度: {uploadProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}

            {uploadedFile && (
              <Alert severity="success" sx={{ mt: 3 }}>
                文件上传成功：{uploadedFile.file.name}
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              数据预览
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              预览上传的数据文件内容，确认数据格式正确
            </Typography>

            {uploadedFile?.preview && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">
                    文件：{uploadedFile.file.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    总计 {uploadedFile.preview.totalRows.toLocaleString()} 行数据
                  </Typography>
                </Box>
                
                <Paper sx={{ overflow: 'hidden' }}>
                  <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                          {uploadedFile.preview.headers.map((header, index) => (
                            <th key={index} style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {uploadedFile.preview.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Paper>
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  显示前 5 行数据，实际资源包含 {uploadedFile.preview.totalRows.toLocaleString()} 行
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              设置资源元数据
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              为资源添加描述信息，便于管理和发现
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="资源名称"
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                required
                helperText="为资源指定一个有意义的名称"
              />
              
              <TextField
                fullWidth
                label="描述"
                value={metadata.description}
                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                multiline
                rows={3}
                required
                helperText="详细描述资源的内容和用途"
              />

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth required>
                    <InputLabel>类型</InputLabel>
                    <Select
                      value={metadata.type}
                      label="类型"
                      onChange={(e) => setMetadata({ ...metadata, type: e.target.value as any })}
                    >
                      <MenuItem value="text">文本</MenuItem>
                      <MenuItem value="image">图像</MenuItem>
                      <MenuItem value="audio">音频</MenuItem>
                      <MenuItem value="video">视频</MenuItem>
                      <MenuItem value="document">文档</MenuItem>
                      <MenuItem value="other">其他</MenuItem>
                    </Select>
                    <FormHelperText>选择资源的数据类型</FormHelperText>
                  </FormControl>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="格式"
                    value={metadata.format}
                    onChange={(e) => setMetadata({ ...metadata, format: e.target.value })}
                    required
                    helperText="如：CSV、JSON、TXT等"
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  关键词
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {metadata.keywords.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword}
                      onDelete={() => handleRemoveTag(keyword)}
                      size="small"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="添加关键词"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button variant="outlined" onClick={handleAddTag}>
                    添加
                  </Button>
                </Box>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              资源创建成功！
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              资源 "{metadata.title}" 已成功创建并可以使用
            </Typography>
            
            <Paper sx={{ p: 2, textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
              <Typography variant="subtitle2" gutterBottom>
                资源信息：
              </Typography>
              <Typography variant="body2">名称：{metadata.title}</Typography>
              <Typography variant="body2">文件：{uploadedFile?.file.name}</Typography>
              <Typography variant="body2">大小：{((uploadedFile?.file.size || 0) / 1024 / 1024).toFixed(2)} MB</Typography>
              <Typography variant="body2">类型：{metadata.type}</Typography>
              <Typography variant="body2">格式：{metadata.format}</Typography>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/enterprise/resources')}
          sx={{ mr: 2 }}
        >
          返回
        </Button>
        <Typography variant="h4" component="h1">
          上传资源
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              上一步
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleCreateResource}
              >
                完成
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === 0 && !uploadedFile}
              >
                下一步
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResourceUpload;
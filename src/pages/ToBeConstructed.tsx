import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import { Construction } from '@mui/icons-material';

interface ToBeConstructedProps {
  pageName?: string;
  description?: string;
}

const ToBeConstructed: React.FC<ToBeConstructedProps> = ({ 
  pageName = '页面', 
  description = '此页面正在开发中，敬请期待。' 
}) => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Construction 
            sx={{ 
              fontSize: 80, 
              color: 'warning.main',
              mb: 2 
            }} 
          />
        </Box>
        
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: 'text.primary'
          }}
        >
          {pageName}
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          {description}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
        >
          我们正在努力为您构建这个功能，请稍后再试。
        </Typography>
      </Paper>
    </Container>
  );
};

export default ToBeConstructed;
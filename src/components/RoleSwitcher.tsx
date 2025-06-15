import React from 'react';
import { FormControl, Select, MenuItem, Box, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useRole } from '../contexts/RoleContext';
import type { UserRole } from '../contexts/RoleContext';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

const roleOptions: UserRole[] = [
  {
    type: 'operator',
    name: '数据空间运营者',
    permissions: ['*'],
    organizationId: 'operator-org'
  },
  {
    type: 'enterprise',
    name: '企业用户',
    permissions: ['enterprise:*'],
    organizationId: 'enterprise-org'
  }
];

const getRoleIcon = (roleType: string) => {
  switch (roleType) {
    case 'operator':
      return <BusinessCenterIcon sx={{ fontSize: 16, mr: 1 }} />;
    case 'enterprise':
      return <CloudUploadIcon sx={{ fontSize: 16, mr: 1 }} />;
    default:
      return null;
  }
};

const RoleSwitcher: React.FC = () => {
  const { currentRole, switchRole } = useRole();

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    const selectedRoleType = event.target.value;
    const selectedRole = roleOptions.find(role => role.type === selectedRoleType);
    if (selectedRole) {
      switchRole(selectedRole);
    }
  };

  return (
    <Box sx={{ minWidth: 180, mr: 2 }}>
      <FormControl size="small" fullWidth>
        <Select
          value={currentRole.type}
          onChange={handleRoleChange}
          sx={{
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiSvgIcon-root': {
              color: 'white',
            },
          }}
          renderValue={(value) => {
            const role = roleOptions.find(r => r.type === value);
            return (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getRoleIcon(value)}
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {role?.name}
                </Typography>
              </Box>
            );
          }}
        >
          {roleOptions.map((role) => (
            <MenuItem key={role.type} value={role.type}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getRoleIcon(role.type)}
                <Typography variant="body2">
                  {role.name}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default RoleSwitcher;
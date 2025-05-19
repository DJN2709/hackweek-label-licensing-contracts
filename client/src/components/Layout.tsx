import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
  Avatar,
} from '@mui/material';
import {
  KeyboardArrowDown,
  ChevronLeft,
  MusicNote,
  Group,
  Description,
  Calculate,
  CheckCircleOutline,
  TrendingUp,
  BarChart,
  AccountTree,
  Analytics,
} from '@mui/icons-material';
import ChatBot from '../pages/ChatBot';
import ContractAnalyst from '../pages/ContractAnalyst';

// Import custom icons
import { ReactComponent as Logo } from '../assets/logo.svg';
import { ReactComponent as BotIcon } from '../assets/bot-icon.svg';

const drawerWidth = 186;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: 0,
  marginLeft: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  hasArrow?: boolean;
  isTopItem?: boolean;
}

const menuItems: MenuItem[] = [
  { text: 'Enterprise Music', icon: <MusicNote />, hasArrow: true, isTopItem: true, path: '/' },
  { text: 'Ask RoyAI', icon: <BotIcon />, path: '/ask-royai' },
  { text: 'Licensors', icon: <Group />, path: '/licensors' },
  { text: 'Contracts', icon: <Description />, path: '/contracts' },
  { text: 'Contract Analyst', icon: <Analytics />, path: '/contract-analyst' },
  { text: 'Calculations', icon: <Calculate />, path: '/calculations' },
  { text: 'MEC Checks', icon: <CheckCircleOutline />, path: '/mec-checks' },
  { text: 'Uplifts', icon: <TrendingUp />, path: '/uplifts' },
  { text: 'Reporting', icon: <BarChart />, path: '/reporting' },
  { text: 'Libraries', icon: <AccountTree />, hasArrow: true, path: '/libraries' },
];

const LayoutContent: React.FC = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#181818',
            color: 'white',
            borderRight: 'none',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #535353'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Logo style={{ width: 24, height: 24 }} />
            <Typography sx={{ 
              color: 'white',
              fontSize: '1rem',
              fontWeight: 500,
            }}>
              Royalty Studio
            </Typography>
          </Box>
        </Box>
        <List sx={{ px: 0 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                color: location.pathname === item.path ? 'white' : '#B3B3B3',
                bgcolor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
                cursor: 'pointer',
                py: 2,
                px: 0,
                pl: 2,
                ...(item.isTopItem && {
                  borderBottom: '1px solid #535353',
                  mb: 2
                }),
                display: 'flex',
                alignItems: 'center',
                gap: item.hasArrow ? '17px' : '18px',
                height: '48px',
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? 'white' : '#B3B3B3',
                minWidth: '24px'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  m: 0,
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: 450,
                  }
                }}
              />
              {item.hasArrow && (
                <KeyboardArrowDown sx={{ color: '#B3B3B3' }} />
              )}
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ 
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1.5,
            borderTop: '1px solid #535353',
            height: '48px',
          }}>
            <Typography sx={{ 
              fontSize: '0.875rem',
              fontWeight: 450,
              color: '#B3B3B3',
            }}>
              Collapse sidebar
            </Typography>
            <ChevronLeft sx={{ color: '#B3B3B3' }} onClick={handleDrawerToggle} />
          </Box>
          <Box sx={{ 
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.08)',
            },
            height: '48px',
            borderTop: '1px solid #535353',
          }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
              }}
            />
            <Typography sx={{ 
              fontSize: '0.875rem',
              fontWeight: 450,
              color: '#B3B3B3',
            }}>
              Pablo Molero
            </Typography>
            <KeyboardArrowDown sx={{ color: '#B3B3B3', ml: 'auto' }} />
          </Box>
        </Box>
      </Drawer>
      <Main open={open}>
        <Routes>
          <Route path="/" element={<ChatBot />} />
          <Route path="/ask-royai" element={<ChatBot />} />
          <Route path="/contract-analyst" element={<ContractAnalyst />} />
          {/* Add other routes as needed */}
        </Routes>
      </Main>
    </Box>
  );
};

const Layout: React.FC = () => {
  return (
    <Router>
      <LayoutContent />
    </Router>
  );
};

export default Layout; 
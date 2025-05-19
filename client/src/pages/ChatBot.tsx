import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button
} from '@mui/material';
import { 
  MusicNote,
  Add as AddIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  MoreHoriz as MoreHorizIcon,
  Lightbulb as LightbulbIcon,
  Mic as MicIcon
} from '@mui/icons-material';

const ChatBot = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Box sx={{ width: '100%', bgcolor: '#FAFAFA', minHeight: '100vh', p: 0 }}>
      <Box sx={{ p: 3 }}>
        <Box 
          className="title-container"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            mb: 3 
          }}
        >
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: '42px',
              fontWeight: 500,
              color: '#1A1A1A',
              lineHeight: 1.2
            }}
          >
            Ask RoyAI
          </Typography>
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: '#F5F5F5',
              borderRadius: '8px',
              padding: '6px 12px',
            }}
          >
            <MusicNote sx={{ fontSize: 18, color: '#666666' }} />
            <Typography 
              sx={{ 
                fontSize: '14px',
                fontWeight: 400,
                color: '#666666',
              }}
            >
              Music
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          pt: '150px',
          pb: 4
        }}>
          <Typography variant="h1" sx={{ 
            fontSize: '32px',
            fontWeight: 400,
            color: '#1A1A1A',
            mb: 4
          }}>
            What can I help with?
          </Typography>
          
          <Box sx={{ 
            width: '100%', 
            maxWidth: '600px',
            bgcolor: 'white',
            borderRadius: '24px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }}>
            {/* Input field row */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1.5,
              gap: 1
            }}>
              <IconButton sx={{ 
                p: 1,
                color: '#666666',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
              }}>
                <AddIcon sx={{ fontSize: 20 }} />
              </IconButton>
              
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  padding: '8px 12px',
                  color: '#1A1A1A',
                  backgroundColor: 'transparent'
                }}
              />
              
              <IconButton sx={{ 
                p: 1,
                color: '#666666',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
              }}>
                <MicIcon sx={{ fontSize: 20 }} />
              </IconButton>
              
              <IconButton sx={{ 
                p: 1,
                bgcolor: '#1A1A1A',
                color: 'white',
                '&:hover': { bgcolor: '#000000' }
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect width="6" height="16" rx="1" fill="currentColor"/>
                  <rect x="9" y="4" width="6" height="12" rx="1" fill="currentColor"/>
                  <rect x="18" y="8" width="6" height="8" rx="1" fill="currentColor"/>
                </svg>
              </IconButton>
            </Box>
            
            {/* Action buttons row */}
            <Box sx={{ 
              display: 'flex', 
              px: 2,
              pb: 2,
              gap: 1
            }}>
              <Button
                startIcon={<SearchIcon sx={{ fontSize: 16 }} />}
                sx={{
                  color: '#666666',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: 2,
                  py: 0.75,
                  fontSize: '14px',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                Search
              </Button>
              
              <Button
                startIcon={<LightbulbIcon sx={{ fontSize: 16 }} />}
                sx={{
                  color: '#666666',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: 2,
                  py: 0.75,
                  fontSize: '14px',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                Reason
              </Button>
              
              <Button
                startIcon={<ImageIcon sx={{ fontSize: 16 }} />}
                sx={{
                  color: '#666666',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: 2,
                  py: 0.75,
                  fontSize: '14px',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                Create image
              </Button>
              
              <IconButton sx={{ 
                p: 1,
                color: '#666666',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
              }}>
                <MoreHorizIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, auto)',
            gap: 2,
            mt: 3,
            px: 2,
            width: '100%',
            maxWidth: '600px',
            justifyContent: 'center'
          }}>
            <Button
              sx={{
                bgcolor: '#F5F5F5',
                color: '#4A4A4A',
                borderRadius: '20px',
                textTransform: 'none',
                px: 3,
                py: 1.5,
                fontSize: '14px',
                fontWeight: 400,
                width: 'fit-content',
                minWidth: 'unset',
                whiteSpace: 'nowrap',
                boxShadow: 'none',
                '&:hover': { 
                  bgcolor: '#EBEBEB',
                  boxShadow: 'none'
                }
              }}
            >
              Analyze new contract
            </Button>
            <Button
              sx={{
                bgcolor: '#F5F5F5',
                color: '#4A4A4A',
                borderRadius: '20px',
                textTransform: 'none',
                px: 3,
                py: 1.5,
                fontSize: '14px',
                fontWeight: 400,
                width: 'fit-content',
                minWidth: 'unset',
                whiteSpace: 'nowrap',
                boxShadow: 'none',
                '&:hover': { 
                  bgcolor: '#EBEBEB',
                  boxShadow: 'none'
                }
              }}
            >
              Extract royalty terms
            </Button>
            <Button
              sx={{
                bgcolor: '#F5F5F5',
                color: '#4A4A4A',
                borderRadius: '20px',
                textTransform: 'none',
                px: 3,
                py: 1.5,
                fontSize: '14px',
                fontWeight: 400,
                width: 'fit-content',
                minWidth: 'unset',
                whiteSpace: 'nowrap',
                boxShadow: 'none',
                '&:hover': { 
                  bgcolor: '#EBEBEB',
                  boxShadow: 'none'
                }
              }}
            >
              Compare contract versions
            </Button>
            <Button
              sx={{
                bgcolor: '#F5F5F5',
                color: '#4A4A4A',
                borderRadius: '20px',
                textTransform: 'none',
                px: 3,
                py: 1.5,
                fontSize: '14px',
                fontWeight: 400,
                width: 'fit-content',
                minWidth: 'unset',
                whiteSpace: 'nowrap',
                boxShadow: 'none',
                '&:hover': { 
                  bgcolor: '#EBEBEB',
                  boxShadow: 'none'
                }
              }}
            >
              Find similar clauses
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBot; 
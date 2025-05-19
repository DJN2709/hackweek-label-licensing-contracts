import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Tabs,
  Tab,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress
} from '@mui/material';
import { 
  MusicNote,
  Description,
  Settings,
  Download,
  SignalCellularAlt,
  Refresh,
  ArrowForward,
  Visibility,
  AccessTime,
  Add,
  ContentCopy,
  Info,
  Computer,
  Share
} from '@mui/icons-material';

const ContractAnalyst = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#FAFAFA', minHeight: '100vh', p: 0 }}>
      <Box sx={{ p: 3 }}>
        <Box 
          className="title-container"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            mb: 2
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
            Contract Analyst
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
          borderBottom: '1px solid #E5E7EB',
          mb: 3
        }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#4F46E5',
              },
              '& .MuiTab-root': {
                color: '#666666',
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                minHeight: '48px',
                padding: '0 16px',
                '&:hover': {
                  color: '#4F46E5',
                },
                '&.Mui-selected': {
                  color: '#4F46E5',
                },
              },
            }}
          >
            <Tab label="Contract Input" />
            <Tab label="Term Extraction" />
            <Tab label="System Configuration" />
            <Tab label="Preview & Export" />
          </Tabs>
        </Box>

        {/* Contract Input Tab Content */}
        {selectedTab === 0 && (
          <Box>
            <Typography sx={{ 
              color: '#666666',
              fontSize: '14px',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              Enter or upload your contract to begin analysis
            </Typography>

            <Box sx={{ display: 'flex', gap: 3 }}>
              {/* Left Column - Contract Text */}
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ 
                  bgcolor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    p: 2,
                    borderBottom: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description sx={{ fontSize: 20, color: '#666666' }} />
                      <Typography sx={{ 
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#1A1A1A'
                      }}>
                        Contract Text
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <Description sx={{ fontSize: 20, color: '#666666' }} />
                      </IconButton>
                      <IconButton size="small">
                        <Download sx={{ fontSize: 20, color: '#666666' }} />
                      </IconButton>
                      <IconButton size="small">
                        <Settings sx={{ fontSize: 20, color: '#666666' }} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    p: 3,
                    minHeight: '500px'
                  }}>
                    <Typography sx={{ 
                      color: '#666666',
                      fontSize: '14px'
                    }}>
                      Paste your contract text here or upload a document...
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              {/* Right Column - AI Processing */}
              <Box sx={{ width: '300px' }}>
                <Paper sx={{ 
                  bgcolor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    p: 2,
                    borderBottom: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <SignalCellularAlt sx={{ fontSize: 20, color: '#666666' }} />
                    <Typography sx={{ 
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#1A1A1A'
                    }}>
                      AI Processing
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 3,
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}>
                    <Typography sx={{ 
                      color: '#666666',
                      fontSize: '14px',
                      mb: 2
                    }}>
                      Enter your contract text to begin AI analysis
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: '#666666',
                        color: 'white',
                        textTransform: 'none',
                        borderRadius: '8px',
                        '&:hover': {
                          bgcolor: '#4A4A4A'
                        }
                      }}
                    >
                      Analyze Contract
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        )}

        {/* Term Extraction Tab Content */}
        {selectedTab === 1 && (
          <Box>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '24px',
                fontWeight: 500,
                color: '#1A1A1A',
                mb: 1
              }}
            >
              Term Extraction
            </Typography>
            <Typography 
              sx={{ 
                color: '#666666',
                fontSize: '14px',
                mb: 3
              }}
            >
              AI-powered extraction of royalty terms from your contract
            </Typography>

            <Paper 
              sx={{ 
                bgcolor: 'white',
                borderRadius: '8px',
                p: 4,
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <Typography 
                sx={{ 
                  color: '#666666',
                  fontSize: '14px',
                  mb: 3
                }}
              >
                No terms have been extracted yet. Click "Extract Terms" to analyze the contract.
              </Typography>
            </Paper>

            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mt: 3
              }}
            >
              <Button
                startIcon={<Refresh />}
                variant="outlined"
                sx={{
                  color: '#666666',
                  borderColor: '#E5E7EB',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#666666',
                    bgcolor: 'transparent'
                  }
                }}
              >
                Refresh Extraction
              </Button>

              <Button
                endIcon={<ArrowForward />}
                variant="contained"
                sx={{
                  bgcolor: '#666666',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#4A4A4A'
                  }
                }}
              >
                Continue to Configuration
              </Button>
            </Box>
          </Box>
        )}

        {/* System Configuration Tab Content */}
        {selectedTab === 2 && (
          <Box>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '24px',
                fontWeight: 500,
                color: '#1A1A1A',
                mb: 1
              }}
            >
              System Configuration
            </Typography>
            <Typography 
              sx={{ 
                color: '#666666',
                fontSize: '14px',
                mb: 3
              }}
            >
              AI-optimized system configurations generated from contract terms
            </Typography>

            <Box sx={{ display: 'flex', gap: 3 }}>
              {/* Left Panel - Source Terms */}
              <Paper 
                sx={{ 
                  bgcolor: 'white',
                  borderRadius: '8px',
                  width: '300px'
                }}
              >
                <Box sx={{ 
                  p: 2,
                  borderBottom: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Visibility sx={{ fontSize: 20, color: '#666666' }} />
                  <Typography sx={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1A1A1A'
                  }}>
                    Source Terms
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2
                  }}>
                    <AccessTime sx={{ fontSize: 16, color: '#666666' }} />
                    <Typography sx={{ 
                      fontSize: '14px',
                      color: '#666666'
                    }}>
                      AI Translation Status
                    </Typography>
                  </Box>
                  <Typography sx={{ 
                    fontSize: '14px',
                    color: '#666666',
                    pl: 3
                  }}>
                    Ready to process
                  </Typography>
                </Box>
              </Paper>

              {/* Right Panel - Configuration Generation */}
              <Box sx={{ flex: 1 }}>
                <Paper 
                  sx={{ 
                    bgcolor: 'white',
                    borderRadius: '8px',
                    p: 4,
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Typography 
                    sx={{ 
                      color: '#666666',
                      fontSize: '14px',
                      mb: 3
                    }}
                  >
                    No configurations have been generated. Click "Generate Configurations" to proceed.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#0F172A',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: '8px',
                      px: 3,
                      py: 1,
                      '&:hover': {
                        bgcolor: '#1E293B'
                      }
                    }}
                  >
                    Generate Configurations
                  </Button>
                </Paper>
              </Box>
            </Box>

            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mt: 3
              }}
            >
              <Button
                startIcon={<Refresh />}
                variant="outlined"
                sx={{
                  color: '#666666',
                  borderColor: '#E5E7EB',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#666666',
                    bgcolor: 'transparent'
                  }
                }}
              >
                Regenerate Configurations
              </Button>

              <Button
                endIcon={<ArrowForward />}
                variant="contained"
                sx={{
                  bgcolor: '#666666',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#4A4A4A'
                  }
                }}
              >
                Continue to Preview
              </Button>
            </Box>
          </Box>
        )}

        {/* Preview & Export Tab Content */}
        {selectedTab === 3 && (
          <Box>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3
            }}>
              <Box>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: '24px',
                    fontWeight: 500,
                    color: '#1A1A1A',
                    mb: 1
                  }}
                >
                  Preview & Export
                </Typography>
                <Typography 
                  sx={{ 
                    color: '#666666',
                    fontSize: '14px'
                  }}
                >
                  Review the AI-generated configuration and export it in your preferred format
                </Typography>
              </Box>
              
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#F5F5F5',
                borderRadius: '8px',
                py: 1,
                px: 2
              }}>
                <Settings sx={{ fontSize: 18, color: '#666666' }} />
                <Typography sx={{ fontSize: '14px', color: '#666666' }}>
                  AI-Optimized Configuration
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 3 }}>
              {/* Main Content */}
              <Box sx={{ flex: 1 }}>
                {/* Format Selector */}
                <ToggleButtonGroup
                  exclusive
                  value="json"
                  sx={{ 
                    mb: 2,
                    '& .MuiToggleButton-root': {
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      mx: 0.5,
                      px: 2,
                      py: 1,
                      color: '#666666',
                      textTransform: 'none',
                      '&.Mui-selected': {
                        bgcolor: '#F5F5F5',
                        color: '#1A1A1A',
                        '&:hover': {
                          bgcolor: '#F5F5F5',
                        }
                      }
                    }
                  }}
                >
                  <ToggleButton value="json">
                    <Add sx={{ fontSize: 18, mr: 1 }} />
                    JSON
                  </ToggleButton>
                  <ToggleButton value="xml">
                    <Description sx={{ fontSize: 18, mr: 1 }} />
                    XML
                  </ToggleButton>
                  <ToggleButton value="yaml">
                    <Settings sx={{ fontSize: 18, mr: 1 }} />
                    YAML
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* Preview Area */}
                <Paper 
                  sx={{ 
                    bgcolor: '#F8FAFC',
                    borderRadius: '8px',
                    p: 3,
                    minHeight: '200px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    color: '#666666'
                  }}
                >
                  No configurations available
                </Paper>
              </Box>

              {/* AI Suggestions Panel */}
              <Box sx={{ width: '300px' }}>
                <Paper sx={{ 
                  bgcolor: 'white',
                  borderRadius: '8px',
                  mb: 3
                }}>
                  <Box sx={{ 
                    p: 2,
                    borderBottom: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Computer sx={{ fontSize: 20, color: '#666666' }} />
                    <Typography sx={{ 
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#1A1A1A'
                    }}>
                      AI Suggestions
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100px'
                  }}>
                    <CircularProgress size={24} sx={{ color: '#666666', mb: 2 }} />
                    <Typography sx={{ 
                      color: '#666666',
                      fontSize: '14px',
                      textAlign: 'center'
                    }}>
                      AI analyzing configuration...
                    </Typography>
                  </Box>
                </Paper>

                <Box sx={{ 
                  display: 'flex',
                  gap: 2,
                  mb: 3
                }}>
                  <Button
                    startIcon={<ContentCopy />}
                    variant="outlined"
                    fullWidth
                    sx={{
                      color: '#666666',
                      borderColor: '#E5E7EB',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#666666',
                        bgcolor: 'transparent'
                      }
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                  <Button
                    startIcon={<Download />}
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: '#666666',
                      color: 'white',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#4A4A4A'
                      }
                    }}
                  >
                    Export Configuration
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Next Steps Section */}
            <Paper sx={{ 
              mt: 3,
              p: 3,
              borderRadius: '8px'
            }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2
              }}>
                <Info sx={{ fontSize: 20, color: '#666666' }} />
                <Typography sx={{ 
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#1A1A1A'
                }}>
                  Next Steps
                </Typography>
              </Box>
              <Typography sx={{ 
                color: '#666666',
                fontSize: '14px',
                mb: 3,
                lineHeight: 1.5
              }}>
                This AI-generated configuration can be imported into your royalty management system to automate royalty calculations based on the contract terms. Refer to your system documentation for specific import instructions.
              </Typography>
              <Box sx={{ 
                display: 'flex',
                gap: 2
              }}>
                <Button
                  startIcon={<Computer />}
                  variant="outlined"
                  sx={{
                    color: '#666666',
                    borderColor: '#E5E7EB',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#666666',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  Import into royalty system
                </Button>
                <Button
                  startIcon={<Share />}
                  variant="outlined"
                  sx={{
                    color: '#666666',
                    borderColor: '#E5E7EB',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#666666',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  Share with legal team
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ContractAnalyst; 
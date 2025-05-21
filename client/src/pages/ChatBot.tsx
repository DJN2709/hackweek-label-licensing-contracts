import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Avatar,
  Paper,
} from '@mui/material';
import { 
  MusicNote,
  Add as AddIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  MoreHoriz as MoreHorizIcon,
  Lightbulb as LightbulbIcon,
  Mic as MicIcon,
  Send as SendIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

const SUGGESTED_PROMPTS = [
  {
    title: "Analyze new contract",
    description: "Upload or paste your contract for AI analysis"
  },
  {
    title: "Extract royalty terms",
    description: "Find and explain royalty-related clauses"
  },
  {
    title: "Compare contract versions",
    description: "See differences between contract versions"
  },
  {
    title: "Find similar clauses",
    description: "Search for similar clauses across contracts"
  }
];

const WELCOME_MESSAGE = `Hi! I'm RoyAI, your music licensing and royalty assistant. I'm here to help you analyze contracts, extract royalty terms, and answer any questions about music licensing.

I can help you with:
• Analyzing music contracts and agreements
• Extracting and explaining royalty terms
• Comparing different contract versions
• Finding similar clauses across contracts
• Understanding complex licensing terms

How can I assist you today?`;

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsStreaming(true);

    // Add welcome message if it's the first interaction
    if (!hasWelcomed) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGE,
      };
      setMessages(prev => [welcomeMessage, ...prev]);
      setHasWelcomed(true);
    }

    // Simulate streaming response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    // Here you would typically make an API call to your backend
    // For now, we'll simulate a streaming response
    const response = "I'll analyze that for you. Let me process your request...";
    let streamedContent = '';

    for (let i = 0; i < response.length; i++) {
      if (!isStreaming) break; // Stop if streaming is cancelled
      await new Promise(resolve => setTimeout(resolve, 50));
      streamedContent += response[i];
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: streamedContent }
          : msg
      ));
    }

    setIsLoading(false);
    setIsStreaming(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStopGeneration = () => {
    setIsStreaming(false);
    // Here you would typically cancel the API request
  };

  const handleNewChat = () => {
    setMessages([]);
    inputRef.current?.focus();
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#FAFAFA', minHeight: '100vh', p: 0 }}>
      <Box sx={{ 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'relative'
      }}>
        <Box 
          className="title-container"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            mb: messages.length > 0 ? 2 : 3,
            transition: 'margin 0.3s ease-in-out'
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

        {/* Messages Container */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {messages.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              flex: 1,
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
                display: 'grid',
                gridTemplateColumns: 'repeat(2, auto)',
                gap: 2,
                mt: 3,
                px: 2,
                width: '100%',
                maxWidth: '600px',
                justifyContent: 'center'
              }}>
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt.title}
                    onClick={() => handleSuggestedPrompt(prompt.title)}
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
                    {prompt.title}
                  </Button>
                ))}
              </Box>
            </Box>
          ) : (
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                mx: 'auto',
                maxWidth: '800px',
                width: '100%',
                overflow: 'hidden',
                opacity: messages.length > 0 ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
            >
              {/* Messages Header */}
              <Box sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'rgba(0, 0, 0, 0.02)'
              }}>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#4CAF50'
                }} />
                <Typography sx={{
                  fontSize: '13px',
                  color: '#666666',
                  fontWeight: 500
                }}>
                  RoyAI Active
                </Typography>
              </Box>

              {/* Messages Content */}
              <Box sx={{ 
                flex: 1,
                overflowY: 'auto',
                p: 3,
              }}>
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      mb: 4,
                      alignItems: 'flex-start',
                      px: 2
                    }}
                  >
                    {message.role === 'user' ? (
                      <Avatar sx={{ bgcolor: '#4F46E5' }}>U</Avatar>
                    ) : (
                      <Avatar sx={{ bgcolor: '#18181B' }}>AI</Avatar>
                    )}
                    <Box sx={{ 
                      flex: 1,
                      p: 2,
                      bgcolor: message.role === 'user' ? 'rgba(79, 70, 229, 0.03)' : 'transparent',
                      borderRadius: '12px',
                    }}>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          color: '#1A1A1A',
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {message.content}
                        {message.isStreaming && (
                          <Box
                            component="span"
                            sx={{
                              display: 'inline-block',
                              width: '6px',
                              height: '16px',
                              bgcolor: '#4F46E5',
                              ml: 1,
                              animation: 'blink 1s infinite'
                            }}
                          />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>
            </Paper>
          )}
        </Box>

        {/* Chat Input Container */}
        <Box
          sx={{
            position: messages.length > 0 ? 'sticky' : 'relative',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: '#FAFAFA',
            pt: 2,
            transition: 'all 0.3s ease-in-out',
            transform: messages.length > 0 ? 'translateY(0)' : 'translateY(-40vh)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            zIndex: 10
          }}
        >
          <Box sx={{ 
            width: '100%',
            maxWidth: messages.length > 0 ? '800px' : '600px',
            mx: 'auto',
            transition: 'max-width 0.3s ease-in-out'
          }}>
            <Paper
              elevation={2}
              sx={{ 
                width: '100%',
                bgcolor: 'white',
                borderRadius: '24px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out'
              }}
            >
              {/* Input field row */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 1.5,
                gap: 1
              }}>
                <IconButton 
                  onClick={handleNewChat}
                  sx={{ 
                    p: 1,
                    color: '#666666',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  <AddIcon sx={{ fontSize: 20 }} />
                </IconButton>
                
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
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
                
                {!isStreaming ? (
                  <>
                    <IconButton sx={{ 
                      p: 1,
                      color: '#666666',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                    }}>
                      <MicIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    
                    <IconButton 
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isLoading}
                      sx={{ 
                        p: 1,
                        bgcolor: inputValue.trim() ? '#1A1A1A' : '#E5E7EB',
                        color: 'white',
                        '&:hover': { bgcolor: inputValue.trim() ? '#000000' : '#E5E7EB' }
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        <SendIcon sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </>
                ) : (
                  <IconButton 
                    onClick={handleStopGeneration}
                    sx={{ 
                      p: 1,
                      bgcolor: '#1A1A1A',
                      color: 'white',
                      '&:hover': { bgcolor: '#000000' }
                    }}
                  >
                    <StopIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
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
            </Paper>

            {/* Suggestions Section - Only visible when no messages */}
            {messages.length === 0 && (
              <Box
                sx={{
                  mt: 4,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                  opacity: messages.length === 0 ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  transform: 'translateY(-20px)',
                }}
              >
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <Paper
                    key={prompt.title}
                    onClick={() => handleSuggestedPrompt(prompt.title)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      bgcolor: 'white',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: 'rgba(79, 70, 229, 0.03)',
                        borderColor: 'rgba(79, 70, 229, 0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#1A1A1A',
                        mb: 0.5
                      }}
                    >
                      {prompt.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#666666',
                      }}
                    >
                      {prompt.description}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBot; 
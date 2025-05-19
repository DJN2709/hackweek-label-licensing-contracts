import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  IconButton,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  CompareArrows as CompareIcon,
} from '@mui/icons-material';
import type { ContractClause, Annotation, ValidationResult } from '../types/contract';

interface ContractAnalysisProps {
  originalText: string;
  extractedClauses: ContractClause[];
  onAnnotate: (annotation: Annotation) => void;
  onValidate: () => ValidationResult[];
}

export const ContractAnalysis: React.FC<ContractAnalysisProps> = ({
  originalText,
  extractedClauses,
  onAnnotate,
  onValidate,
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [annotation, setAnnotation] = useState('');
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    }
  };

  const handleAnnotationSave = () => {
    if (selectedText && annotation) {
      onAnnotate({
        id: Math.random().toString(36).substr(2, 9),
        text: annotation,
        author: 'Current User',
        timestamp: new Date(),
        highlightRange: {
          start: 0, // Would need actual selection indices
          end: 0,
        },
      });
      setAnnotation('');
      setSelectedText('');
    }
  };

  const handleValidation = () => {
    const results = onValidate();
    setValidationResults(results);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<CompareIcon />}
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Hide Comparison' : 'Show Comparison'}
        </Button>
        <Button
          variant="contained"
          onClick={handleValidation}
        >
          Validate Contract
        </Button>
      </Box>

      {validationResults.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {validationResults.map((result, index) => (
            <Alert
              key={index}
              severity={result.severity}
              sx={{ mb: 1 }}
            >
              {result.message}
            </Alert>
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 300px)' }}>
        {/* Original Text Panel */}
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            p: 2,
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Original Contract
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box
            onMouseUp={handleTextSelection}
            sx={{
              whiteSpace: 'pre-wrap',
              '& .highlight': {
                backgroundColor: 'rgba(255, 255, 0, 0.3)',
              },
            }}
          >
            {originalText}
          </Box>
        </Paper>

        {/* Analysis Panel */}
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            p: 2,
            overflow: 'auto',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Extracted Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {extractedClauses.map((clause) => (
            <Box
              key={clause.id}
              sx={{
                mb: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" color="primary">
                  {clause.type}
                </Typography>
                <Chip
                  label={`${(clause.confidence * 100).toFixed(0)}% confidence`}
                  color={clause.confidence > 0.8 ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              <Typography variant="body2">{clause.text}</Typography>
              
              {clause.annotations.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {clause.annotations.map((ann) => (
                    <Chip
                      key={ann.id}
                      label={ann.text}
                      size="small"
                      sx={{ mr: 1, mt: 1 }}
                      onDelete={() => {/* Handle delete */}}
                    />
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Paper>
      </Box>

      {/* Annotation Input */}
      {selectedText && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Add Annotation for Selected Text:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            "{selectedText}"
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              fullWidth
              value={annotation}
              onChange={(e) => setAnnotation(e.target.value)}
              placeholder="Enter your annotation..."
            />
            <Button
              variant="contained"
              onClick={handleAnnotationSave}
              disabled={!annotation}
            >
              Save
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}; 
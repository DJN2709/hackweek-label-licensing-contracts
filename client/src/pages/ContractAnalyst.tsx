import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  CircularProgress,
  TextField,
  Chip,
  Card,
  CardContent,
  Grid,
  LinearProgress,
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
  Share,
  Upload as UploadIcon,
  Close as CloseIcon,
  Monitor as MonitorIcon,
  Language as LanguageIcon,
  AutoFixHigh as AutoFixHighIcon,
  Psychology as PsychologyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import * as pdfjsLib from 'pdfjs-dist';
import { keyframes } from '@mui/system';
import { Global } from '@emotion/react';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Animation keyframes
const scannerAnimation = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(var(--text-content-height));
  }
`;



const wordHighlight = keyframes`
  0% {
    background: transparent;
  }
  50% {
    background: rgba(79, 70, 229, 0.2);
  }
  100% {
    background: transparent;
  }
`;

const termHighlight = keyframes`
  0% {
    background: transparent;
  }
  20% {
    background: rgba(79, 70, 229, 0.3);
  }
  80% {
    background: rgba(79, 70, 229, 0.3);
  }
  100% {
    background: rgba(79, 70, 229, 0.1);
  }
`;

const termAppear = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const badgePulse = keyframes`
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
`;

const checkmarkDraw = keyframes`
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
`;

const categoryTransition = keyframes`
  0% {
    opacity: 0;
    transform: translateY(5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const cardHoverEffect = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: scale(1.01);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

// Update the term card animation
const termCardAppear = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Add this new animation after the other keyframes definitions
const pulseHighlight = keyframes`
  0% {
    background-color: rgba(79, 70, 229, 0);
  }
  25% {
    background-color: rgba(79, 70, 229, 0.4);
  }
  75% {
    background-color: rgba(79, 70, 229, 0.4);
  }
  100% {
    background-color: rgba(79, 70, 229, 0);
  }
`;

// Add types for term extraction
interface ExtractedTerm {
  id: string;
  text: string;
  category: string;
  confidence: number;
  position: {
    start: number;
    end: number;
  };
  isClicked?: boolean;
}

// Add interface for API response term
interface ApiTerm {
  text: string;
  category: string;
  confidence?: number;
}

interface Category {
  id: string;
  name: string;
  isActive: boolean;
  isComplete: boolean;
  color: string;
}

// Add new type for extraction process state
type ExtractionProcessState = 'idle' | 'scanning' | 'analyzing' | 'mapping' | 'complete';

// Add this function before the ContractAnalyst component
const extractTermsFromAPI = async (textContent: string) => {
  try {
    // Create JSON payload
    const payload = {
      "legal_contract": textContent
    };

    // Add timeout handling to avoid long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    // Send POST request with JSON data through our proxy endpoint
    const response = await fetch(
      "/api/legal_contract_analyzer",
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      }
    );

    // Clear the timeout
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling term extraction API:', error);
    
    // Generate mock data if the API is unavailable
    console.log('Falling back to mock data generation');
    return generateMockTermsData(textContent);
  }
};

// Generate mock extraction data based on the contract text
const generateMockTermsData = (contractText: string) => {
  // Extract potential royalty rates using regex
  const royaltyRateMatches = contractText.match(/(\d+(?:\.\d+)?%)|(\d+(?:\.\d+)? percent)/g) || [];
  const royaltyRates = royaltyRateMatches.map(rate => rate.replace(' percent', '%'));
  
  // Look for minimum guarantee
  const mgMatch = contractText.match(/minimum guarantee.*?(\$[\d,]+|[\d,]+ dollars)/i);
  const minimumGuarantee = mgMatch ? mgMatch[1] : "$10,000";
  
  // Look for advance
  const advanceMatch = contractText.match(/advance.*?(\$[\d,]+|[\d,]+ dollars)/i);
  const advance = advanceMatch ? advanceMatch[1] : "$5,000";
  
  // Look for payment terms
  const paymentDueMatch = contractText.match(/payment due.*?(\d+) days/i);
  const paymentDue = paymentDueMatch ? parseInt(paymentDueMatch[1]) : 30;

  // Construct mock response object
  return {
    rev_share_subscription_revenue: parseFloat(royaltyRates[0]?.replace('%', '') || "15"),
    rev_share_advertising_revenue: parseFloat(royaltyRates[1]?.replace('%', '') || "20"),
    minimum_guarantee: minimumGuarantee,
    advance: advance,
    per_user_fee_premium: [
      {
        market_name: "US Market",
        amount: "2.50",
        currency: "USD"
      }
    ],
    per_user_fee_student: [
      {
        market_name: "Education Sector",
        amount: "1.25",
        currency: "USD"
      }
    ],
    report_fields: [
      {
        field_name: "Total Streams",
        field_description: "Number of content streams"
      },
      {
        field_name: "Revenue Generated",
        field_description: "Total revenue generated from streams"
      },
      {
        field_name: "Payment Due",
        field_description: `Payment due within ${paymentDue} days`
      }
    ]
  };
}

// Add new keyframes for the futuristic scanner
const scannerGlow = keyframes`
  0% {
    box-shadow: 0 0 24px 8px rgba(99,102,241,0.18), 0 0 0 0 rgba(99,102,241,0.08);
    background-position: 0% 50%;
  }
  50% {
    box-shadow: 0 0 48px 16px rgba(99,102,241,0.28), 0 0 0 0 rgba(99,102,241,0.12);
    background-position: 100% 50%;
  }
  100% {
    box-shadow: 0 0 24px 8px rgba(99,102,241,0.18), 0 0 0 0 rgba(99,102,241,0.08);
    background-position: 0% 50%;
  }
`;

const dataStreamAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
`;

// Global shimmer keyframes for the scanner highlight
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`;

const ContractAnalyst = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [contractText, setContractText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [isExtractingTerms, setIsExtractingTerms] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractedTerms, setExtractedTerms] = useState<ExtractedTerm[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { 
      id: 'payable-currencies', 
      name: 'Payable Currencies', 
      isActive: false, 
      isComplete: false,
      color: '#4F46E5'
    },
    { 
      id: 'per-user-fee-premium', 
      name: 'Per User Fee Premium', 
      isActive: false, 
      isComplete: false,
      color: '#4F46E5'
    },
    { 
      id: 'per-user-fee-student', 
      name: 'Per User Fee Student', 
      isActive: false, 
      isComplete: false,
      color: '#4F46E5'
    },
    { 
      id: 'rev-share-ad', 
      name: 'Rev Share - ad revenue', 
      isActive: false, 
      isComplete: false,
      color: '#4F46E5'
    },
    { 
      id: 'rev-share-premium', 
      name: 'Rev Share - premium revenue', 
      isActive: false, 
      isComplete: false,
      color: '#4F46E5'
    },
    { 
      id: 'minimum-guaranteed', 
      name: 'Minimum Guaranteed', 
      isActive: false, 
      isComplete: false,
      color: '#4F46E5'
    },
    { 
      id: 'advances', 
      name: 'Advances', 
      isActive: false, 
      isComplete: false,
      color: '#4F46E5'
    },
    { 
      id: 'reporting', 
      name: 'Reporting', 
      isActive: false, 
      isComplete: false,
      color: '#4F46E5'
    }
  ]);
  const [currentScanPosition, setCurrentScanPosition] = useState(0);
  const [isExtractionComplete, setIsExtractionComplete] = useState(false);
  const contractTextRef = useRef<HTMLDivElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [scannerPaused, setScannerPaused] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<string>('');
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [highlightedTerms, setHighlightedTerms] = useState<ExtractedTerm[]>([]);
  const [discoveredTerms, setDiscoveredTerms] = useState<string[]>([]);
  const [randomWords, setRandomWords] = useState<number[]>([]);
  const [previousTab, setPreviousTab] = useState<number>(0);
  const [shouldStartExtraction, setShouldStartExtraction] = useState(false);
  const [hasTabSwitched, setHasTabSwitched] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [extractionProcessState, setExtractionProcessState] = useState<ExtractionProcessState>('idle');

  // Add a ref to track the actual text height
  const textContentHeightRef = useRef<number>(0);

  // Add scanner start time ref
  const scannerStartTimeRef = useRef<number>(Date.now());

  // At the top of the component, after hooks
  const LINE_HEIGHT = 24; // px, should match the CSS line-height of the text

  // ... inside ContractAnalyst ...
  const [scanLineIndex, setScanLineIndex] = useState(0);
  const [numLines, setNumLines] = useState(0);

  // Calculate number of lines in contractText
  useEffect(() => {
    if (!contractText) {
      setNumLines(0);
      return;
    }
    // Count lines by splitting on newlines
    const lines = contractText.split('\n');
    setNumLines(lines.length);
  }, [contractText]);

  // Scanning animation: move the highlight bar line by line
  useEffect(() => {
    if (!isExtractingTerms || !contractTextRef.current || shouldReduceMotion) return;
    setScanLineIndex(0);
    if (numLines === 0) return;

    let currentLine = 0;
    const totalLines = numLines;
    const interval = 40; // ms per line
    const textContainer = contractTextRef.current;

    const animate = () => {
      setScanLineIndex(currentLine);
      // Scroll if needed
      const barTop = currentLine * LINE_HEIGHT;
      const barBottom = barTop + LINE_HEIGHT;
      const scrollTop = textContainer.scrollTop;
      const containerHeight = textContainer.clientHeight;
      if (barTop < scrollTop) {
        textContainer.scrollTo({ top: barTop, behavior: 'smooth' });
      } else if (barBottom > scrollTop + containerHeight) {
        textContainer.scrollTo({ top: barBottom - containerHeight, behavior: 'smooth' });
      }
      currentLine++;
      if (currentLine < totalLines) {
        setTimeout(animate, interval);
      } else {
        // End of scan
        setTimeout(() => setIsExtractingTerms(false), 300);
      }
    };
    animate();
    // Cleanup
    return () => {};
  }, [isExtractingTerms, contractText, numLines, shouldReduceMotion]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle tab changes
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setPreviousTab(selectedTab);
    setSelectedTab(newValue);
    if (newValue === 1) {
      // Set a flag when we switch to the Term Extraction tab
      setHasTabSwitched(true);
    } else {
      setHasTabSwitched(false);
    }
  };

  // Function to start term extraction process
  const startTermExtraction = () => {
    // First, switch tabs immediately
    setSelectedTab(1);
    
    // Initialize the extraction UI state immediately
    setIsExtractingTerms(true);
    setExtractionProgress(0);
    setHighlightedTerms([]);
    setCurrentCategory(null);
    setExtractionStatus('Initializing term extraction...');
    setIsExtractionComplete(false);
    setDiscoveredTerms([]);
    setScannerPaused(false);
    setCurrentScanPosition(0);
    
    // Reset categories
    setCategories(cats => cats.map(cat => ({
      ...cat,
      isActive: false,
      isComplete: false
    })));
    
    // Set the flag to start extraction process after the UI updates
    setTimeout(() => {
      scannerStartTimeRef.current = Date.now();
      setShouldStartExtraction(true);
    }, 100);
  };

  // Function to restart term extraction
  const restartTermExtraction = () => {
    setShouldStartExtraction(true);
  };

  // Optimize the highlightTermsForCategory function
  const highlightTermsForCategory = (category: string) => {
    if (!contractText || !category) return;

    const patterns: Record<string, RegExp[]> = {
      'payable-currencies': [/(\d+(?:\.\d+)?%)/g, /payable currency/gi],
      'per-user-fee-premium': [/premium fee/gi, /per user/gi, /per unit/gi],
      'per-user-fee-student': [/student fee/gi, /per user/gi, /per unit/gi],
      'rev-share-ad': [/ad revenue/gi, /share/gi, /per unit/gi],
      'rev-share-premium': [/premium revenue/gi, /share/gi, /per unit/gi],
      'minimum-guaranteed': [/minimum guarantee/gi, /per quarter/gi, /per unit/gi],
      'advances': [/advance/gi, /per quarter/gi, /per unit/gi],
      'reporting': [/report/gi, /statement/gi, /accounting period/gi]
    };

    const categoryPatterns = patterns[category as keyof typeof patterns];
    if (!categoryPatterns) return;

    // Process all patterns at once for better performance
    const newTerms: ExtractedTerm[] = [];
    const allMatches = new Set(); // Track unique matches

    categoryPatterns.forEach((pattern: RegExp) => {
      const matches = Array.from(contractText.matchAll(new RegExp(pattern.source, pattern.flags)));
      matches.forEach(match => {
        const matchText = match[0];
        const matchStart = match.index || 0;
        
        // Avoid duplicate matches
        const matchKey = `${matchText}-${matchStart}`;
        if (!allMatches.has(matchKey)) {
          allMatches.add(matchKey);
          newTerms.push({
            id: Math.random().toString(36).substr(2, 9),
            text: matchText,
            category,
            confidence: 0.85 + Math.random() * 0.1,
            position: {
              start: matchStart,
              end: matchStart + matchText.length
            }
          });
        }
      });
    });

    // Batch update the highlighted terms
    if (newTerms.length > 0) {
      setHighlightedTerms(prev => [...prev, ...newTerms]);
    }
  };

  // Function to calculate animation duration based on text height
  const calculateScanDuration = (textHeight: number) => {
    // Aim for consistent pixels per second scanning speed
    const pixelsPerSecond = 150; // Scan 150 pixels per second
    const baseDuration = Math.max(textHeight / pixelsPerSecond, 3); // Minimum 3 seconds
    return baseDuration;
  };

  // Optimize generateRandomWordHighlights with useCallback
  const generateRandomWordHighlights = useCallback(() => {
    if (!contractText) return [];
    
    // Process in chunks to avoid freezing
    const chunkSize = 1000;
    const words = contractText.split(/\s+/);
    const highlights: number[] = [];
    
    // Only process a maximum of 100 highlights regardless of text size
    const numHighlights = Math.min(Math.floor(words.length * 0.1), 100);
    
    for (let i = 0; i < numHighlights; i++) {
      highlights.push(Math.floor(Math.random() * words.length));
    }
    
    return highlights;
  }, [contractText]);

  // Function to parse PDF file
  const parsePDF = async (file: File): Promise<string> => {
    setIsParsing(true);
    setParsingProgress(0);
    
    try {
      // Read the file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      let fullText = '';
      
      // Process each page
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
        
        // Update progress (90% max, leave 10% for final processing)
        const progress = (i / totalPages) * 90;
        setParsingProgress(progress);
      }
      
      // Final processing
      setParsingProgress(100);
      setIsParsing(false);
      return fullText.trim();
      
    } catch (error) {
      console.error('Error parsing PDF:', error);
      setIsParsing(false);
      setParsingProgress(0);
      throw new Error('Failed to parse PDF file');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      try {
        const text = await parsePDF(file);
        setContractText(text);
      } catch (error) {
        // Handle error (you might want to show an error message to the user)
        setUploadedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setIsAnalyzing(false);
    setProgress(0);
    setIsAnalysisComplete(false);
    setContractText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContractTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContractText(e.target.value);
    setIsAnalyzing(false);
    setProgress(0);
    setIsAnalysisComplete(false);
  };

  const handleAnalyzeContract = () => {
    if (!hasContent) return;
    
    // If we're still parsing, don't start analysis
    if (isParsing) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    setIsAnalysisComplete(false);

    // Simulate progress updates
    const duration = 5000; // 5 seconds total
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
        setIsAnalyzing(false);
        setIsAnalysisComplete(true);
      }
    }, interval);
  };

  const handleInsertDummyText = () => {
    const dummyText = `ROYALTY AGREEMENT

This Royalty Agreement (the "Agreement") is entered into as of May 19, 2025, by and between Content Owner LLC ("Licensor") and Distribution Company Inc. ("Licensee").

1. ROYALTY CALCULATION:
   a. Base Royalty Rate: Licensee shall pay Licensor a royalty of 15% of Net Revenue for all sales.
   b. Tier Structure: 
      i. For annual revenue up to $500,000: 15% royalty rate
      ii. For annual revenue between $500,001 and $1,000,000: 17.5% royalty rate
      iii. For annual revenue exceeding $1,000,000: 20% royalty rate
   c. Minimum Guarantee: $10,000 per quarter, recoupable against earned royalties.

2. REPORTING AND PAYMENT:
   a. Accounting Period: Calendar quarterly basis.
   b. Payment Due: Within 30 days after the end of each Accounting Period.
   c. Statements: Licensee shall provide detailed sales statements with each payment.

3. AUDIT RIGHTS:
   Licensor shall have the right to audit Licensee's books and records upon 14 days written notice, limited to once per calendar year.`;
    
    setContractText(dummyText);
  };

  const hasContent = uploadedFile !== null || contractText.trim() !== '';

  // Update the progress display to show parsing progress when applicable
  const displayProgress = isParsing ? parsingProgress : progress;
  const progressMessage = isParsing ? 'Parsing PDF...' : 'Analysis in Progress';

  // Function to get confidence level styling
  const getConfidenceInfo = (confidence: number) => {
    if (confidence >= 90) {
      return {
        color: '#22C55E', // Green
        icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
        label: 'High confidence',
        ariaLabel: `High confidence: ${Math.round(confidence)}%`
      };
    }
    if (confidence >= 75) {
      return {
        color: '#F59E0B', // Amber
        icon: <WarningIcon sx={{ fontSize: 16 }} />,
        label: 'Medium confidence',
        ariaLabel: `Medium confidence: ${Math.round(confidence)}%`
      };
    }
    return {
      color: '#EF4444', // Red
      icon: <ErrorIcon sx={{ fontSize: 16 }} />,
      label: 'Low confidence',
      ariaLabel: `Low confidence: ${Math.round(confidence)}%`
    };
  };

  // Add scroll synchronization function
  const scrollToTerm = (position: { start: number; end: number }) => {
    if (contractTextRef.current) {
      const text = contractTextRef.current.textContent || '';
      const lineHeight = 24; // Approximate line height in pixels
      const charsPerLine = 80; // Approximate characters per line
      const lineNumber = Math.floor(position.start / charsPerLine);
      const scrollPosition = Math.max(0, (lineNumber * lineHeight) - 100); // 100px padding from top
      
      // Scroll to position with smooth animation
      contractTextRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });

      // Set the clicked term to trigger highlight animation
      setHighlightedTerms(prev => prev.map(term => ({
        ...term,
        isClicked: term.position.start === position.start && term.position.end === position.end
      })));

      // Reset the highlight after animation
      setTimeout(() => {
        setHighlightedTerms(prev => prev.map(term => ({
          ...term,
          isClicked: false
        })));
      }, 2000); // Match this with the animation duration
    }
  };

  // Add toggle function for categories
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Modify the useEffect that handles term extraction
  useEffect(() => {
    if (!shouldStartExtraction || !contractText || selectedTab !== 1) {
      return;
    }

    // Reset the flag immediately to prevent multiple executions
    setShouldStartExtraction(false);

    // Start with scanning process
    setExtractionProcessState('scanning');
    setIsExtractingTerms(true);
    scannerStartTimeRef.current = Date.now();
    
    // Set initial random highlights
    setRandomWords(generateRandomWordHighlights());

    // Fixed scan time regardless of text length
    const SCAN_TIME = 3000; // 3 seconds fixed

    const processTerms = async () => {
      try {
        // Wait for scanning animation to complete
        await new Promise(resolve => setTimeout(resolve, SCAN_TIME));
        setIsExtractingTerms(false);
        
        // Start analyzing process
        setExtractionProcessState('analyzing');
        
        // Call the API
        const apiResponse = await extractTermsFromAPI(contractText);

        // Start mapping process
        setExtractionProcessState('mapping');
        
        // Process API response more efficiently
        const newTerms: ExtractedTerm[] = [];
        
        // Process in chunks to avoid freezing
        const processChunk = (startIdx: number) => {
          return new Promise<void>(resolve => {
            setTimeout(() => {
              // Process a chunk of terms
              const chunk: ApiTerm[] = apiResponse.terms?.slice(startIdx, startIdx + 10) || [];
              chunk.forEach(term => {
                if (term.text && term.category) {
                  const textIndex = contractText.indexOf(term.text);
                  if (textIndex >= 0) {
                    newTerms.push({
                      id: Math.random().toString(36).substr(2, 9),
                      text: term.text,
                      category: term.category,
                      confidence: term.confidence || 0.85,
                      position: {
                        start: textIndex,
                        end: textIndex + term.text.length
                      }
                    });
                  }
                }
              });
              resolve();
            }, 0);
          });
        };

        // Process terms in chunks
        const chunkSize = 10;
        const terms = apiResponse.terms || [];
        for (let i = 0; i < terms.length; i += chunkSize) {
          await processChunk(i);
        }

        // Simulate mapping process time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Complete the process
        setExtractionProcessState('complete');
        setHighlightedTerms(newTerms);
        setIsExtractionComplete(true);
        setCurrentCategory(null);
        setScannerPaused(false);
        setCategories(cats => cats.map(cat => ({
          ...cat,
          isActive: false,
          isComplete: true
        })));

      } catch (error) {
        console.error('Error during term extraction:', error);
        setExtractionStatus('Using local term extraction');
        setIsExtractingTerms(false);
        setIsExtractionComplete(true);
      }
    };

    // Start processing immediately
    processTerms();

  }, [shouldStartExtraction, contractText, selectedTab, generateRandomWordHighlights]);

  // Optimize scanner position update with better animation
  const handleScannerPositionUpdate = useCallback(() => {
    if (!isExtractingTerms || !contractTextRef.current || shouldReduceMotion) return;
    
    const textContainer = contractTextRef.current;
    const textHeight = textContentHeightRef.current || 0;
    const containerHeight = textContainer.clientHeight;
    
    // Use requestAnimationFrame for smoother animation
    let animationFrameId: number;
    const startTime = Date.now();
    const duration = 3000; // Fixed 3 second duration
    
    const updatePosition = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Update scan position
      const scanPos = Math.floor(progress * textHeight);
      setCurrentScanPosition(scanPos);
      
      // Auto-scroll with smooth behavior
      const scrollPosition = (progress * textHeight) - (containerHeight / 2);
      if (scrollPosition > 0) {
        textContainer.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
      
      // Continue animation if not complete
      if (progress < 1 && isExtractingTerms && !scannerPaused) {
        animationFrameId = requestAnimationFrame(updatePosition);
      } else if (progress >= 1) {
        // Ensure we reset when done
        setIsExtractingTerms(false);
      }
    };
    
    animationFrameId = requestAnimationFrame(updatePosition);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isExtractingTerms, scannerPaused, shouldReduceMotion]);

  // Start the scanner when extraction begins
  useEffect(() => {
    if (isExtractingTerms && !scannerPaused) {
      scannerStartTimeRef.current = Date.now();
      handleScannerPositionUpdate();
    }
  }, [isExtractingTerms, scannerPaused, handleScannerPositionUpdate]);

  // Optimize the text rendering to avoid processing every character
  const renderText = useMemo(() => {
    if (!contractText) return null;

    // Split text into chunks for more efficient rendering
    const chunkSize = 500;
    const chunks: JSX.Element[] = [];
    
    for (let i = 0; i < contractText.length; i += chunkSize) {
      const chunk = contractText.slice(i, i + chunkSize);
      const terms = highlightedTerms.filter(term => 
        term.position.start >= i && term.position.start < (i + chunkSize)
      );
      
      chunks.push(
        <span key={i}>
          {chunk.split('').map((char, index) => {
            const absoluteIndex = i + index;
            const term = terms.find(
              t => absoluteIndex >= t.position.start && absoluteIndex < t.position.end
            );
            
            if (term) {
              const category = categories.find(c => c.id === term.category);
              return (
                <span
                  key={absoluteIndex}
                  style={{
                    backgroundColor: term.isClicked 
                      ? '#4F46E5'
                      : category 
                        ? `${category.color}1A`
                        : 'transparent',
                    color: term.isClicked ? 'white' : 'inherit'
                  }}
                >
                  {char}
                </span>
              );
            }
            
            return char;
          })}
        </span>
      );
    }
    
    return chunks;
  }, [contractText, highlightedTerms, categories]);

  // Add function to get process message
  const getProcessMessage = () => {
    switch (extractionProcessState) {
      case 'scanning':
        return 'Scanning Contract';
      case 'analyzing':
        return 'Analyzing Legal Language';
      case 'mapping':
        return 'Mapping terms to parameters';
      default:
        return '';
    }
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
                  overflow: 'hidden',
                  height: '100%'
                }}>
                  <Box sx={{ 
                    p: 2,
                    borderBottom: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ color: '#666666' }}
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <line x1="10" y1="9" x2="8" y2="9" />
                      </svg>
                      <Typography sx={{ 
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#1A1A1A'
                      }}>
                        Contract Text
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small"
                      onClick={handleInsertDummyText}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(79, 70, 229, 0.04)',
                          '& .MuiSvgIcon-root': {
                            color: '#4F46E5'
                          }
                        }
                      }}
                    >
                      <AutoFixHighIcon sx={{ fontSize: 20, color: '#666666' }} />
                    </IconButton>
                  </Box>
                  <Box sx={{ 
                    p: 3,
                    minHeight: '500px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <input
                      type="file"
                      accept=".pdf"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                    />
                    {uploadedFile ? (
                      <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        p: 4,
                        bgcolor: '#F5F5F5',
                        borderRadius: '8px',
                        border: '1px dashed #E5E7EB'
                      }}>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="48" 
                          height="48" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          style={{ color: '#666666' }}
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <line x1="10" y1="9" x2="8" y2="9" />
                        </svg>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ 
                            fontSize: '16px',
                            color: '#1A1A1A',
                            fontWeight: 500,
                            mb: 0.5
                          }}>
                            {uploadedFile.name}
                          </Typography>
                          <Typography sx={{ 
                            fontSize: '14px',
                            color: '#666666'
                          }}>
                            PDF Document
                          </Typography>
                        </Box>
                        <Button
                          startIcon={<CloseIcon />}
                          onClick={handleRemoveFile}
                          variant="outlined"
                          sx={{
                            mt: 2,
                            color: '#666666',
                            borderColor: '#E5E7EB',
                            textTransform: 'none',
                            '&:hover': {
                              borderColor: '#666666',
                              bgcolor: 'transparent'
                            }
                          }}
                        >
                          Remove Document
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <TextField
                          multiline
                          fullWidth
                          minRows={10}
                          maxRows={20}
                          value={contractText}
                          onChange={handleContractTextChange}
                          placeholder="Paste your contract text here or upload a document..."
                          sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                border: 'none',
                              },
                              '&:hover fieldset': {
                                border: 'none',
                              },
                              '&.Mui-focused fieldset': {
                                border: 'none',
                              },
                            },
                            '& .MuiInputBase-input': {
                              fontSize: '14px',
                              color: '#1A1A1A',
                            },
                          }}
                        />
                        <Box sx={{
                          mt: 3,
                          pt: 3,
                          borderTop: '1px solid #E5E7EB',
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          <Button
                            startIcon={<UploadIcon />}
                            onClick={() => fileInputRef.current?.click()}
                            variant="outlined"
                            sx={{
                              color: '#4F46E5',
                              borderColor: '#4F46E5',
                              textTransform: 'none',
                              px: 4,
                              py: 1,
                              '&:hover': {
                                borderColor: '#4338CA',
                                bgcolor: 'rgba(79, 70, 229, 0.04)'
                              }
                            }}
                          >
                            Upload PDF Document
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                </Paper>
              </Box>

              {/* Right Column - AI Processing */}
              <Box sx={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
                <Paper sx={{ 
                  bgcolor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
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
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: hasContent ? 'space-between' : 'center',
                    textAlign: 'center'
                  }}>
                    {!hasContent ? (
                      <>
                        <Typography sx={{ 
                          color: '#666666',
                          fontSize: '14px',
                          mb: 2
                        }}>
                          Enter or upload your contract so RoyAI can start analyzing it
                        </Typography>
                        <Button
                          variant="contained"
                          disabled
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
                      </>
                    ) : (
                      <>
                        {/* AI Analysis Visualization */}
                        <Box sx={{ 
                          flex: 1,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                          minHeight: '200px'
                        }}>
                          {isAnalyzing || isAnalysisComplete ? (
                            <>
                              <Box sx={{
                                position: 'relative',
                                width: 120,
                                height: 120,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {/* Outer progress circle */}
                                <Box sx={{
                                  position: 'absolute',
                                  width: '100%',
                                  height: '100%',
                                }}>
                                  {/* Background circle */}
                                  <CircularProgress
                                    variant="determinate"
                                    value={100}
                                    size={120}
                                    thickness={2}
                                    sx={{
                                      color: 'rgba(79, 70, 229, 0.1)',
                                    }}
                                  />
                                  {/* Progress circle */}
                                  <CircularProgress
                                    variant="determinate"
                                    value={displayProgress}
                                    size={120}
                                    thickness={2}
                                    sx={{
                                      position: 'absolute',
                                      left: 0,
                                      color: '#4F46E5',
                                      transform: 'rotate(-90deg)',
                                      circle: {
                                        strokeLinecap: 'round',
                                        transformOrigin: 'center',
                                        transform: 'rotate(0deg)',
                                        transition: 'stroke-dashoffset 0.3s ease',
                                        strokeDasharray: '339.292',
                                        strokeDashoffset: `${(1 - displayProgress / 100) * 339.292}px`,
                                      }
                                    }}
                                  />
                                </Box>

                                {/* Center content */}
                                <Box sx={{
                                  position: 'absolute',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexDirection: 'column',
                                  width: '100%',
                                  height: '100%'
                                }}>
                                  <Typography sx={{
                                    fontSize: '24px',
                                    fontWeight: 500,
                                    color: '#4F46E5',
                                    userSelect: 'none'
                                  }}>
                                    {Math.round(displayProgress)}%
                                  </Typography>
                                </Box>

                                {/* Blinking dots */}
                                {[...Array(8)].map((_, i) => {
                                  const angle = (i * 45) + 90;
                                  return (
                                    <Box
                                      key={i}
                                      sx={{
                                        position: 'absolute',
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        bgcolor: '#4F46E5',
                                        top: '50%',
                                        left: '50%',
                                        transform: `rotate(${angle}deg) translateY(-55px)`,
                                        animation: 'blink 1s ease-in-out infinite',
                                        animationDelay: `${i * 0.1}s`,
                                        opacity: displayProgress > (i * 12.5) ? 1 : 0.2,
                                        transition: 'opacity 0.3s ease-in-out',
                                      }}
                                    />
                                  );
                                })}
                              </Box>
                              <Typography sx={{
                                fontSize: '14px',
                                color: '#1A1A1A',
                                fontWeight: 500,
                                mt: 3,
                                mb: 1
                              }}>
                                {progressMessage}
                              </Typography>
                              <Typography sx={{
                                fontSize: '12px',
                                color: '#666666',
                                maxWidth: '200px',
                                lineHeight: 1.5
                              }}>
                                {isParsing 
                                  ? 'Converting PDF document to text'
                                  : 'RoyAI is processing your contract using advanced natural language understanding'
                                }
                              </Typography>
                            </>
                          ) : (
                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 2,
                              textAlign: 'center'
                            }}>
                              <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '12px',
                                bgcolor: 'rgba(79, 70, 229, 0.04)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                              }}>
                                <Box sx={{
                                  position: 'absolute',
                                  width: '100%',
                                  height: '100%',
                                  background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.08) 0%, rgba(79, 70, 229, 0.02) 70%)',
                                }} />
                                <PsychologyIcon 
                                  sx={{ 
                                    fontSize: 44, 
                                    color: '#4F46E5',
                                    filter: 'drop-shadow(0px 2px 4px rgba(79, 70, 229, 0.2))'
                                  }} 
                                />
                              </Box>
                              <Box>
                                <Typography sx={{
                                  fontSize: '16px',
                                  color: '#1A1A1A',
                                  fontWeight: 500,
                                  mb: 1
                                }}>
                                  Contract Ready for Analysis
                                </Typography>
                                <Typography sx={{
                                  fontSize: '14px',
                                  color: '#666666',
                                  maxWidth: '280px',
                                  lineHeight: 1.5
                                }}>
                                  Click the button below to start RoyAI's advanced contract analysis
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>

                        {/* Model Info - Moved to bottom */}
                        <Box sx={{ 
                          width: '100%',
                          borderTop: '1px solid #E5E7EB',
                          pt: 3,
                          mb: 3
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2
                          }}>
                            <MonitorIcon sx={{ fontSize: 20, color: '#666666' }} />
                            <Box>
                              <Typography sx={{
                                fontSize: '12px',
                                color: '#666666',
                                mb: 0.5
                              }}>
                                AI Model:
                              </Typography>
                              <Typography sx={{
                                fontSize: '14px',
                                color: '#1A1A1A',
                                fontWeight: 500
                              }}>
                                RoyAI v0.1
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                          }}>
                            <LanguageIcon sx={{ fontSize: 20, color: '#666666' }} />
                            <Box>
                              <Typography sx={{
                                fontSize: '12px',
                                color: '#666666',
                                mb: 0.5
                              }}>
                                Language Detection:
                              </Typography>
                              <Typography sx={{
                                fontSize: '14px',
                                color: '#1A1A1A',
                                fontWeight: 500
                              }}>
                                Legal English
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          onClick={isAnalysisComplete ? startTermExtraction : handleAnalyzeContract}
                          disabled={isAnalyzing || isParsing || !hasContent}
                          sx={{
                            bgcolor: '#18181B',
                            color: 'white',
                            textTransform: 'none',
                            borderRadius: '8px',
                            py: 1.5,
                            '&:hover': {
                              bgcolor: '#27272A'
                            },
                            '&.Mui-disabled': {
                              bgcolor: '#E5E7EB',
                              color: '#666666'
                            }
                          }}
                        >
                          {isParsing 
                            ? 'Parsing PDF...'
                            : isAnalyzing 
                              ? 'Analysis in Progress...' 
                              : isAnalysisComplete 
                                ? 'Start Term Extraction' 
                                : 'Analyze Contract'
                          }
                        </Button>
                      </>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        )}

        {/* Term Extraction Tab Content */}
        {selectedTab === 1 && (
          <Box>
            <Typography sx={{ 
              color: '#666666',
              fontSize: '14px',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              AI-powered extraction of royalty terms from your contract
            </Typography>

            {!contractText ? (
              // Empty state view
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                mt: 4
              }}>
                <Paper sx={{ 
                  bgcolor: 'white',
                  borderRadius: '8px',
                  p: 4,
                  width: '100%',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ 
                    color: '#1A1A1A',
                    fontSize: '16px',
                    mb: 2
                  }}>
                    No terms have been extracted yet. Click "Extract Terms" to analyze the contract.
                  </Typography>
                </Paper>

                <Box sx={{ 
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'space-between',
                  width: '100%'
                }}>
                  <Button
                    startIcon={<Refresh />}
                    variant="outlined"
                    disabled
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
                    disabled
                    sx={{
                      bgcolor: '#666666',
                      color: 'white',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#4A4A4A'
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#E5E7EB',
                        color: '#666666'
                      }
                    }}
                  >
                    Continue to Configuration
                  </Button>
                </Box>
              </Box>
            ) : (
              // Existing view with contract text and extraction UI
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3,
                  height: '600px' // Fixed height container
                }}>
                  {/* Contract Text Panel */}
                  <Box sx={{ 
                    flex: 1,
                    height: '100%' // Take full height of container
                  }}>
                    <Paper sx={{ 
                      bgcolor: 'white',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Box sx={{ 
                        p: 2,
                        borderBottom: '1px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          style={{ color: '#666666' }}
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <line x1="10" y1="9" x2="8" y2="9" />
                        </svg>
                        <Typography sx={{ 
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#1A1A1A'
                        }}>
                          Contract Text
                        </Typography>
                      </Box>
                      
                      <Box 
                        ref={contractTextRef}
                        sx={{ 
                          position: 'relative',
                          flex: 1,
                          p: 3,
                          overflowY: 'auto',
                          fontSize: '14px',
                          lineHeight: 1.6,
                          color: '#1A1A1A',
                          '&::-webkit-scrollbar': {
                            width: '8px',
                          },
                          '&::-webkit-scrollbar-track': {
                            backgroundColor: '#F1F1F1',
                            borderRadius: '4px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#C1C1C1',
                            borderRadius: '4px',
                            '&:hover': {
                              backgroundColor: '#A1A1A1',
                            },
                          },
                        }}
                      >
                        {renderText}
                        {/* Scanner line animation */}
                        {isExtractingTerms && !shouldReduceMotion && (
                          <>
                            <Global styles={shimmerKeyframes} />
                            <Box
                              role="progressbar"
                              aria-label="Scanning contract text"
                              aria-valuenow={scanLineIndex}
                              aria-valuemin={0}
                              aria-valuemax={numLines}
                              sx={{
                                position: 'absolute',
                                top: `${scanLineIndex * LINE_HEIGHT}px`,
                                left: 0,
                                right: 0,
                                height: `${LINE_HEIGHT}px`,
                                borderRadius: '8px',
                                background: 'linear-gradient(90deg, rgba(99,102,241,0.10) 0%, rgba(99,102,241,0.25) 50%, rgba(99,102,241,0.10) 100%)',
                                boxShadow: '0 0 32px 8px rgba(99,102,241,0.18)',
                                animation: `${scannerGlow} 1.5s infinite ease-in-out`,
                                zIndex: 20,
                                pointerEvents: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                mixBlendMode: 'lighten',
                              }}
                            >
                              <Box
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.18) 60%, transparent 100%)',
                                  backgroundSize: '200% 100%',
                                  animation: 'shimmer 2s linear infinite',
                                }}
                              />
                            </Box>
                            <Box
                              sx={{
                                position: 'absolute',
                                top: `${scanLineIndex * LINE_HEIGHT}px`,
                                left: 0,
                                right: 0,
                                height: `${LINE_HEIGHT}px`,
                                pointerEvents: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                pr: 2,
                                zIndex: 21
                              }}
                            >
                              <Box sx={{
                                fontSize: '13px',
                                fontFamily: 'monospace',
                                color: '#4F46E5',
                                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                boxShadow: '0 2px 4px rgba(79, 70, 229, 0.12)',
                              }}>
                                <Box component="span" sx={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  bgcolor: '#4F46E5',
                                  animation: `${scannerGlow} 1.5s infinite ease-in-out`,
                                }} />
                                scanning
                              </Box>
                            </Box>
                            {/* Data streaming effect can be left for extra flair, but keep it subtle */}
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Box
                                key={i}
                                sx={{
                                  position: 'absolute',
                                  top: `${currentScanPosition + (i * 6) - 12}px`,
                                  left: `${15 + (i * 10)}%`,
                                  width: '2px',
                                  height: '32px',
                                  bgcolor: '#6366f1',
                                  opacity: 0.18,
                                  animation: `${dataStreamAnimation} ${1 + (i * 0.2)}s infinite`,
                                  animationDelay: `${i * 0.13}s`,
                                  pointerEvents: 'none',
                                  zIndex: 19
                                }}
                              />
                            ))}
                          </>
                        )}
                      </Box>
                    </Paper>
                  </Box>

                  {/* Categories and Progress Panel */}
                  <Box sx={{
                    width: '600px',
                    height: '100%'
                  }}>
                    <Paper 
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        height: '100%',
                        bgcolor: 'white',
                        borderRadius: '8px'
                      }}
                    >
                      <Box sx={{ 
                        p: 2,
                        borderBottom: '1px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <AutoFixHighIcon sx={{ fontSize: 20, color: '#4F46E5' }} />
                        <Typography sx={{ 
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#1A1A1A'
                        }}>
                          {extractionProcessState === 'complete' ? 'AI-Identified Terms' : 'Term Extraction Progress'}
                        </Typography>
                      </Box>

                      <Box 
                        sx={{ 
                          flex: 1,
                          p: 2,
                          overflowY: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 3
                        }}
                      >
                        {extractionProcessState !== 'complete' ? (
                          <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: 3
                          }}>
                            <CircularProgress size={48} sx={{ color: '#4F46E5' }} />
                            <Typography sx={{
                              fontSize: '16px',
                              fontWeight: 500,
                              color: '#1A1A1A',
                              textAlign: 'center'
                            }}>
                              {getProcessMessage()}
                            </Typography>
                          </Box>
                        ) : (
                          categories.map(category => {
                            const categoryTerms = highlightedTerms.filter(term => term.category === category.id);
                            if (categoryTerms.length === 0) return null;
                            
                            const isExpanded = expandedCategories.has(category.id);

                            return (
                              <Paper
                                key={category.id}
                                sx={{
                                  p: 2,
                                  borderRadius: '12px',
                                  border: '1px solid #E5E7EB',
                                  bgcolor: 'white',
                                  animation: `${termCardAppear} 0.3s ease-out`,
                                }}
                                role="listitem"
                              >
                                <Box 
                                  onClick={() => toggleCategory(category.id)}
                                  sx={{ 
                                    cursor: 'pointer',
                                    '&:hover': {
                                      '& .expand-icon': {
                                        bgcolor: '#F3F4F6'
                                      }
                                    }
                                  }}
                                >
                                  <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: isExpanded ? 2 : 0
                                  }}>
                                    <Box sx={{ 
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      flex: 1
                                    }}>
                                      <Box sx={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                      }}>
                                        <svg 
                                          xmlns="http://www.w3.org/2000/svg" 
                                          width="16" 
                                          height="16" 
                                          viewBox="0 0 24 24" 
                                          fill="none" 
                                          stroke="currentColor" 
                                          strokeWidth="2" 
                                          strokeLinecap="round" 
                                          strokeLinejoin="round"
                                          style={{ color: '#4F46E5' }}
                                          role="img"
                                          aria-hidden="true"
                                        >
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                          <polyline points="14 2 14 8 20 8" />
                                          <line x1="16" y1="13" x2="8" y2="13" />
                                          <line x1="16" y1="17" x2="8" y2="17" />
                                          <line x1="10" y1="9" x2="8" y2="9" />
                                        </svg>
                                        <Typography
                                          sx={{
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            color: '#1A1A1A'
                                          }}
                                        >
                                          {category.name}
                                        </Typography>
                                      </Box>

                                      <Box
                                        className="expand-icon"
                                        sx={{
                                          ml: 'auto',
                                          mr: 2,
                                          width: 24,
                                          height: 24,
                                          borderRadius: '50%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          transition: 'background-color 0.2s ease',
                                        }}
                                      >
                                        <svg
                                          width="20"
                                          height="20"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          style={{ 
                                            color: '#666666',
                                            transform: `rotate(${isExpanded ? '180deg' : '0deg'})`,
                                            transition: 'transform 0.2s ease'
                                          }}
                                        >
                                          <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>

                                <Box
                                  sx={{
                                    mt: 2,
                                    overflow: 'hidden',
                                    maxHeight: isExpanded ? '1000px' : '0px',
                                    transition: 'max-height 0.3s ease-in-out',
                                    opacity: isExpanded ? 1 : 0,
                                    visibility: isExpanded ? 'visible' : 'hidden',
                                  }}
                                >
                                  {categoryTerms.length === 1 ? (
                                    // Single term display
                                    <Box
                                      sx={{
                                        p: 1.5,
                                        bgcolor: '#F9FAFB',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        '&:hover': {
                                          bgcolor: '#F3F4F6'
                                        }
                                      }}
                                    >
                                      <Box sx={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                      }}>
                                        <Typography
                                          sx={{
                                            fontSize: '14px',
                                            color: '#1A1A1A',
                                            flex: 1
                                          }}
                                        >
                                          {categoryTerms[0].text}
                                        </Typography>
                                        <Box sx={{ 
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 2
                                        }}>
                                          <Box
                                            sx={{
                                              px: 2,
                                              pt: 0.5,
                                              pb: 1,
                                              borderRadius: '100px',
                                              bgcolor: `rgba(${
                                                categoryTerms[0].confidence >= 0.9 ? '34, 197, 94' :
                                                categoryTerms[0].confidence >= 0.75 ? '245, 158, 11' :
                                                '239, 68, 68'
                                              }, 0.1)`,
                                              color: categoryTerms[0].confidence >= 0.9 ? '#22C55E' :
                                                    categoryTerms[0].confidence >= 0.75 ? '#F59E0B' :
                                                    '#EF4444',
                                              display: 'flex',
                                              flexDirection: 'column',
                                              alignItems: 'center',
                                              gap: 0.5
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                lineHeight: 1
                                              }}
                                            >
                                              {Math.round(categoryTerms[0].confidence * 100)}% confidence
                                            </Typography>
                                            <Box
                                              sx={{
                                                width: '100%',
                                                height: '3px',
                                                bgcolor: 'rgba(0, 0, 0, 0.1)',
                                                borderRadius: '100px',
                                                overflow: 'hidden'
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  width: `${Math.round(categoryTerms[0].confidence * 100)}%`,
                                                  height: '100%',
                                                  bgcolor: categoryTerms[0].confidence >= 0.9 ? '#22C55E' :
                                                         categoryTerms[0].confidence >= 0.75 ? '#F59E0B' :
                                                         '#EF4444',
                                                  transition: 'width 0.3s ease-in-out'
                                                }}
                                              />
                                            </Box>
                                          </Box>
                                          <IconButton
                                            size="small"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              scrollToTerm(categoryTerms[0].position);
                                            }}
                                            sx={{
                                              color: '#666666',
                                              '&:hover': {
                                                bgcolor: 'rgba(79, 70, 229, 0.04)',
                                                color: '#4F46E5'
                                              }
                                            }}
                                          >
                                            <SearchIcon sx={{ fontSize: 20 }} />
                                          </IconButton>
                                        </Box>
                                      </Box>
                                    </Box>
                                  ) : (
                                    // Multiple terms display
                                    <Box sx={{ 
                                      display: 'flex', 
                                      flexDirection: 'column',
                                      gap: 1
                                    }}>
                                      {categoryTerms.map((term, index) => (
                                        <Box
                                          key={term.id}
                                          sx={{
                                            p: 1.5,
                                            bgcolor: '#F9FAFB',
                                            borderRadius: '8px',
                                            '&:hover': {
                                              bgcolor: '#F3F4F6'
                                            }
                                          }}
                                        >
                                          <Box sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                          }}>
                                            <Typography
                                              sx={{
                                                fontSize: '14px',
                                                color: '#1A1A1A',
                                                fontWeight: 500,
                                                flex: 1
                                              }}
                                            >
                                              {`Tier ${index + 1}: ${term.text}`}
                                            </Typography>
                                            <Box sx={{ 
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: 2
                                            }}>
                                              <Box
                                                sx={{
                                                  px: 2,
                                                  pt: 0.5,
                                                  pb: 1,
                                                  borderRadius: '100px',
                                                  bgcolor: `rgba(${
                                                    term.confidence >= 0.9 ? '34, 197, 94' :
                                                    term.confidence >= 0.75 ? '245, 158, 11' :
                                                    '239, 68, 68'
                                                  }, 0.1)`,
                                                  color: term.confidence >= 0.9 ? '#22C55E' :
                                                        term.confidence >= 0.75 ? '#F59E0B' :
                                                        '#EF4444',
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  alignItems: 'center',
                                                  gap: 0.5
                                                }}
                                              >
                                                <Typography
                                                  sx={{
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    lineHeight: 1
                                                  }}
                                                >
                                                  {Math.round(term.confidence * 100)}% confidence
                                                </Typography>
                                                <Box
                                                  sx={{
                                                    width: '100%',
                                                    height: '3px',
                                                    bgcolor: 'rgba(0, 0, 0, 0.1)',
                                                    borderRadius: '100px',
                                                    overflow: 'hidden'
                                                  }}
                                                >
                                                  <Box
                                                    sx={{
                                                      width: `${Math.round(term.confidence * 100)}%`,
                                                      height: '100%',
                                                      bgcolor: term.confidence >= 0.9 ? '#22C55E' :
                                                             term.confidence >= 0.75 ? '#F59E0B' :
                                                             '#EF4444',
                                                      transition: 'width 0.3s ease-in-out'
                                                    }}
                                                  />
                                                </Box>
                                              </Box>
                                              <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  scrollToTerm(term.position);
                                                }}
                                                sx={{
                                                  color: '#666666',
                                                  '&:hover': {
                                                    bgcolor: 'rgba(79, 70, 229, 0.04)',
                                                    color: '#4F46E5'
                                                  }
                                                }}
                                              >
                                                <SearchIcon sx={{ fontSize: 20 }} />
                                              </IconButton>
                                            </Box>
                                          </Box>
                                        </Box>
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              </Paper>
                            );
                          })
                        )}
                      </Box>
                    </Paper>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'space-between',
                  width: '100%'
                }}>
                  <Button
                    startIcon={<Refresh />}
                    variant="outlined"
                    onClick={restartTermExtraction}
                    disabled={isExtractingTerms}
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
                    onClick={() => setSelectedTab(2)}
                    disabled={!isExtractionComplete || isExtractingTerms}
                    sx={{
                      bgcolor: '#18181B',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: '8px',
                      py: 1.5,
                      '&:hover': {
                        bgcolor: '#27272A'
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#E5E7EB',
                        color: '#666666'
                      }
                    }}
                  >
                    Continue to Configuration
                  </Button>
                </Box>
              </Box>
            )}
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
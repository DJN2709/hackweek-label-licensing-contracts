const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Simple in-memory cache
const responseCache = new Map();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Proxy endpoint for the legal contract analyzer
app.post('/api/legal_contract_analyzer', async (req, res) => {
  console.log('Received request for legal contract analyzer');
  
  // Generate a cache key based on the contract text
  const contractText = req.body.legal_contract || '';
  const cacheKey = contractText.substring(0, 100); // First 100 chars as key
  
  // Check cache first
  if (responseCache.has(cacheKey)) {
    console.log('Returning cached response');
    return res.json(responseCache.get(cacheKey));
  }
  
  console.log('Request body:', contractText.substring(0, 200) + '...');
  
  try {
    console.log('Sending request to external API...');
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API request timed out')), 3000); // 3 second timeout
    });
    
    // Try both possible API endpoints
    const apiEndpoints = [
      'http://10.189.49.27/agent/legal_contract_analyzer',
      'http://10.189.49.27:8080/agent/legal_contract_analyzer', // Try alternate port
      'http://localhost:8080/agent/legal_contract_analyzer' // Try localhost
    ];

    const apiRequests = apiEndpoints.map(endpoint => 
      axios.post(endpoint, req.body, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 3000 // 3 second timeout
      }).catch(err => {
        console.log(`Failed to reach ${endpoint}:`, err.message);
        return null; // Return null for failed requests
      })
    );
    
    // Try all endpoints and use the first successful response
    const responses = await Promise.all(apiRequests);
    const successfulResponse = responses.find(r => r !== null);

    if (successfulResponse) {
      console.log('External API response status:', successfulResponse.status);
      console.log('External API response data:', JSON.stringify(successfulResponse.data).substring(0, 200) + '...');
      
      // Cache the response
      responseCache.set(cacheKey, successfulResponse.data);
      
      res.json(successfulResponse.data);
    } else {
      // If all API endpoints fail, generate mock data
      console.log('All API endpoints failed, generating mock data');
      const mockData = generateMockData(contractText);
      responseCache.set(cacheKey, mockData);
      res.json(mockData);
    }
  } catch (error) {
    console.error('Error proxying request to legal contract analyzer:', error.message);
    
    // Generate mock data for demo purposes
    console.log('Generating mock data due to error');
    const mockData = generateMockData(contractText);
    
    // Cache the mock data too
    responseCache.set(cacheKey, mockData);
    
    // Return mock data
    res.json(mockData);
  }
});

// Function to generate mock data for demo purposes
function generateMockData(contractText) {
  console.log('Generating mock data for demo');
  
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

// Routes
app.get('/api/licensors', (req, res) => {
  // Mock data for now
  const licensors = [
    { id: 1, name: "GOOINN Teknoloji Inovasyon", type: "Undefined" },
    { id: 2, name: "(NEW) Mediakraft Networks Gmbh", type: "Undefined" },
    { id: 3, name: "(OLD) Mediakraft Networks Gmbh", type: "Label" },
    { id: 4, name: "(RED) CEN", type: "Alias" },
    { id: 5, name: "(RED) Collective Records", type: "Alias" },
    { id: 6, name: "(RED) Equal Vision Records", type: "Alias" },
    { id: 7, name: "(RED) Fania", type: "Alias" },
    { id: 8, name: "(RED) Megaforce", type: "Alias" },
    { id: 9, name: "(RED) Red Bull Records", type: "Alias" },
    { id: 10, name: "(RED) Thirty Tigers", type: "Alias" },
    { id: 11, name: "(RED) Whatevack", type: "Alias" }
  ];
  res.json(licensors);
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
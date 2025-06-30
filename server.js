const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

app.use('/submit', limiter);
app.use(express.json());
app.use(express.static('public'));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Make transporter available to routes
app.locals.transporter = transporter;

// Import route modules
const statutoryPoaRoutes = require('./routes/statutory-poa');
const medicalPoaRoutes = require('./routes/medical-poa');
const directiveToPhysiciansRoutes = require('./routes/directive-to-physicians');
const willRoutes = require('./routes/will');
const giftsRoutes = require('./routes/gifts');

// Legacy route handler for backward compatibility
app.post('/submit', async (req, res) => {
  try {
    const { documentType } = req.body;
    
    if (documentType === 'power-of-attorney') {
      // Forward to statutory POA route
      req.url = '/statutory-poa';
      return statutoryPoaRoutes(req, res);
    } else if (documentType === 'medical-power-of-attorney') {
      // Forward to medical POA route  
      req.url = '/medical-poa';
      return medicalPoaRoutes(req, res);
    } else if (documentType === 'directive-to-physicians') {
      // Forward to directive route
      req.url = '/directive-to-physicians';
      return directiveToPhysiciansRoutes(req, res);
    } else if (documentType === 'will') {  
      // Forward to will route
      req.url = '/will';
      return willRoutes(req, res);
    } else {
      throw new Error('Unknown document type');
    }
  } catch (error) {
    console.error('Main route error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Use route modules for new endpoints
app.use('/submit', statutoryPoaRoutes);
app.use('/submit', medicalPoaRoutes);
app.use('/submit', directiveToPhysiciansRoutes);
app.use('/submit', willRoutes);
app.use('/submit', giftsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

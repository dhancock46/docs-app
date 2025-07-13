const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // Increase from 5 to 50 requests
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
const remainingEstateRoutes = require('./routes/remaining-estate');
const perRepRoutes = require('./routes/per-rep');
const guardiansRoutes = require('./routes/guardians');

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
app.use('/submit', remainingEstateRoutes);
app.use('/submit', perRepRoutes);
app.use('/submit', guardiansRoutes);

// Test route for will generation
app.get('/test-will', async (req, res) => {
    try {
        const { generateGiftsSection } = require('./generators/gifts-generator');
        const { generateRemainingEstateSection } = require('./generators/remaining-estate-generator');
        
        const testData = {
            testatorName: 'John Smith',
            maritalStatus: 'married',
            spouseName: 'Jane Smith',
            spouseGender: 'female',
            primaryDistributee: 'combinedChildren',
            alternativeDistributee: 'parents',
            selectedGiftTypes: ['specificPersonGifts'],
            specificGifts: [{
                description: '$10,000',
                recipient: 'Robert Smith',
                relationship: 'my brother'
            }]
        };
        
        const gifts = generateGiftsSection(testData);
        const estate = generateRemainingEstateSection(testData);
        
        // Inspect the first paragraph structure
        const firstGift = gifts[0];
        const firstEstate = estate[0];
        
        let giftsText = 'No valid gifts';
        let estateText = 'No valid estate';
        
        // Try different ways to extract text
        if (Array.isArray(gifts)) {
            giftsText = gifts.map((p, i) => {
                // Check different possible structures
                if (p && typeof p === 'object') {
                    if (p.children && Array.isArray(p.children)) {
                        return p.children.map(c => c.text || '').join('');
                    } else if (p.text) {
                        return p.text;
                    } else if (typeof p === 'string') {
                        return p;
                    } else {
                        return `Paragraph ${i} structure: ${JSON.stringify(Object.keys(p))}`;
                    }
                }
                return `Paragraph ${i}: ${typeof p}`;
            }).join('\n\n');
        }
        
        if (Array.isArray(estate)) {
            estateText = estate.map((p, i) => {
                if (p && typeof p === 'object') {
                    if (p.children && Array.isArray(p.children)) {
                        return p.children.map(c => c.text || '').join('');
                    } else if (p.text) {
                        return p.text;
                    } else if (typeof p === 'string') {
                        return p;
                    } else {
                        return `Paragraph ${i} structure: ${JSON.stringify(Object.keys(p))}`;
                    }
                }
                return `Paragraph ${i}: ${typeof p}`;
            }).join('\n\n');
        }

        res.send(`
            <html>
            <head><title>Will Generation Test - Structure Debug</title></head>
            <body style="font-family: Arial; margin: 20px; line-height: 1.6;">
                <h1>Structure Debug</h1>
                
                <h2>First Gift Paragraph Structure:</h2>
                <pre style="background: #f0f0f0; padding: 10px;">${JSON.stringify(firstGift, null, 2)}</pre>
                
                <h2>First Estate Paragraph Structure:</h2>
                <pre style="background: #f0f0f0; padding: 10px;">${JSON.stringify(firstEstate, null, 2)}</pre>
                
                <h2>GIFTS SECTION:</h2>
                <div style="border: 1px solid #ccc; padding: 15px; background: #f9f9f9; white-space: pre-wrap;">
${giftsText}
                </div>
                
                <h2>REMAINING ESTATE SECTION:</h2>
                <div style="border: 1px solid #ccc; padding: 15px; background: #f9f9f9; white-space: pre-wrap;">
${estateText}
                </div>
            </body>
            </html>
        `);
        
    } catch (error) {
        res.status(500).send(`Error: ${error.message}<br><pre>${error.stack}</pre>`);
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

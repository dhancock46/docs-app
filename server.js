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
    let debugLog = [];
    
    try {
        debugLog.push('Starting will generation test...');
        
        const { generateGiftsSection } = require('./generators/gifts-generator');
        debugLog.push('✅ Gifts generator loaded');
        
        const { generateRemainingEstateSection } = require('./generators/remaining-estate-generator');
        debugLog.push('✅ Remaining estate generator loaded');
        
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
        debugLog.push('✅ Test data created');
        
        // Test gifts section
        debugLog.push('Testing gifts section...');
        const gifts = generateGiftsSection(testData);
        debugLog.push(`Gifts result type: ${typeof gifts}`);
        debugLog.push(`Gifts is array: ${Array.isArray(gifts)}`);
        debugLog.push(`Gifts length: ${gifts ? gifts.length : 'undefined'}`);
        
        // Test remaining estate section
        debugLog.push('Testing remaining estate section...');
        const estate = generateRemainingEstateSection(testData);
        debugLog.push(`Estate result type: ${typeof estate}`);
        debugLog.push(`Estate is array: ${Array.isArray(estate)}`);
        debugLog.push(`Estate length: ${estate ? estate.length : 'undefined'}`);
        
        let giftsText = 'No gifts generated';
        let estateText = 'No estate generated';
        
        if (Array.isArray(gifts) && gifts.length > 0) {
            debugLog.push('Processing gifts paragraphs...');
            giftsText = gifts.map((p, i) => {
                debugLog.push(`Gift paragraph ${i}: ${p ? 'exists' : 'null'}`);
                if (p && p.children) {
                    debugLog.push(`Gift paragraph ${i} has ${p.children.length} children`);
                    return p.children.map(c => c.text || '').join('');
                }
                return 'Invalid paragraph';
            }).join('\n\n');
        }
        
        if (Array.isArray(estate) && estate.length > 0) {
            debugLog.push('Processing estate paragraphs...');
            estateText = estate.map((p, i) => {
                debugLog.push(`Estate paragraph ${i}: ${p ? 'exists' : 'null'}`);
                if (p && p.children) {
                    debugLog.push(`Estate paragraph ${i} has ${p.children.length} children`);
                    return p.children.map(c => c.text || '').join('');
                }
                return 'Invalid paragraph';
            }).join('\n\n');
        }

        res.send(`
            <html>
            <head><title>Will Generation Test</title></head>
            <body style="font-family: Arial; margin: 20px; line-height: 1.6;">
                <h1>Will Generation Test Results</h1>
                
                <h2>DEBUG LOG:</h2>
                <div style="border: 1px solid #333; padding: 15px; background: #000; color: #0f0; font-family: monospace; white-space: pre-wrap;">
${debugLog.join('\n')}
                </div>
                
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
        debugLog.push(`❌ ERROR: ${error.message}`);
        debugLog.push(`Stack: ${error.stack}`);
        
        res.status(500).send(`
            <html>
            <body style="font-family: Arial; margin: 20px;">
                <h1>❌ Test Error</h1>
                <div style="border: 1px solid #333; padding: 15px; background: #000; color: #f00; font-family: monospace; white-space: pre-wrap;">
${debugLog.join('\n')}
                </div>
            </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

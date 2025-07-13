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
            hasChildren: 'yes',
            hasMultipleChildren: true,
            hasMinorChildren: true,
            blendedFamily: 'yes',
            
            // Add the required children data for combinedChildren
            currentMarriageChildren: [
                { name: 'Michael Smith', birthday: 'January 15, 2015' },
                { name: 'Sarah Smith', birthday: 'March 22, 2018' }
            ],
            spousePriorChildren: [
                { name: 'Emma Wilson', birthday: 'August 5, 2014' }
            ],
            
            primaryDistributee: 'combinedChildren',
            alternativeDistributee: 'parents',
            selectedGiftTypes: ['specificPersonGifts'],
            specificGifts: [{
                description: '$10,000',
                recipient: 'Robert Smith',
                relationship: 'my brother'
            }]
        };
        
        // Function to extract text from docx paragraph objects
        function extractTextFromParagraph(paragraph) {
            if (!paragraph || !paragraph.root) return '';
            
            let text = '';
            
            function searchForText(obj) {
                if (Array.isArray(obj)) {
                    obj.forEach(item => searchForText(item));
                } else if (obj && typeof obj === 'object') {
                    if (obj.rootKey === 'w:t' && obj.root && Array.isArray(obj.root)) {
                        obj.root.forEach(item => {
                            if (typeof item === 'string') {
                                text += item;
                            }
                        });
                    } else if (obj.root) {
                        searchForText(obj.root);
                    }
                }
            }
            
            searchForText(paragraph.root);
            return text;
        }
        
        const gifts = generateGiftsSection(testData);
        const estate = generateRemainingEstateSection(testData);
        
        let giftsText = 'No gifts generated';
        let estateText = 'No estate generated';
        
        if (Array.isArray(gifts)) {
            giftsText = gifts.map((p, i) => {
                const text = extractTextFromParagraph(p);
                return text || `[Paragraph ${i}: No text found]`;
            }).join('\n\n');
        }
        
        if (Array.isArray(estate)) {
            estateText = estate.map((p, i) => {
                const text = extractTextFromParagraph(p);
                return text || `[Paragraph ${i}: No text found]`;
            }).join('\n\n');
        }

        res.send(`
            <html>
            <head><title>Will Generation Test - Updated</title></head>
            <body style="font-family: Arial; margin: 20px; line-height: 1.6;">
                <h1>✅ Will Generation Test - Updated Data</h1>
                
                <h2>Test Data Used:</h2>
                <div style="border: 1px solid #ddd; padding: 10px; background: #f5f5f5; font-size: 12px;">
                    Primary Distributee: ${testData.primaryDistributee}<br>
                    Marital Status: ${testData.maritalStatus}<br>
                    Blended Family: ${testData.blendedFamily}<br>
                    Has Children: ${testData.hasChildren}
                </div>
                
                <h2>GIFTS SECTION:</h2>
                <div style="border: 1px solid #ccc; padding: 15px; background: #f9f9f9; white-space: pre-wrap; font-family: 'Times New Roman', serif;">
${giftsText}
                </div>
                
                <h2>REMAINING ESTATE SECTION:</h2>
                <div style="border: 1px solid #ccc; padding: 15px; background: #f9f9f9; white-space: pre-wrap; font-family: 'Times New Roman', serif;">
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

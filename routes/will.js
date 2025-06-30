const express = require('express');
const router = express.Router();

router.post('/will', async (req, res) => {
    try {
        console.log('Will personal info data received:', req.body);
        
        // Validate required fields
        const requiredFields = [
            'testatorName', 'clientEmail', 'testatorCity', 'testatorState', 
            'testatorCounty', 'testatorGender', 'maritalStatus', 'hasChildren'
        ];
        
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        // Validate spouse information if married
        if (req.body.maritalStatus === 'married') {
            if (!req.body.spouseName || !req.body.spouseGender) {
                throw new Error('Spouse information is required when married');
            }
        }
        
        // Process and clean the data
        const processedData = {
            ...req.body,
            section: 'personal-info',
            timestamp: new Date().toISOString()
        };
        
        // Send email notification about the section completion
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'don.r.hancock@gmail.com',
            subject: 'Will - Personal Information Section Completed',
            text: `Personal information section completed for ${req.body.testatorName}\n\nData:\n${JSON.stringify(processedData, null, 2)}`
        };
        
        const transporter = req.app.locals.transporter;
        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Personal information saved successfully',
            nextSection: 'gifts'
        });
        
    } catch (error) {
        console.error('Will Personal Info Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error processing personal information'
        });
    }
});

module.exports = router;

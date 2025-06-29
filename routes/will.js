const express = require('express');
const { generateWill } = require('../generators/will-generator');
const router = express.Router();

router.post('/will', async (req, res) => {
    try {
        console.log('Will form data received:', req.body);
        
        // For now, we'll just validate and store the data
        // The actual document generation will happen when all sections are complete
        
        // Validate required fields
        const requiredFields = ['testatorName', 'clientEmail', 'testatorCity', 'testatorState', 'testatorCounty', 'testatorGender', 'maritalStatus'];
        
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        // Validate marital status specific requirements
        if (req.body.maritalStatus === 'married') {
            if (!req.body.spouseName || !req.body.spouseGender) {
                throw new Error('Spouse information is required for married testators');
            }
        }
        
        // Validate children information if applicable
        if (req.body.hasChildren === 'yes') {
            const maritalStatus = req.body.maritalStatus;
            
            if (maritalStatus === 'married') {
                // For married testators, validate appropriate children sections
                const hasCurrentChildren = req.body.hasCurrentMarriageChildren === 'yes';
                const hasPriorChildren = req.body.hasPriorChildren === 'yes';
                const hasSpousePriorChildren = req.body.hasSpousePriorChildren === 'yes';
                
                if (!hasCurrentChildren && !hasPriorChildren && !hasSpousePriorChildren) {
                    throw new Error('If you have children, please specify which category they belong to');
                }
                
                // Validate that children data exists for selected categories
                if (hasCurrentChildren && (!req.body.currentMarriageChildren || req.body.currentMarriageChildren.length === 0)) {
                    throw new Error('Please provide information for children from current marriage');
                }
                
                if (hasPriorChildren && (!req.body.priorChildren || req.body.priorChildren.length === 0)) {
                    throw new Error('Please provide information for your children from prior relationships');
                }
                
                if (hasSpousePriorChildren && (!req.body.spousePriorChildren || req.body.spousePriorChildren.length === 0)) {
                    throw new Error('Please provide information for spouse\'s children from prior relationships');
                }
            } else {
                // For single/divorced/widowed testators
                if (!req.body.singleChildren || req.body.singleChildren.length === 0) {
                    throw new Error('Please provide information for your children');
                }
            }
        }
        
        // Process and clean the data
        const processedData = {
            ...req.body,
            section: 'personal-info',
            timestamp: new Date().toISOString()
        };
        
        // In a real application, you would save this to a database
        // For now, we'll just validate and return success
        
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
            message: 'Personal information section completed successfully',
            nextSection: 'executor-guardian' // This will be the next section
        });
        
    } catch (error) {
        console.error('Will Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error processing will information'
        });
    }
});

module.exports = router;

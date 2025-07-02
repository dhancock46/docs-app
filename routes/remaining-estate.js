const express = require('express');
const router = express.Router();

// Handle remaining estate form submission
router.post('/submit/remaining-estate', (req, res) => {
    try {
        console.log('Remaining estate form submission received:', req.body);
        
        const {
            testatorName,
            clientEmail,
            spouseDistribution,
            spousePercentage,
            childrenDistribution,
            customChildShares,
            alternativeBeneficiaries,
            charityName,
            customAlternatives,
            documentType,
            section
        } = req.body;
        
        // Validate required fields
        if (!testatorName || !clientEmail) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: testatorName and clientEmail'
            });
        }
        
        // Store the data (you can modify this to save to your database)
        const remainingEstateData = {
            testatorName,
            clientEmail,
            spouseDistribution,
            spousePercentage: spousePercentage ? parseInt(spousePercentage) : null,
            childrenDistribution,
            customChildShares,
            alternativeBeneficiaries,
            charityName,
            customAlternatives,
            documentType,
            section,
            timestamp: new Date().toISOString()
        };
        
        // Here you would typically save to a database
        // For now, we'll just log it and return success
        console.log('Processed remaining estate data:', remainingEstateData);
        
        res.json({
            success: true,
            message: 'Remaining estate distribution saved successfully',
            data: remainingEstateData
        });
        
    } catch (error) {
        console.error('Error processing remaining estate submission:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

module.exports = router;

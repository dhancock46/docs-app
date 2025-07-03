const express = require('express');
const router = express.Router();

// Add debugging
console.log('Remaining estate route file loaded successfully');

// Handle remaining estate form submission
router.post('/remaining-estate', (req, res) => {
    try {
        console.log('Remaining estate route hit!');
        console.log('Remaining estate form submission received:', req.body);
        
        const {
            testatorName,
            clientEmail,
            spouseDistribution,
            spousePercentage,
            primaryDistribution,
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
        
        // Store the data
        const remainingEstateData = {
            testatorName,
            clientEmail,
            spouseDistribution,
            spousePercentage: spousePercentage ? parseInt(spousePercentage) : null,
            primaryDistribution,
            customChildShares,
            alternativeBeneficiaries,
            charityName,
            customAlternatives,
            documentType,
            section,
            timestamp: new Date().toISOString()
        };
        
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

console.log('Remaining estate route registered');

module.exports = router;

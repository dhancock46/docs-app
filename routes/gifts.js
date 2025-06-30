const express = require('express');
const router = express.Router();

router.post('/gifts', async (req, res) => {
    try {
        console.log('Gifts form data received:', req.body);
        
        // Validate required fields
        const requiredFields = ['testatorName', 'clientEmail'];
        
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        // Validate gift-specific requirements based on selected types
        const selectedGiftTypes = req.body.selectedGiftTypes || [];
        
        // Validate spouse retirement gift
        if (selectedGiftTypes.includes('spouseRetirement')) {
            if (!req.body.spouseName || !req.body.spouseGender || !req.body.spouseHasRetirement) {
                throw new Error('Complete spouse retirement account information is required');
            }
            if (req.body.spouseHasRetirement === 'no') {
                throw new Error('Cannot make gift of spouse retirement accounts if spouse has no retirement accounts');
            }
        }
        
        // Validate prior children trust
        if (selectedGiftTypes.includes('priorChildrenTrust')) {
            if (!req.body.priorChildrenNames || !req.body.trustAmount || !req.body.trustName || !req.body.lifeInsuranceFunding) {
                throw new Error('Complete prior children trust information is required');
            }
        }
        
        // Validate specific person gifts
        if (selectedGiftTypes.includes('specificPersonGifts')) {
            if (!req.body.isMarried) {
                throw new Error('Marital status is required for specific gifts');
            }
            
            if (req.body.isMarried === 'yes' && !req.body.spouseNameGifts) {
                throw new Error('Spouse name is required for specific gifts when married');
            }
            
            if (!req.body.specificGifts || req.body.specificGifts.length === 0) {
                throw new Error('At least one specific gift must be provided');
            }
            
            // Validate each specific gift
            req.body.specificGifts.forEach((gift, index) => {
                if (!gift.description || !gift.recipient) {
                    throw new Error(`Specific gift #${index + 1} is incomplete - description and recipient are required`);
                }
            });
        }
        
        // Validate charitable gifts
        if (selectedGiftTypes.includes('charitableGifts')) {
            if (!req.body.isMarriedCharity) {
                throw new Error('Marital status is required for charitable gifts');
            }
            
            if (req.body.isMarriedCharity === 'yes' && !req.body.spouseNameCharity) {
                throw new Error('Spouse name is required for charitable gifts when married');
            }
            
            if (!req.body.charitableGifts || req.body.charitableGifts.length === 0) {
                throw new Error('At least one charitable gift must be provided');
            }
            
            // Validate each charitable gift
            req.body.charitableGifts.forEach((gift, index) => {
                if (!gift.description || !gift.recipient) {
                    throw new Error(`Charitable gift #${index + 1} is incomplete - description and recipient are required`);
                }
            });
        }
        
        // Process and clean the data
        const processedData = {
            ...req.body,
            section: 'gifts',
            timestamp: new Date().toISOString()
        };
        
        // Send email notification about the section completion
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'don.r.hancock@gmail.com',
            subject: 'Will - Gifts Section Completed',
            text: `Gifts section completed for ${req.body.testatorName}\n\nSelected Gift Types: ${selectedGiftTypes.join(', ')}\n\nData:\n${JSON.stringify(processedData, null, 2)}`
        };
        
        const transporter = req.app.locals.transporter;
        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Gifts section completed successfully',
            nextSection: 'remaining-estate'
        });
        
    } catch (error) {
        console.error('Gifts Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error processing gifts information'
        });
    }
});

module.exports = router;

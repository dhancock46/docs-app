const express = require('express');
const router = express.Router();

router.post('/gifts', async (req, res) => {
    try {
console.log('=== GIFTS BACKEND DEBUG ===');
console.log('Request body:', JSON.stringify(req.body, null, 2));
console.log('Selected gift types:', req.body.selectedGiftTypes);
console.log('==========================');
        
        // Validate required fields
        const requiredFields = ['testatorName', 'clientEmail'];
        
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        // Get selected gift types
        const selectedGiftTypes = req.body.selectedGiftTypes || [];
        
        // NEW: Allow empty gift selections or "none" - this is valid for ALL users
        if (selectedGiftTypes.length === 0 || selectedGiftTypes.includes('none')) {
            console.log('No specific gifts selected - this is valid for all marital statuses');
            
            // Process and clean the data
            const processedData = {
                ...req.body,
                section: 'gifts',
                timestamp: new Date().toISOString()
            };
            
            // Send email notification
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'don.r.hancock@gmail.com',
                subject: 'Will - Gifts Section Completed (No Gifts Selected)',
                text: `Gifts section completed for ${req.body.testatorName}\n\nSelected Gift Types: None\n\nData:\n${JSON.stringify(processedData, null, 2)}`
            };
            
            const transporter = req.app.locals.transporter;
            await transporter.sendMail(mailOptions);
            
            return res.json({ 
                success: true, 
                message: 'Gifts section completed successfully',
                nextSection: 'remaining-estate'
            });
        }
        
        // If gifts ARE selected, validate them
        // Validate spouse retirement gift
        if (selectedGiftTypes.includes('spouseRetirement')) {
            if (!req.body.spouseHasRetirementPre) {
                throw new Error('Please indicate if your spouse has retirement accounts');
            }
            if (req.body.spouseHasRetirementPre === 'no') {
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

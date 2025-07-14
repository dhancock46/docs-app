const express = require('express');
const router = express.Router();

router.post('/guardians', async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['testatorName', 'clientEmail'];
        
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        // Validate guardian structure selection
        if (!req.body.guardianStructure) {
            throw new Error('Please select how you want to structure the guardianship');
        }
        
        // Additional validation based on structure
        if (req.body.guardianStructure === 'same') {
            if (!req.body.guardianTypeSame) {
                throw new Error('Please select guardian type for person and estate');
            }
            if (!req.body.guardianSameName || !req.body.guardianSameRelationship || !req.body.guardianSameAddress) {
                throw new Error('Please complete all guardian information');
            }
        } else if (req.body.guardianStructure === 'different') {
            if (!req.body.guardianTypePerson || !req.body.guardianTypeEstate) {
                throw new Error('Please select guardian types for both person and estate');
            }
            if (!req.body.guardianPersonName || !req.body.guardianEstateName) {
                throw new Error('Please enter names for both guardians');
            }
        }
        
        // Process and clean the data
        const processedData = {
            ...req.body,
            section: 'guardians',
            timestamp: new Date().toISOString()
        };
        
        // Create summary for email
        let guardianSummary = `Guardian Structure: ${req.body.guardianStructure}\n`;
        
        if (req.body.guardianStructure === 'same') {
            guardianSummary += `Guardian Type: ${req.body.guardianTypeSame}\n`;
            guardianSummary += `Primary Guardian: ${req.body.guardianSameName}\n`;
            if (req.body.coGuardianSameName) {
                guardianSummary += `Co-Guardian: ${req.body.coGuardianSameName}\n`;
            }
        } else {
            guardianSummary += `Guardian of Person: ${req.body.guardianPersonName}\n`;
            guardianSummary += `Guardian of Estate: ${req.body.guardianEstateName}\n`;
        }
        
        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'don.r.hancock@gmail.com',
            subject: 'Will - Guardians Section Completed',
            text: `Guardians section completed for ${req.body.testatorName}\n\n${guardianSummary}\n\nComplete Data:\n${JSON.stringify(processedData, null, 2)}`
        };
        
        const transporter = req.app.locals.transporter;
        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Guardian information saved successfully',
            nextSection: 'trusts' // Specify the next section
        });
        
    } catch (error) {
        console.error('Guardians Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error processing guardian information'
        });
    }
});

module.exports = router;

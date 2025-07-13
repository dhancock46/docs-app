const express = require('express');
const router = express.Router();

router.post('/trusts', async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['testatorName', 'clientEmail'];
        
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        const createTrust = req.body.createTrust;
        
        // Validate basic trust decision
        if (!createTrust) {
            throw new Error('Please select whether to create trusts');
        }
        
        // If no trusts are being created, that's valid
        if (createTrust === 'no') {
            console.log('No trusts selected - this is valid');
            
            const processedData = {
                ...req.body,
                section: 'trusts',
                timestamp: new Date().toISOString()
            };
            
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'don.r.hancock@gmail.com',
                subject: 'Will - Trusts Section Completed (No Trusts Created)',
                text: `Trusts section completed for ${req.body.testatorName}\n\nTrust Creation: No\n\nData:\n${JSON.stringify(processedData, null, 2)}`
            };
            
            const transporter = req.app.locals.transporter;
            await transporter.sendMail(mailOptions);
            
            return res.json({ 
                success: true, 
                message: 'Trusts section completed successfully',
                nextSection: 'next-section' // Update with actual next section
            });
        }
        
        // If trusts ARE being created, validate the configuration
        if (createTrust === 'yes') {
            // Validate trust type
            if (!req.body.trustType) {
                throw new Error('Please select a trust type');
            }
            
            // Validate trust end age
            const trustEndAge = parseInt(req.body.trustEndAge);
            if (!trustEndAge || trustEndAge < 18 || trustEndAge > 50) {
                throw new Error('Please enter a valid trust end age between 18 and 50');
            }
            
            // Validate trustee structure
            if (!req.body.trusteeStructure) {
                throw new Error('Please select a trustee structure');
            }
            
            // Validate based on trustee structure
            if (req.body.trusteeStructure === 'single') {
                if (!req.body.primaryTrustee || req.body.primaryTrustee.trim() === '') {
                    throw new Error('Please enter the primary trustee name');
                }
            } else if (req.body.trusteeStructure === 'co-trustees') {
                if (!req.body.coTrustee1Name || req.body.coTrustee1Name.trim() === '') {
                    throw new Error('Please enter the first co-trustee name');
                }
                if (!req.body.coTrustee2Name || req.body.coTrustee2Name.trim() === '') {
                    throw new Error('Please enter the second co-trustee name');
                }
            }
            
            // Validate prior children trust if applicable
            if (req.body.maritalStatus === 'married' && req.body.hasPriorChildren === 'yes') {
                if (req.body.priorChildrenTrust === 'yes') {
                    if (!req.body.priorChildrenTrustEndAge) {
                        throw new Error('Please enter the end age for the prior children trust');
                    }
                    if (!req.body.priorChildrenTrustPrimaryTrustee || req.body.priorChildrenTrustPrimaryTrustee.trim() === '') {
                        throw new Error('Please enter the primary trustee for the prior children trust');
                    }
                }
            }
        }
        
        // Process alternate trustee arrays
        const alternateTrusteeNames = req.body.alternateTrusteeNames || [];
        const alternateTrusteeRelationships = req.body.alternateTrusteeRelationships || [];
        const priorChildrenAlternateTrusteeNames = req.body.priorChildrenAlternateTrusteeNames || [];
        
        // Process and clean the data
        const processedData = {
            ...req.body,
            alternateTrusteeNames: alternateTrusteeNames.filter(name => name && name.trim() !== ''),
            alternateTrusteeRelationships: alternateTrusteeRelationships.filter(rel => rel && rel.trim() !== ''),
            priorChildrenAlternateTrusteeNames: priorChildrenAlternateTrusteeNames.filter(name => name && name.trim() !== ''),
            section: 'trusts',
            timestamp: new Date().toISOString()
        };
        
        // Create summary for email
        let trustSummary = `Trust Creation: ${createTrust}\n`;
        if (createTrust === 'yes') {
            trustSummary += `Trust Type: ${req.body.trustType}\n`;
            trustSummary += `Trust End Age: ${req.body.trustEndAge}\n`;
            trustSummary += `Trustee Structure: ${req.body.trusteeStructure}\n`;
            
            if (req.body.trusteeStructure === 'single') {
                trustSummary += `Primary Trustee: ${req.body.primaryTrustee}\n`;
            } else if (req.body.trusteeStructure === 'co-trustees') {
                trustSummary += `Co-Trustees: ${req.body.coTrustee1Name} and ${req.body.coTrustee2Name}\n`;
            }
            
            if (processedData.alternateTrusteeNames.length > 0) {
                trustSummary += `Alternate Trustees: ${processedData.alternateTrusteeNames.join(', ')}\n`;
            }
            
            if (req.body.priorChildrenTrust === 'yes') {
                trustSummary += `Prior Children Trust: Yes\n`;
                trustSummary += `Prior Children Trust End Age: ${req.body.priorChildrenTrustEndAge}\n`;
                trustSummary += `Prior Children Trust Primary Trustee: ${req.body.priorChildrenTrustPrimaryTrustee}\n`;
            }
        }
        
        // Send email notification about the section completion
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'don.r.hancock@gmail.com',
            subject: 'Will - Trusts Section Completed',
            text: `Trusts section completed for ${req.body.testatorName}\n\n${trustSummary}\n\nComplete Data:\n${JSON.stringify(processedData, null, 2)}`
        };
        
        const transporter = req.app.locals.transporter;
        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Trusts section completed successfully',
            nextSection: 'next-section' // Update with actual next section
        });
        
    } catch (error) {
        console.error('Trusts Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error processing trusts information'
        });
    }
});

module.exports = router;

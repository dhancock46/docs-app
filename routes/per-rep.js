const express = require('express');
const router = express.Router();

router.post('/per-rep', (req, res) => {
    try {
        console.log('Personal Representatives submission received:', req.body);
        
        // TODO: Add validation logic here
        // TODO: Save to database
        
        // For now, just return success
        res.json({ 
            success: true, 
            message: 'Personal representatives information saved successfully',
            data: req.body 
        });
    } catch (error) {
        console.error('Error processing personal representatives submission:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving personal representatives information' 
        });
    }
});

module.exports = router;

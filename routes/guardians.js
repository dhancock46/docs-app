const express = require('express');
const router = express.Router();

router.post('/guardians', (req, res) => {
    try {
        console.log('Guardians submission received:', req.body);
        res.json({ 
            success: true, 
            message: 'Guardian information saved successfully',
            nextSection: 'trusts'
        });
    } catch (error) {
        console.error('Error processing guardians submission:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving guardian information' 
        });
    }
});

module.exports = router;

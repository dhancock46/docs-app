const express = require('express');
const { generateMedicalPOA } = require('../generators/medical-generator');
const router = express.Router();

router.post('/medical-poa', async (req, res) => {
    try {
        console.log('Received Medical POA data:', req.body);
        
     const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'don.r.hancock@gmail.com',
    subject: 'Medical Power of Attorney Request',
    text: 'Please find the Medical Power of Attorney document attached.',
    attachments: [{
        filename: 'Medical_Power_of_Attorney.docx',
        content: document,
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        contentDisposition: 'attachment'
    }]
};

        const transporter = req.app.locals.transporter;
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: 'Medical Power of Attorney sent successfully' });
    } catch (error) {
        console.error('Medical POA Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
module.exports = router; 

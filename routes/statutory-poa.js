const express = require('express');
const { generateStatutoryPOA } = require('../generators/statutory-generator');
const router = express.Router();

router.post('/statutory-poa', async (req, res) => {
    try {
        console.log('Received Statutory POA data:', req.body);
        
        const document = await generateStatutoryPOA(req.body);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'don.r.hancock@gmail.com',
            subject: 'Statutory Power of Attorney Request',
            text: 'Please find the Statutory Power of Attorney document attached.',
            attachments: [{
                filename: 'Statutory_Power_of_Attorney.docx',
                content: document,
                contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            }]
        };

        const transporter = req.app.locals.transporter;
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: 'Statutory Power of Attorney sent successfully' });
    } catch (error) {
        console.error('Statutory POA Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
module.exports = router; 

const express = require('express');
const { generateDirectiveToPhysicians } = require('../generators/directive-generator');
const router = express.Router();

router.post('/directive-to-physicians', async (req, res) => {
    try {
        console.log('Form data received:', req.body);
        console.log('Terminal choice:', req.body.terminalConditionChoice);
        console.log('Irreversible choice:', req.body.irreversibleConditionChoice);
       
        const document = await generateDirectiveToPhysicians(req.body);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'don.r.hancock@gmail.com',
            subject: 'Directive to Physicians Request',
            text: 'Please find the Directive to Physicians document attached.',
            attachments: [{
                filename: 'Directive_to_Physicians.docx',
                content: document,
                contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                contentDisposition: 'attachment'
            }]
        };
        
        const transporter = req.app.locals.transporter;
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: 'Directive to Physicians sent successfully' });
    } catch (error) {
        console.error('Directive to Physicians Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

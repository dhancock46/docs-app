const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/submit', limiter);

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'drh6502@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Serve the main form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  try {
    const {
      testatorName, primaryAgent, secondAgent, thirdAgent,
      executionDate, executionCity, executionState, executionCounty,
      selectedPowers, specificAuthorities, compensationChoice,
      coAgentChoice, giftsEnabled, effectiveChoice,
      clientEmail, clientPhone, additionalNotes
    } = req.body;

    // Generate the filled document
    const filledDocument = generateDocument({
      testatorName, primaryAgent, secondAgent, thirdAgent,
      executionDate, executionCity, executionState, executionCounty,
      selectedPowers, specificAuthorities, compensationChoice,
      coAgentChoice, giftsEnabled, effectiveChoice
    });
// Email content
    const emailHtml = `
      <h2>New Power of Attorney Request</h2>
      
      <h3>Client Information:</h3>
      <p><strong>Name:</strong> ${testatorName}</p>
      <p><strong>Email:</strong> ${clientEmail}</p>
      <p><strong>Phone:</strong> ${clientPhone || 'Not provided'}</p>
      
      <h3>Document Details:</h3>
      <p><strong>Primary Agent:</strong> ${primaryAgent}</p>
      ${secondAgent ? `<p><strong>Second Agent:</strong> ${secondAgent}</p>` : ''}
      ${thirdAgent ? `<p><strong>Third Agent:</strong> ${thirdAgent}</p>` : ''}
      <p><strong>Execution Location:</strong> ${executionCity}, ${executionState}</p>
      <p><strong>Execution County:</strong> ${executionCounty}</p>
      <p><strong>Execution Date:</strong> ${executionDate}</p>
      
      ${additionalNotes ? `<h3>Additional Notes:</h3><p>${additionalNotes}</p>` : ''}
      
      <hr>
      <h3>Completed Document:</h3>
      <div style="background-color: #f5f5f5; padding: 20px; font-family: monospace; white-space: pre-wrap; border: 1px solid #ccc;">
${filledDocument}
      </div>
    `;

    const mailOptions = {
      from: 'drh6502@gmail.com',
      to: 'drh6502@gmail.com', // Replace with your main email
      subject: `New Power of Attorney Request - ${testatorName}`,
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Thank you, your request has been sent for review. You can expect a response within 1 to 2 days.' 
    });

  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Please try again later.' 
    });
  }
});

function generateDocument(data) {
  const {
    testatorName, primaryAgent, secondAgent, thirdAgent,
    executionDate, executionCity, executionState, executionCounty,
    selectedPowers, specificAuthorities, compensationChoice,
    coAgentChoice, giftsEnabled, effectiveChoice
  } = data;

  // Generate power selections
  const powersList = [
    'A) Real property transactions',
    'B) Tangible personal property transactions',
    'C) Stock and bond transactions',
    'D) Commodity and option transactions',
    'E) Banking and other financial institution transactions',
    'F) Business operating transactions',
    'G) Insurance and annuity transactions',
    'H) Estate, trust, and other beneficiary transactions',
    'I) Claims and litigation',
    'J) Personal and family maintenance',
    'K) Benefits from social security, Medicare, Medicaid, or other governmental programs or civil or military service',
    'L) Retirement plan transactions',
    'M) Tax matters',
    'N) Digital assets and the content of an electronic communication',
    'O) ALL OF THE POWERS LISTED IN (A) THROUGH (N)'
  ];

  const powersSection = powersList.map(power => {
    const letter = power.charAt(0);
    const isSelected = selectedPowers && selectedPowers.includes(letter);
    return `${isSelected ? '  X  ' : '     '} (${power}`;
  }).join('\n');
 // Generate successor agent section
  let successorSection = '';
  if (secondAgent && !thirdAgent) {
    successorSection = `If ${primaryAgent} dies, becomes incapacitated, resigns, refuses to act, or is removed by court order, I appoint ${secondAgent} as successor agent.`;
  } else if (secondAgent && thirdAgent) {
    successorSection = `If ${primaryAgent} dies, becomes incapacitated, resigns, refuses to act, or is removed by court order, I appoint ${secondAgent} as successor agent. If both of the above named agents die, become legally disabled, resign, or refuse to act, I appoint ${thirdAgent} as successor agent.`;
  }

  // Generate specific authorities section
  const specificAuthList = [
    'Create, amend, revoke, or terminate an inter vivos trust',
    'Create or change rights of survivorship',
    'Create or change a beneficiary designation',
    'Authorize another person to exercise the authority granted under this power of attorney'
  ];

  const specificAuthSection = specificAuthList.map((auth, index) => {
    const isSelected = specificAuthorities && specificAuthorities.includes(index.toString());
    return `${isSelected ? '   X   ' : '       '} ${auth}`;
  }).join('\n');

  return `${testatorName}

STATUTORY POWER OF ATTORNEY

NOTICE: THE POWERS GRANTED BY THIS DOCUMENT ARE BROAD AND SWEEPING.
THEY ARE EXPLAINED IN THE DURABLE POWER OF ATTORNEY ACT, SUBTITLE P,
TITLE 2, TEXAS ESTATES CODE. IF YOU HAVE ANY QUESTIONS ABOUT THESE
POWERS, OBTAIN COMPETENT LEGAL ADVICE. THIS DOCUMENT DOES NOT AUTHORIZE
ANYONE TO MAKE MEDICAL AND OTHER HEALTH-CARE DECISIONS FOR YOU. YOU MAY
REVOKE THIS POWER OF ATTORNEY IF YOU LATER WISH TO DO SO.

I, ${testatorName}, appoint ${primaryAgent} as my agent to act for me in any lawful
way with respect to all of the following powers that I have initialed below.

${successorSection}

TO GRANT A POWER, YOU MUST INITIAL THE LINE IN FRONT OF THE POWER YOU ARE GRANTING.

${powersSection}

GRANT OF SPECIFIC AUTHORITY

${specificAuthSection}

COMPENSATION:
${compensationChoice === 'with-compensation' ? '   X   ' : '       '} My agent is entitled to reimbursement and compensation.
${compensationChoice === 'no-compensation' ? '   X   ' : '       '} My agent is entitled to reimbursement only, no compensation.

CO-AGENTS:
${coAgentChoice === 'independently' ? '   X   ' : '       '} Each co-agent may act independently.
${coAgentChoice === 'jointly' ? '   X   ' : '       '} Co-agents must act jointly.
${coAgentChoice === 'majority' ? '   X   ' : '       '} Majority of co-agents must act jointly.

GIFTS:
${giftsEnabled === 'yes' ? '   X   ' : '       '} I grant my agent the power to make gifts up to annual exclusion limits.

EFFECTIVE DATE:
${effectiveChoice === 'immediately' ? '(A) Effective Immediately: This power of attorney is' : '~~(A) Effective Immediately~~'}
${effectiveChoice === 'upon-disability' ? '(B) Effective Upon Disability or Incapacity' : '~~(B) Effective Upon Disability~~'}

Signed on ${executionDate} in ${executionCity}, ${executionState}.

_____________________________
${testatorName}

State of ${executionState}
County of ${executionCounty}

Acknowledged before me on ${executionDate} by ${testatorName}.

_____________________________
Notary Public, State of ${executionState}`;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
{
  "name": "poa-form-app",
  "version": "1.0.0",
  "description": "Power of Attorney Form Application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "nodemailer": "^6.9.7",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "keywords": [
    "power-of-attorney",
    "legal-forms",
    "texas"
  ],
  "author": "Your Name",
  "license": "MIT"
}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Power of Attorney Form</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Georgia, serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2c3e50;
        }

        h1 {
            color: #2c3e50;
            font-size: 2.2em;
            margin-bottom: 10px;
        }

        .subtitle {
            color: #7f8c8d;
            font-size: 1.1em;
        }

        .form-section {
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-left: 4px solid #3498db;
        }

        .form-section h2 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.3em;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #2c3e50;
        }

        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="date"],
        select,
        textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="tel"]:focus,
        input[type="date"]:focus,
        select:focus,
        textarea:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
        }

        .required {
            color: #e74c3c;
        }

        .checkbox-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }

        .checkbox-item {
            display: flex;
            align-items: center;
            padding: 8px;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .checkbox-item input[type="checkbox"] {
            margin-right: 10px;
            transform: scale(1.2);
        }

        .radio-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 10px;
        }

        .radio-item {
            display: flex;
            align-items: center;
            padding: 10px;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .radio-item:hover {
            background-color: #f0f0f0;
        }

        .radio-item input[type="radio"] {
            margin-right: 10px;
            transform: scale(1.2);
        }

        .submit-btn {
            background-color: #2c3e50;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 4px;
            font-size: 18px;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.3s;
        }

        .submit-btn:hover {
            background-color: #34495e;
        }

        .submit-btn:disabled {
            background-color: #95a5a6;
            cursor: not-allowed;
        }

        .notice {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 15px;
            margin-bottom: 20px;
            color: #856404;
        }

        .notice h3 {
            margin-bottom: 10px;
            color: #856404;
        }

        .loading {
            display: none;
            text-align: center;
            padding: 20px;
        }

        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .success-message {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: none;
        }

        .error-message {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            display: none;
        }

        @media (max-width: 600px) {
            .container {
                margin: 10px;
                padding: 15px;
            }
            
            .checkbox-group {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>

const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

app.use('/submit', limiter);
app.use(express.json());
app.use(express.static('public'));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
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

NOTICE: THE POWERS GRANTED BY THIS DOCUMENT ARE BROAD AND SWEEPING. THEY ARE EXPLAINED IN THE DURABLE POWER OF ATTORNEY ACT, SUBTITLE P, TITLE 2, TEXAS ESTATES CODE. IF YOU HAVE ANY QUESTIONS ABOUT THESE POWERS, OBTAIN COMPETENT LEGAL ADVICE. THIS DOCUMENT DOES NOT AUTHORIZE ANYONE TO MAKE MEDICAL AND OTHER HEALTH-CARE DECISIONS FOR YOU. YOU MAY REVOKE THIS POWER OF ATTORNEY IF YOU LATER WISH TO DO SO. IF YOU WANT YOUR AGENT TO HAVE THE AUTHORITY TO SIGN HOME EQUITY LOAN DOCUMENTS ON YOUR BEHALF, THIS POWER OF ATTORNEY MUST BE SIGNED BY YOU AT THE OFFICE OF THE LENDER, AN ATTORNEY AT LAW, OR A TITLE COMPANY.

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

app.post('/submit', async (req, res) => {
  try {
    const document = generateDocument(req.body);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'don.r.hancock@gmail.com',
      subject: 'Power of Attorney Request',
      text: document
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

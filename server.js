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
  return `_______     (${power}`;
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
  return `_______     ${auth}`;
}).join('\n');

return `                                                    ${testatorName}



                                            STATUTORY POWER OF ATTORNEY
2. Find this line:

javascript                                        GRANT OF SPECIFIC AUTHORITY
3. Find these lines:
javascriptCOMPENSATION: Special instructions applicable to agent compensation
Replace with:
javascript                                                COMPENSATION

Special instructions applicable to agent compensation
4. Find this line:
javascriptCO-AGENTS: Special instructions applicable to co-agents
Replace with:
javascript                                                CO-AGENTS

Special instructions applicable to co-agents
5. Find this line:
javascriptGIFTS: Special instructions applicable to gifts
Replace with:
javascript                                                    GIFTS

Special instructions applicable to gifts
These changes will center the headings in the actual Word document by adding appropriate spacing. The spacing might need fine-tuning depending on how it looks in the final document, but this will get you started with centered headings.
Would you like me to continue with the other major headings, or would you prefer to test these changes first?RetryClaude can make mistakes. Please double-check responses.Research Sonnet 4

NOTICE: THE POWERS GRANTED BY THIS DOCUMENT ARE BROAD AND SWEEPING. THEY ARE EXPLAINED IN THE DURABLE POWER OF ATTORNEY ACT, SUBTITLE P, TITLE 2, TEXAS ESTATES CODE. IF YOU HAVE ANY QUESTIONS ABOUT THESE POWERS, OBTAIN COMPETENT LEGAL ADVICE. THIS DOCUMENT DOES NOT AUTHORIZE ANYONE TO MAKE MEDICAL AND OTHER HEALTH-CARE DECISIONS FOR YOU. YOU MAY REVOKE THIS POWER OF ATTORNEY IF YOU LATER WISH TO DO SO. IF YOU WANT YOUR AGENT TO HAVE THE AUTHORITY TO SIGN HOME EQUITY LOAN DOCUMENTS ON YOUR BEHALF, THIS POWER OF ATTORNEY MUST BE SIGNED BY YOU AT THE OFFICE OF THE LENDER, AN ATTORNEY AT LAW, OR A TITLE COMPANY.

I, ${testatorName}, appoint ${primaryAgent} as my agent to act for me in any lawful
way with respect to all of the following powers that I have initialed below.

${successorSection}

If I am married to an agent, and my marriage is dissolved, terminated or voided, the authority of that agent under this power of attorney shall also terminate when my marriage terminates, unless I have provided otherwise in this document.

TO GRANT ALL OF THE FOLLOWING POWERS, INITIAL THE LINE IN FRONT OF (O) AND IGNORE THE LINES IN FRONT OF THE OTHER POWERS LISTED IN (A) THROUGH (N).

TO GRANT A POWER, YOU MUST INITIAL THE LINE IN FRONT OF THE POWER YOU ARE GRANTING.

TO WITHHOLD A POWER, DO NOT INITIAL THE LINE IN FRONT OF THE POWER. YOU MAY, BUT DO NOT NEED TO, CROSS OUT EACH POWER WITHHELD.

${powersSection}

YOU DO NOT HAVE TO INITIAL THE LINE IN FRONT OF ANY OTHER POWER IF YOU INITIAL LINE (O).

GRANT OF SPECIFIC AUTHORITY

My agent MAY NOT do any of the following specific acts for me UNLESS I have INITIALED the specific authority listed below:

(CAUTION: Granting any of the following will give your agent the authority to take actions that could significantly reduce your property or change how your property is distributed at your death. INITIAL ONLY the specific authority you WANT to give your agent. If you DO NOT want to grant your agent one or more of the following powers, you may also CROSS OUT a power you DO NOT want to grant.) 


${specificAuthSection}

COMPENSATION: Special instructions applicable to agent compensation (initial in front of one of the following sentences to have it apply; if no selection is made, each agent will be entitled to compensation that is reasonable under the circumstances):

_______            My agent is entitled to reimbursement of reasonable expenses incurred on my behalf and to compensation that is reasonable under the circumstances.

_______            My agent is entitled to reimbursement of reasonable expenses incurred on my behalf but shall receive no compensation for serving as my agent.

CO-AGENTS: Special instructions applicable to co-agents (If you have appointed co-agents to act, initial in front of one of the following sentences to have it apply; If no selection is made, each agent will be entitled to act independently):

_______                       Each of my co-agents may act independently for me.

_______                       My co-agents may act for me only if the co-agents act jointly.

_______                       My co-agents may act for me only if a majority of the co-agents act jointly.

GIFTS: Special instructions applicable to gifts (initial in front of the following sentence to have it apply):

_______     I grant my agent the power to apply my property to make gifts outright to or for the benefit of a person, including by the exercise of a presently exercisable general power of appointment held by me, except that the amount of a gift to an individual may not exceed the amount of annual exclusions allowed from the federal gift tax for the calendar year of the gift.

GIFTS TO QUALIFY FOR PUBLIC BENEFITS: If my agent in my agent's sole discretion has determined that I need nursing home or other long-term medical care and that I will receive proper medical care whether I privately pay for such care or if I am a recipient of Title XIX (Medicaid) or other public benefits, then my agent shall have the power: (i) to take any and all steps necessary, in my agent's judgment, to obtain and maintain my eligibility for any and all public benefits and entitlement programs, including, if necessary, signing a deed with a retained life estate (also known as a "Lady Bird Deed") as well as creating and funding a qualified income trust or special needs trust for me or a disabled child, if any; (ii) to transfer with or without consideration my assets to my descendants (if any), or to my natural heirs at law or to the persons named as beneficiaries under my last will and testament or a revocable living trust which I may have established, including my agent; and (iii) to enter into a personal services contract for my benefit, including entering into such contract with my agent, and even if doing so may be considered self-dealing. Such public benefits and entitlement programs shall include, but are not limited to, Social Security, Supplemental Security Income, Medicare, Medicaid and Veterans benefits.

LIMITATIONS: Notwithstanding any provision herein to the contrary, any authority granted to my agent shall be limited so as to prevent this power of attorney from causing my agent to be taxed on my income (unless my agent is my spouse) and from causing my assets to be subject to a general power of appointment by my agent, as that term is defined in Section 2041 of the Internal Revenue Code of 1986, as amended.

ADDITIONAL POWERS: ON THE FOLLOWING LINES YOU MAY GIVE SPECIAL INSTRUCTIONS LIMITING OR EXTENDING THE POWERS GRANTED TO YOUR AGENT.

In addition to the powers granted above, I grant to my agent the following powers:

Power to Appoint Substitute Agent. The power to appoint or substitute one or more agents to serve as my agent under this power of attorney; provided, however, such power shall be exercisable only by the then-serving agent (or if more than one agent is serving, by all such co-agents acting unanimously), and any such appointment or substitution shall override other provisions contained herein which may attempt to name one or more successor agents. Any such appointment or substitution may be revoked by me or my agent at any time and for any reason, and such appointment or substitution shall not terminate upon the death, disability, incapacity or resignation of the agent or co-agents who made the appointment or substitution. Any such appointment or substitution shall be evidenced by acknowledged written instrument.

Power to Perform All Other Acts. In addition to the powers enumerated above, I hereby give and grant unto my agent full power and authority to do and perform all and every act and thing whatsoever requisite and necessary to be done, as fully, to all intents and purposes, as I might or could do if personally present, hereby ratifying and confirming whatsoever my agent shall and may do by virtue hereof; provided, however, and notwithstanding the foregoing, if I have withheld a particular power or powers in this power of attorney, then my agent shall not have such power or powers by virtue of the power and authority conferred by this sentence.

UNLESS YOU DIRECT OTHERWISE BELOW, THIS POWER OF ATTORNEY IS EFFECTIVE IMMEDIATELY AND WILL CONTINUE UNTIL IT TERMINATES.

CHOOSE ONE OF THE FOLLOWING ALTERNATIVES BY CROSSING OUT THE ALTERNATIVE NOT CHOSEN:

(A)       **Effective Immediately:** This power of attorney is effective immediately and is not affected by my subsequent disability or incapacity.

(B)       ̶E̶f̶f̶e̶c̶t̶i̶v̶e̶ ̶U̶p̶o̶n̶ ̶D̶i̶s̶a̶b̶i̶l̶i̶t̶y̶ ̶o̶r̶ ̶I̶n̶c̶a̶p̶a̶c̶i̶t̶y̶:̶ ̶T̶h̶i̶s̶ ̶p̶o̶w̶e̶r̶ ̶o̶f̶ ̶a̶t̶t̶o̶r̶n̶e̶y̶ ̶b̶e̶c̶o̶m̶e̶s̶ ̶e̶f̶f̶e̶c̶t̶i̶v̶e̶ ̶u̶p̶o̶n̶ ̶m̶y̶ ̶d̶i̶s̶a̶b̶i̶l̶i̶t̶y̶ ̶o̶r̶ ̶i̶n̶c̶a̶p̶a̶c̶i̶t̶y̶.̶

YOU SHOULD CHOOSE ALTERNATIVE (A) IF THIS POWER OF ATTORNEY IS TO BECOME EFFECTIVE ON THE DATE IT IS EXECUTED.

IF NEITHER (A) NOR (B) IS CROSSED OUT, IT WILL BE ASSUMED THAT YOU CHOSE ALTERNATIVE (A).

If Alternative (B) is chosen, I shall be considered disabled or incapacitated for purposes of this power of attorney if a physician certifies in writing at a date later than the date this power of attorney is executed that, based on the physician's medical examination of me, I am mentally incapable of managing my financial affairs. I authorize the physician who examines me for this purpose to disclose my physical or mental condition to another person for purposes of this power of attorney. A third party who accepts this power of attorney is fully protected from any action taken under this power of attorney that is based on the determination made by a physician of my disability or incapacity. After having been certified as being incapable of managing my financial affairs, if a physician certifies in writing at such later date that, based upon such physician's medical examination of me, I have regained the mental capacity to manage my financial affairs, then this power of attorney shall no longer be effective, and it shall become effective again only if a physician certifies in writing at a date later than the date I regained capacity that, based on the physician's medical examination of me, I am mentally incapable of managing my financial affairs.

I agree that any third party who receives a copy of this document may act under it. Termination of this durable power of attorney is not effective as to a third party until the third party has actual knowledge of the termination. I agree to indemnify the third party for any claims that arise against the third party because of reliance on this power of attorney. The meaning and effect of this durable power of attorney is determined by Texas law.

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

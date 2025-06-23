const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');

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

async function generateDocument(data) {
  const {
    testatorName, primaryAgent, secondAgent, thirdAgent,
    executionDate, executionCity, executionState, executionCounty
  } = data;

  // Generate successor agent section
  let successorSection = '';
  if (secondAgent && !thirdAgent) {
    successorSection = `If ${primaryAgent} dies, becomes incapacitated, resigns, refuses to act, or is removed by court order, I appoint ${secondAgent} as successor agent.`;
  } else if (secondAgent && thirdAgent) {
    successorSection = `If ${primaryAgent} dies, becomes incapacitated, resigns, refuses to act, or is removed by court order, I appoint ${secondAgent} as successor agent. If both of the above named agents die, become legally disabled, resign, or refuse to act, I appoint ${thirdAgent} as successor agent.`;
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Principal name - large, centered
        new Paragraph({
          children: [
            new TextRun({
              text: testatorName,
              bold: true,
              size: 32,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        // Document title - centered, bold
        new Paragraph({
          children: [
            new TextRun({
              text: "STATUTORY POWER OF ATTORNEY",
              bold: true,
              size: 28,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 }
        }),

        // Notice section
        new Paragraph({
          children: [
            new TextRun({
              text: "NOTICE: THE POWERS GRANTED BY THIS DOCUMENT ARE BROAD AND SWEEPING.",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: " THEY ARE EXPLAINED IN THE DURABLE POWER OF ATTORNEY ACT, SUBTITLE P, TITLE 2, TEXAS ESTATES CODE. ",
              font: "Century Gothic"
            }),
            new TextRun({
              text: "IF YOU HAVE ANY QUESTIONS ABOUT THESE POWERS, OBTAIN COMPETENT LEGAL ADVICE.",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: " THIS DOCUMENT DOES NOT AUTHORIZE ANYONE TO MAKE MEDICAL AND OTHER HEALTH-CARE DECISIONS FOR YOU. YOU MAY REVOKE THIS POWER OF ATTORNEY IF YOU LATER WISH TO DO SO. IF YOU WANT YOUR AGENT TO HAVE THE AUTHORITY TO SIGN HOME EQUITY LOAN DOCUMENTS ON YOUR BEHALF, THIS POWER OF ATTORNEY MUST BE SIGNED BY YOU AT THE OFFICE OF THE LENDER, AN ATTORNEY AT LAW, OR A TITLE COMPANY.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        // Main appointment text
        new Paragraph({
          children: [
            new TextRun({
              text: `I, ${testatorName}, appoint ${primaryAgent} as my agent to act for me in any lawful way with respect to all of the following powers that I have initialed below.`,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        // Successor section
        ...(successorSection ? [new Paragraph({
          children: [new TextRun({ text: successorSection, font: "Century Gothic" })],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        })] : []),

        // Marriage termination clause
        new Paragraph({
          children: [
            new TextRun({
              text: "If I am married to an agent, and my marriage is dissolved, terminated or voided, the authority of that agent under this power of attorney shall also terminate when my marriage terminates, unless I have provided otherwise in this document.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        // Powers instructions
        new Paragraph({
          children: [
            new TextRun({
              text: "TO GRANT ALL OF THE FOLLOWING POWERS, INITIAL THE LINE IN FRONT OF (O) AND IGNORE THE LINES IN FRONT OF THE OTHER POWERS LISTED IN (A) THROUGH (N).",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "TO GRANT A POWER, YOU MUST INITIAL THE LINE IN FRONT OF THE POWER YOU ARE GRANTING.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "TO WITHHOLD A POWER, DO NOT INITIAL THE LINE IN FRONT OF THE POWER. YOU MAY, BUT DO NOT NEED TO, CROSS OUT EACH POWER WITHHELD.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        // Powers list
        new Paragraph({
          children: [new TextRun({ text: "_______     (A) Real property transactions;", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     (B) Tangible personal property transactions;", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     (C) Stock and bond transactions;", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     (D) Commodity and option transactions;", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     (E) Banking and other financial institution transactions;", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     (F) Business operating transactions;", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     (G) Insurance and annuity transactions;", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     (H) Estate, trust, and other beneficiary transactions;", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     (I) Claims and litigation;", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     (J) Personal and family maintenance;", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
      new Paragraph({
      children: [
      new TextRun({ text: "_______     (K) Benefits from social security, Medicare, Medicaid, or other", font: "Century Gothic" }),
     new TextRun({ text: "\n                    governmental programs or civil or military service;", font: "Century Gothic" })
     ],
     spacing: { after: 100 }
     }),
        new Paragraph({
          children: [new TextRun({ text: "_______     (L) Retirement plan transactions;", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     (M) Tax matters;", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
       new Paragraph({
      children: [
      new TextRun({ text: "_______     (N) Digital assets and the content of an electronic", font: "Century Gothic" }),
     new TextRun({ text: "\n                    communication;", font: "Century Gothic" })
     ],
    spacing: { after: 200 }
    }),
        new Paragraph({
          children: [
            new TextRun({
              text: "_______     (O) ALL OF THE POWERS LISTED IN (A) THROUGH (N).",
              bold: true,
              font: "Century Gothic"
            })
          ],
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "YOU DO NOT HAVE TO INITIAL THE LINE IN FRONT OF ANY OTHER POWER IF YOU INITIAL LINE (O).",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        // Grant of Specific Authority - centered heading
        new Paragraph({
          children: [
            new TextRun({
              text: "GRANT OF SPECIFIC AUTHORITY",
              bold: true,
              size: 24,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "My agent MAY NOT do any of the following specific acts for me UNLESS I have INITIALED the specific authority listed below:",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "(CAUTION: Granting any of the following will give your agent the authority to take actions that could significantly reduce your property or change how your property is distributed at your death. INITIAL ONLY the specific authority you WANT to give your agent. If you DO NOT want to grant your agent one or more of the following powers, you may also CROSS OUT a power you DO NOT want to grant.)",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 300 }
        }),

        // Specific authorities
        new Paragraph({
          children: [new TextRun({ text: "_______     Create, amend, revoke, or terminate an inter vivos trust", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     Create or change rights of survivorship", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     Create or change a beneficiary designation", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     Authorize another person to exercise the authority granted under this power of attorney", font: "Century Gothic" })],
          spacing: { after: 400 }
        }),

        // Compensation - centered heading
        new Paragraph({
          children: [
            new TextRun({
              text: "COMPENSATION",
              bold: true,
              size: 24,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Special instructions applicable to agent compensation (initial in front of one of the following sentences to have it apply; if no selection is made, each agent will be entitled to compensation that is reasonable under the circumstances):",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "_______     My agent is entitled to reimbursement of reasonable expenses incurred on my behalf and to compensation that is reasonable under the circumstances.", font: "Century Gothic" })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "_______     My agent is entitled to reimbursement of reasonable expenses incurred on my behalf but shall receive no compensation for serving as my agent.", font: "Century Gothic" })],
          spacing: { after: 400 }
        }),

        // Co-Agents - centered heading
        new Paragraph({
          children: [
            new TextRun({
              text: "CO-AGENTS",
              bold: true,
              size: 24,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Special instructions applicable to co-agents (If you have appointed co-agents to act, initial in front of one of the following sentences to have it apply; If no selection is made, each agent will be entitled to act independently):",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "_______     Each of my co-agents may act independently for me.", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     My co-agents may act for me only if the co-agents act jointly.", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "_______     My co-agents may act for me only if a majority of the co-agents act jointly.", font: "Century Gothic" })],
          spacing: { after: 400 }
        }),

        // Gifts - centered heading
        new Paragraph({
          children: [
            new TextRun({
              text: "GIFTS",
              bold: true,
              size: 24,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Special instructions applicable to gifts (initial in front of the following sentence to have it apply):",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "_______     I grant my agent the power to apply my property to make gifts outright to or for the benefit of a person, including by the exercise of a presently exercisable general power of appointment held by me, except that the amount of a gift to an individual may not exceed the amount of annual exclusions allowed from the federal gift tax for the calendar year of the gift.", font: "Century Gothic" })],
          spacing: { after: 400 }
        }),

        // Signature section
        new Paragraph({
          children: [
            new TextRun({
              text: `Signed on ${executionDate} in ${executionCity}, ${executionState}.`,
              font: "Century Gothic"
            })
          ],
          spacing: { before: 600, after: 400 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "_____________________________", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: testatorName, font: "Century Gothic" })],
          spacing: { after: 400 }
        }),

        // Notary section
        new Paragraph({
          children: [new TextRun({ text: `State of ${executionState}`, font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: `County of ${executionCounty}`, font: "Century Gothic" })],
          spacing: { after: 300 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: `Acknowledged before me on ${executionDate} by ${testatorName}.`, font: "Century Gothic" })
          ],
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "_____________________________", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: `Notary Public, State of ${executionState}`, font: "Century Gothic" })]
        })
      ]
    }]
  });
  return await Packer.toBuffer(doc);
}

app.post('/submit', async (req, res) => {
  try {
    const document = await generateDocument(req.body);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'don.r.hancock@gmail.com',
      subject: 'Power of Attorney Request',
      text: 'Please find the Power of Attorney document attached.',
      attachments: [{
        filename: 'Power_of_Attorney.docx',
        content: document,
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }]
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

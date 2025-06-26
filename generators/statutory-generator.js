const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');

async function generateStatutoryPOA(data) {
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

        new Paragraph({
          children: [
            new TextRun({
              text: "NOTICE:",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: " THE POWERS GRANTED BY THIS DOCUMENT ARE BROAD AND SWEEPING. THEY ARE EXPLAINED IN THE DURABLE POWER OF ATTORNEY ACT, SUBTITLE P, TITLE 2, TEXAS ESTATES CODE. IF YOU HAVE ANY QUESTIONS ABOUT THESE POWERS, OBTAIN COMPETENT LEGAL ADVICE. THIS DOCUMENT DOES NOT AUTHORIZE ANYONE TO MAKE MEDICAL AND OTHER HEALTH-CARE DECISIONS FOR YOU. YOU MAY REVOKE THIS POWER OF ATTORNEY IF YOU LATER WISH TO DO SO. IF YOU WANT YOUR AGENT TO HAVE THE AUTHORITY TO SIGN HOME EQUITY LOAN DOCUMENTS ON YOUR BEHALF, THIS POWER OF ATTORNEY MUST BE SIGNED BY YOU AT THE OFFICE OF THE LENDER, AN ATTORNEY AT LAW, OR A TITLE COMPANY.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

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

        ...(successorSection ? [new Paragraph({
          children: [new TextRun({ text: successorSection, font: "Century Gothic" })],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        })] : []),

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
          children: [new TextRun({ text: "_______     (K) Benefits from social security, Medicare, Medicaid, or other governmental programs or civil or military service;", font: "Century Gothic" })],
          spacing: { after: 100 },
          indent: { left: 1296, hanging: 1296 }
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
          children: [new TextRun({ text: "_______     (N) Digital assets and the content of an electronic communication;", font: "Century Gothic" })],
          spacing: { after: 200 },
          indent: { left: 1296, hanging: 1296 }
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
            new TextRun({ text: `The foregoing Statutory Power of Attorney was acknowledged before me on ${executionDate} by ${testatorName}.`, font: "Century Gothic" })
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

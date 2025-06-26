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

        // ADD THIS MISSING CONTENT:
        new Paragraph({
          children: [
            new TextRun({
              text: "IF I WANT TO GRANT A GENERAL AUTHORITY WITH RESPECT TO DIGITAL ASSETS AND THE CONTENT OF AN ELECTRONIC COMMUNICATION THAT OVERRIDES CONTRARY PROVISIONS IN TERMS-OF-SERVICE AGREEMENTS, I MUST INITIAL THE LINE IN FRONT OF (N) AND ALSO INITIAL THE FOLLOWING:",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "_______     I grant general authority with respect to digital assets and the content of an electronic communication.", font: "Century Gothic" })],
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "ON THE FOLLOWING LINES YOU MAY GIVE SPECIAL INSTRUCTIONS LIMITING OR EXTENDING THE POWERS GRANTED TO YOUR AGENT.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "________________________________________________________________________", font: "Century Gothic" })],
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "UNLESS YOU DIRECT OTHERWISE ABOVE, THIS POWER OF ATTORNEY IS EFFECTIVE IMMEDIATELY AND WILL CONTINUE UNTIL IT IS REVOKED.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "CHOOSE ONE OF THE FOLLOWING ALTERNATIVES BY CROSSING OUT THE ALTERNATIVE NOT CHOSEN:",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "(A) This power of attorney is not affected by my subsequent disability or incapacity.",
              font: "Century Gothic"
            })
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "(B) This power of attorney becomes effective upon my disability or incapacity.",
              font: "Century Gothic"
            })
          ],
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "YOU SHOULD SELECT ALTERNATIVE (A) IF THIS POWER OF ATTORNEY IS TO BECOME EFFECTIVE ON THE DATE IT IS EXECUTED.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "IF NEITHER (A) NOR (B) IS CROSSED OUT, IT WILL BE ASSUMED THAT YOU CHOSE ALTERNATIVE (A).",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "If Alternative (B) is chosen and a definition of my disability or incapacity is not contained in this power of attorney, I shall be considered disabled or incapacitated for purposes of this power of attorney if a physician certifies in writing at a date later than the date this power of attorney is executed that, based on the physician's medical examination of me, I am mentally incapable of managing my financial affairs. I authorize the physician who examines me for this purpose to disclose my physical or mental condition to another person for purposes of this power of attorney. A third party who accepts this power of attorney is fully protected from any action taken under this power of attorney that is based on the determination made by a physician of my disability or incapacity.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "I agree that any third party who receives a copy of this document may act under it. Revocation of the power of attorney is not effective as to a third party until the third party learns of the revocation. I agree to indemnify the third party for any claims that arise against the third party because of reliance on this power of attorney.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
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
module.exports = { generateStatutoryPOA };

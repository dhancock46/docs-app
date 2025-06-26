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
              text: "You should select someone you trust to serve as your agent. Unless you specify otherwise, generally the agent's authority will continue until: (1) you die or revoke the power of attorney; (2) your agent resigns or is unable to act for you; or (3) a guardian is appointed for your estate.",
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
              text: "YOU DO NOT HAVE TO INITIAL THE LINE IN FRONT OF ANY OTHER POWER IF YOU INITIAL LINE (O).",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "GRANT OF SPECIFIC AUTHORITY",
              bold: true,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
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
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "________	Create, amend, revoke, or terminate an inter vivos trust", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "________	Create or change rights of survivorship", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "________	Create or change a beneficiary designation", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),

       new Paragraph({
       children: [new TextRun({ text: "________	Authorize another person to exercise the authority granted under this power of attorney", font: "Century Gothic" })],
       spacing: { after: 400 },
       indent: { left: 720 }
       }),

        new Paragraph({
          children: [
            new TextRun({
              text: "SPECIAL INSTRUCTIONS:",
              bold: true,
              font: "Century Gothic"
            })
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "COMPENSATION:",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: " Special instructions applicable to agent compensation (initial in front of one of the following sentences to have it apply; if no selection is made, each agent will be entitled to compensation that is reasonable under the circumstances):",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 },
          }),

       new Paragraph({
      children: [new TextRun({ text: "_______	My agent is entitled to reimbursement of reasonable expenses incurred on my behalf and to compensation that is reasonable under the circumstances.", font: "Century Gothic" })],
      spacing: { after: 100 },
      indent: { left: 720 }
      }),

     new Paragraph({
     children: [new TextRun({ text: "_______	My agent is entitled to reimbursement of reasonable expenses incurred on my behalf but shall receive no compensation for serving as my agent.", font: "Century Gothic" })],
     spacing: { after: 200 },
     indent: { left: 720 }
      }),
        new Paragraph({
          children: [
            new TextRun({
              text: "CO-AGENTS:",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: " Special instructions applicable to co-agents (If you have appointed co-agents to act, initial in front of one of the following sentences to have it apply; If no selection is made, each agent will be entitled to act independently):",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "_______		Each of my co-agents may act independently for me.", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "_______		My co-agents may act for me only if the co-agents act jointly.", font: "Century Gothic" })],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "_______		My co-agents may act for me only if a majority of the co-agents act jointly.", font: "Century Gothic" })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "GIFTS:",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: " Special instructions applicable to gifts (initial in front of the following sentence to have it apply):",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: "_______	I grant my agent the power to apply my property to make gifts outright to or for the benefit of a person, including by the exercise of a presently exercisable general power of appointment held by me, except that the amount of a gift to an individual may not exceed the amount of annual exclusions allowed from the federal gift tax for the calendar year of the gift.", font: "Century Gothic" })],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "GIFTS TO QUALIFY FOR PUBLIC BENEFITS:",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: " If my agent in my agent's sole discretion has determined that I need nursing home or other long-term medical care and that I will receive proper medical care whether I privately pay for such care or if I am a recipient of Title XIX (Medicaid) or other public benefits, then my agent shall have the power: (i) to take any and all steps necessary, in my agent's judgment, to obtain and maintain my eligibility for any and all public benefits and entitlement programs, including, if necessary, signing a deed with a retained life estate (also known as a \"Lady Bird Deed\") as well as creating and funding a qualified income trust or special needs trust for me or a disabled child, if any; (ii) to transfer with or without consideration my assets to my descendants (if any), or to my natural heirs at law or to the persons named as beneficiaries under my last will and testament or a revocable living trust which I may have established, including my agent; and (iii) to enter into a personal services contract for my benefit, including entering into such contract with my agent, and even if doing so may be considered self-dealing. Such public benefits and entitlement programs shall include, but are not limited to, Social Security, Supplemental Security Income, Medicare, Medicaid and Veterans benefits.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "LIMITATIONS:",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: " Notwithstanding any provision herein to the contrary, any authority granted to my agent shall be limited so as to prevent this power of attorney from causing my agent to be taxed on my income (unless my agent is my spouse) and from causing my assets to be subject to a general power of appointment by my agent, as that term is defined in Section 2041 of the Internal Revenue Code of 1986, as amended.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "ADDITIONAL POWERS:",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: " ON THE FOLLOWING LINES YOU MAY GIVE SPECIAL INSTRUCTIONS LIMITING OR EXTENDING THE POWERS GRANTED TO YOUR AGENT.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "In addition to the powers granted above, I grant to my agent the following powers:",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Power to Appoint Substitute Agent. The power to appoint or substitute one or more agents to serve as my agent under this power of attorney; provided, however, such power shall be exercisable only by the then-serving agent (or if more than one agent is serving, by all such co-agents acting unanimously), and any such appointment or substitution shall override other provisions contained herein which may attempt to name one or more successor agents. Any such appointment or substitution may be revoked by me or my agent at any time and for any reason, and such appointment or substitution shall not terminate upon the death, disability, incapacity or resignation of the agent or co-agents who made the appointment or substitution. Any such appointment or substitution shall be evidenced by acknowledged written instrument.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Power to Perform All Other Acts. In addition to the powers enumerated above, I hereby give and grant unto my agent full power and authority to do and perform all and every act and thing whatsoever requisite and necessary to be done, as fully, to all intents and purposes, as I might or could do if personally present, hereby ratifying and confirming whatsoever my agent shall and may do by virtue hereof; provided, however, and notwithstanding the foregoing, if I have withheld a particular power or powers in this power of attorney, then my agent shall not have such power or powers by virtue of the power and authority conferred by this sentence.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

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

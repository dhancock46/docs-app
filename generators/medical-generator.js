const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');

async function generateMedicalPOA(data) {
  const {
    testatorName, primaryAgent, firstAlternateAgent, secondAlternateAgent,
    executionDate, executionCity, executionState, executionCounty, alternateChoice
  } = data;

  // Create alternate agent paragraphs based on user choice
  let alternateAgentParagraphs = [];

  if (alternateChoice === 'none') {
    alternateAgentParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "I elect not to name any alternate agents.",
            font: "Century Gothic"
          })
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 400 }
      })
    );
  } else {
    // Add the explanation paragraph
    alternateAgentParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "I understand that I am not required to designate an alternate agent; however, I have chosen to do so. My alternate agent shall have the authority to make the same health care decisions as the designated agent if the designated agent is unable or unwilling to act as my agent.",
            font: "Century Gothic"
          })
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 }
      })
    );

    // Add the ordering paragraph
    alternateAgentParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "If the person designated as my agent is unable or unwilling to make health care decisions for me, I designate the following persons to serve as my agent to make health care decisions for me as authorized by this document, who serve in the following order:",
            font: "Century Gothic"
          })
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 200 }
      })
    );

    // Add first alternate agent if provided
    if (firstAlternateAgent) {
      alternateAgentParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "FIRST ALTERNATE AGENT:",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: ` ${firstAlternateAgent}`,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 100 }
        })
      );
    }

    // Add second alternate agent if provided
    if (secondAlternateAgent) {
      alternateAgentParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "SECOND ALTERNATE AGENT:",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: ` ${secondAlternateAgent}`,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        })
      );
    } else {
      // Add spacing if no second alternate
      alternateAgentParagraphs.push(
        new Paragraph({
          children: [new TextRun({ text: "", font: "Century Gothic" })],
          spacing: { after: 400 }
        })
      );
    }
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
              text: "MEDICAL POWER OF ATTORNEY",
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
              text: `I, ${testatorName}, appoint ${primaryAgent} as my agent to make any and all health care decisions for me, except to the extent I state otherwise in this document. This durable power of attorney for health care takes effect if I become unable to make my own health care decisions and this fact is certified in writing by my physician.`,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "LIMITATIONS ON THE DECISION MAKING AUTHORITY OF MY AGENT ARE AS FOLLOWS:",
              bold: true,
              font: "Century Gothic"
            }),
          new TextRun({
  text: " None.",
  font: "Century Gothic"
})
],
alignment: AlignmentType.JUSTIFIED,
spacing: { after: 400 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "DESIGNATION OF ALTERNATE AGENT",
      bold: true,
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 }
}),
        ...alternateAgentParagraphs,

new Paragraph({
  children: [
    new TextRun({
      text: "LOCATION OF DOCUMENT",
      bold: true,
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.CENTER,
  spacing: { after: 400 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "The original of this document is in my custody.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "My agent is authorized to deliver signed copies to my present or any future physician, or other health or residential care provider.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 400 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "DURATION",
      bold: true,
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.CENTER,
  spacing: { after: 400 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "I understand that this power of attorney exists indefinitely from the date I execute this document unless I establish a shorter time or revoke the power of attorney. If I am unable to make health care decisions for myself when this power of attorney expires, the authority I have granted my agent continues to exist until the time I become able to make health care decisions for myself.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "This power of attorney ends on the following date:",
      font: "Century Gothic"
    }),
    new TextRun({
      text: " Not Applicable",
      bold: true,
      font: "Century Gothic"
    }),
  ],
  alignment: AlignmentType.JUSTIFIED,    // ← ADD THIS
  spacing: { after: 400 }                // ← ADD THIS
}),
new Paragraph({
  children: [
    new TextRun({
      text: "AUTHORITY CONCERNING MEDICAL INFORMATION AND RECORDS",
      bold: true,
      font: "Century Gothic"
    }),
  ],
  alignment: AlignmentType.CENTER,
  spacing: { after: 400 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "Despite the provisions of the Health Insurance Portability and Accountability Act (\"HIPAA\"), I want my health care providers to provide any and all of my protected medical information which my agent may request. Therefore, I am making this authorization pursuant to HIPAA and the regulations promulgated under HIPAA, including 45 CFR 164.501 and 45 CFR Sec. 164.508.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "1.\tIn this authorization: a. A \"covered entity\" shall mean any health care provider as defined by HIPAA, including but not limited to a doctor (including but not limited to a physician, podiatrist, chiropractor, or osteopath), psychiatrist, psychologist, dentist, therapist, nurse, hospital, clinic, pharmacy, laboratory, ambulance service, assisted living facility, residential care facility, bed and board facility, nursing home, medical insurance company or any other health care provider or affiliate. b. \"Health information\" means any and all information described in or protected by HIPAA, including but not limited to any and all health care information, reports and/or records concerning my medical history, condition, diagnosis, testing, prognosis, treatment, billing information and identity of health care providers, whether past, present or future and any other information which is in any way related to my health care. c. My \"agent\" shall mean a person designated as my health care agent under this Medical Power of Attorney.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "2.\t\"Individually identifiable health information\" means health information that can be linked to me or from which I could reasonably be identified.",
      font: "Century Gothic"
    })
  ],

new Paragraph({
  children: [
    new TextRun({
      text: "3.\tI authorize and direct each covered entity to disclose to my agent any and all health information my agent may request.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "4.\tI also authorize and direct each covered entity, together with its employees and other agents, to discuss my health information with my agent and to answer questions about my health information which my agent may ask, whether or not I am incapacitated at the time.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "5.\tSubject to any limitation stated in this document, my agent shall have, in addition to any power and authority granted in this document or by law, the specific power and authority to do all of the following: a. Request, review, and receive any information, verbal or written, regarding my physical or mental health, including, but not limited to, individually identifiable health information or other medical or hospital records; and b. Execute on my behalf any release or other documents that may be required to obtain individually identifiable health information or other medical or hospital records. c. Disclose or consent to the disclosure of individually identifiable health information or other medical or hospital records.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "6.\tBy including this authorization concerning medical records, I acknowledge that the health information used or disclosed pursuant to this authorization may be subject to re-disclosure by my agent and the health information once disclosed will no longer be protected by HIPAA or the rules promulgated under HIPAA. No covered entity shall require my agent to indemnify the covered entity or agree to perform any act in order for the covered entity to comply with this authorization.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "7.\tI release any covered entity that acts in reliance on this authorization from any liability that may accrue from releasing any of my health information and for any actions taken by my agent.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "8.\tMy agent, or any successor agent, is authorized to bring a legal action in any appropriate forum against any covered entity that refuses to recognize and accept this authorization. Additionally, my agent is authorized to sign any documents that he or she deems appropriate to obtain the health information.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "9.\tThis authorization shall terminate on the first to occur of: (1) two years following my death or (2) upon my written revocation actually received by the covered entity. Proof of receipt of my written revocation may be by certified mail, registered mail, facsimile, or any other receipt evidencing actual receipt by the covered entity. This revocation shall be effective upon the actual receipt of the notice by the covered entity except to the extent that the covered entity has taken action in reliance on it. This authorization is not affected by my subsequent disability or incapacity.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 200 }
}),

new Paragraph({
  children: [
    new TextRun({
      text: "10.\tA copy or facsimile of this medical power or attorney, including the authorization concerning medical records, original authorization shall be accepted as though it were an original document.",
      font: "Century Gothic"
    })
  ],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 400 }
}),
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
            new TextRun({ text: `The foregoing Medical Power of Attorney was acknowledged before me on ${executionDate} by ${testatorName}.`, font: "Century Gothic" })
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

module.exports = { generateMedicalPOA };

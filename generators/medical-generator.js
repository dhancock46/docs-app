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

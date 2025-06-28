const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');

async function generateDirectiveToPhysicians(data) {
 const {
  testatorName, primaryAgent, firstAlternateAgent, secondAlternateAgent,
  executionDate, executionCity, executionState, executionCounty, alternateChoice,
  terminalConditionChoice, irreversibleConditionChoice
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
          spacing: { after: 0 }
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
              text: "Directive to Physicians",
              bold: true,
              size: 28,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "and Family or Surrogates",
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
              text: `I, ${testatorName}, recognize that the best health care is based upon a partnership of trust and communication with my physician. My physician and I will make health care or treatment decisions together as long as I am of sound mind and able to make my wishes known. If there comes a time that I am unable to make medical decisions for myself because of illness or injury, I direct that the following treatment preferences be honored.`,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "I wish to live my life with dignity and comfort. My primary goal is to avoid unnecessary suffering and to ensure that my quality of life is maintained to the greatest extent possible. I prefer treatments that focus on comfort, pain relief, and emotional well-being. I trust my healthcare providers to use their medical judgment while respecting these principles. I understand the full import of this directive, and I am emotionally and mentally competent to make this directive.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Treatment preferences if I become unable to make my wishes known",
              bold: true,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        // Conditional terminal condition paragraph
        ...(terminalConditionChoice === 'withhold' ? [
          new Paragraph({
            children: [
              new TextRun({
                text: "If, in the judgment of my physician, I am suffering with a terminal condition from which I am expected to die within six months, even with life-sustaining treatment provided in accordance with prevailing standards of medical care I request that all life-sustaining treatments other than those needed to keep me comfortable be discontinued or withheld, and my physician allow me to die as gently as possible.",
                font: "Century Gothic"
              })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
          })
        ] : [
          new Paragraph({
            children: [
              new TextRun({
                text: "If, in the judgment of my physician, I am suffering with a terminal condition from which I am expected to die within six months, even with life-sustaining treatment provided in accordance with prevailing standards of medical care I request that I be kept alive in this terminal condition using available life-sustaining treatment unless: (a) I or my representative elect hospice care; or (b) if, in the judgment of my physician, my death is imminent within minutes to hours, even with the use of all available life-sustaining treatment. If either of these two events occur, all treatments may be withheld or removed except those needed to keep me comfortable.",
                font: "Century Gothic"
              })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
          })
        ]),

        // Conditional irreversible condition paragraph
        ...(irreversibleConditionChoice === 'withhold' ? [
          new Paragraph({
            children: [
              new TextRun({
                text: "If, in the judgment of my physician, I am suffering with an irreversible condition (other than a terminal condition, which is provided for above) so that I cannot care for myself or make decisions for myself and am expected to die (but not necessarily within 6 months) without life-sustaining treatment provided in accordance with prevailing standards of care I request that all life-sustaining treatments other than those needed to keep me comfortable be discontinued or withheld and my physician allow me to die as gently as possible.",
                font: "Century Gothic"
              })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
          })
        ] : [
          new Paragraph({
            children: [
              new TextRun({
                text: "If, in the judgment of my physician, I am suffering with an irreversible condition (other than a terminal condition, which is provided for above) so that I cannot care for myself or make decisions for myself and am expected to die (but not necessarily within 6 months) without life-sustaining treatment provided in accordance with prevailing standards of care I request that I be kept alive in this irreversible condition using available life-sustaining treatment unless: (a) I or my representative elect hospice care; or (b) if, in the judgment of my physician, my death is imminent within minutes to hours, even with the use of all available life-sustaining treatment. If either of these two events occur, all treatments may be withheld or removed except those needed to keep me comfortable.",
                font: "Century Gothic"
              })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
          })
        ]),
        new Paragraph({
          children: [
            new TextRun({
              text: "DESIGNATION OF AGENT",
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
              text: `I designate ${primaryAgent} as my primary agent to make healthcare decisions for me in accordance with this directive when I am unable to make them for myself.`,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        ...alternateAgentParagraphs,

        // Placeholder for additional content sections
        // (Will be added as you provide more form content)

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
            new TextRun({ text: `The foregoing Directive to Physicians was acknowledged before me on ${executionDate} by ${testatorName}.`, font: "Century Gothic" })
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

module.exports = { generateDirectiveToPhysicians };

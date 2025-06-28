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
              text: "Guidance for Specific Situations",
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
              text: "I recognize that life can present complex and unforeseen medical scenarios. I provide the following specific instructions to assist my physicians and family:",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "1. ",
              font: "Century Gothic"
            }),
            new TextRun({
              text: "Temporary Reversible Conditions",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: ": If a condition arises that temporarily impairs my decision-making but has a high likelihood of recovery, I wish to receive treatment, including life-sustaining treatment, with the goal of recovery.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "2. ",
              font: "Century Gothic"
            }),
            new TextRun({
              text: "Experimental Treatments",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: ": If no conventional treatment options remain, I am open to receiving experimental treatments only if they offer a reasonable chance of meaningful recovery and do not prolong suffering.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Keeping me comfortable:",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: " In the situations described above, keeping me comfortable shall include the administration of pain management medication, anxiety relief, the performance of a medical procedure necessary to provide comfort care, or any other medical care provided or comfort measures to alleviate my pain even if they may unintentionally shorten my life. My comfort and dignity should be prioritized over prolonging life.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Effect of electing hospice care.",
              bold: true,
              font: "Century Gothic"
            }),
            new TextRun({
              text: " After signing this directive, if my representative or I elect hospice care, I understand and agree that only those treatments needed to keep me comfortable would be provided, and I would not be given available life-sustaining treatments.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

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
              text: `If I have not provided evidence that I have a Medical Power of Attorney, and I am unable to make my wishes known, I designate ${primaryAgent} as the person to make a treatment decision on my behalf, with my personal values, to withhold or withdraw life-sustaining treatment in accordance with this directive.`,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        // Conditional alternate agent paragraphs
        ...(alternateChoice === 'none' ? [] : [
          // First alternate agent
          ...(firstAlternateAgent ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `If ${primaryAgent} is unable or unwilling to serve as the person to make a treatment decision on my behalf, I designate ${firstAlternateAgent}.`,
                  font: "Century Gothic"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 200 }
            })
          ] : []),
          
          // Second alternate agent
          ...(secondAlternateAgent ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `If neither of the persons named above is willing to make treatment decisions on my behalf, I designate ${secondAlternateAgent} to make treatment decisions on my behalf.`,
                  font: "Century Gothic"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 }
            })
          ] : [
            new Paragraph({
              children: [new TextRun({ text: "", font: "Century Gothic" })],
              spacing: { after: 400 }
            })
          ])
        ]),
        new Paragraph({
          children: [
            new TextRun({
              text: "If the above persons are not available, or if I have not designated a spokesperson, I understand that a spokesperson will be chosen for me following standards specified under the laws of Texas. I understand that under Texas law this directive has no effect if I have been diagnosed as pregnant.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "In the absence of my ability to give directions regarding the use of life-sustaining treatment, it is my intention that this directive shall be honored by my family and physicians.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Any terms used in this directive which are defined in the Texas Health and Safety Code shall have the meaning specified in that statute.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "This directive will remain in effect until I revoke it. No other person may do so. I understand that I may revoke this directive at any time.",
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

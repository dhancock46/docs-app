const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');

async function generateMedicalPOA(data) {
  const {
    testatorName, primaryAgent, firstAlternateAgent, secondAlternateAgent,
    executionDate, executionCity, executionState, executionCounty, alternateChoice
  } = data;

  let alternateSection = '';
  if (alternateChoice === 'yes') {
    if (firstAlternateAgent && !secondAlternateAgent) {
      alternateSection = `If ${primaryAgent} dies, becomes incapacitated, resigns, refuses to act, or is removed by court order, I appoint ${firstAlternateAgent} as my alternate health care agent.`;
    } else if (firstAlternateAgent && secondAlternateAgent) {
      alternateSection = `If ${primaryAgent} dies, becomes incapacitated, resigns, refuses to act, or is removed by court order, I appoint ${firstAlternateAgent} as my first alternate health care agent. If ${firstAlternateAgent} also dies, becomes incapacitated, resigns, refuses to act, or is removed by court order, I appoint ${secondAlternateAgent} as my second alternate health care agent.`;
    } else if (firstAlternateAgent) {
      alternateSection = `If ${primaryAgent} dies, becomes incapacitated, resigns, refuses to act, or is removed by court order, I appoint ${firstAlternateAgent} as my alternate health care agent.`;
    }
  } else {
    alternateSection = 'I elect not to name any alternate agents.';
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
              text: `I, ${testatorName}, appoint ${primaryAgent} as my agent to make any and all health care decisions for me, except to the extent I state otherwise in this document.`,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [new TextRun({ text: alternateSection, font: "Century Gothic" })],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        // This is where you'll add your additional Medical POA provisions
        // We'll expand this section when you're ready to add more content

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

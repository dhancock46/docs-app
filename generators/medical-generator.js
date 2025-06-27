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

// Conditional content based on alternateChoice
...(alternateChoice === 'no' ? [
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
] : [
  new Paragraph({
    children: [
      new TextRun({
        text: "I understand that I am not required to designate an alternate agent; however, I have chosen to do so. My alternate agent shall have the authority to make the same health care decisions as the designated agent if the designated agent is unable or unwilling to act as my agent.",
        font: "Century Gothic"
      })
    ],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 }
  }),
  
  new Paragraph({
    children: [
      new TextRun({
        text: "If the person designated as my agent is unable or unwilling to make health care decisions for me, I designate the following persons to serve as my agent to make health care decisions for me as authorized by this document, who serve in the following order:",
        font: "Century Gothic"
      })
    ],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 }
  }),

  ...(firstAlternateAgent ? [
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
  ] : []),

  ...(secondAlternateAgent ? [
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
  ] : [
    new Paragraph({
      children: [new TextRun({ text: "", font: "Century Gothic" })],
      spacing: { after: 400 }
    })
  ])
]),

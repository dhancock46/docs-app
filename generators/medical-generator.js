const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');

async function generateMedicalPOA(data) {
  const {
    testatorName, primaryAgent, firstAlternateAgent, secondAlternateAgent,
    executionDate, executionCity, executionState, executionCounty, alternateChoice,
    signatureChoice
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
              text: "AUTHORITY CONCERNING MEDICAL INFORMATION AND RECORDS",
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
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

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

        new Paragraph({
          children: [
            new TextRun({
              text: "ADDITIONAL AUTHORITY OF MY AGENT",
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
              text: "My agent is also authorized to:",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "1. Execute documents such as \"Do Not Resuscitate Orders\", \"Refusal to Permit Treatment\", \"Leaving Hospital against Medical Advice\", or any necessary waiver or release from liability required by a hospital or physician;",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "2. Enter into contracts of any kind to provide for my health care;",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "3. Employ and discharge physicians, nurses and other health care providers and medical personnel; and",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "4. Grant releases to health care professionals or institutions to assure that my wishes and needs are fulfilled, including, but not limited to any release or waiver of liability permitted under the Health Insurance Portability and Accountability Act (\"HIPAA\").",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "DETERMINATION OF INCAPACITY",
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
              text: "When in the process of determining my incapacity, all individually identifiable health information and medical records may be released to the person who is my nominated agent or successor or alternate agent, to include any written opinion relating to my incapacity that the person so nominated may have requested. This release authority applies to any information governed by HIPAA and applies even if that person has not yet been appointed as my successor or alternate agent.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "PRIOR DESIGNATIONS REVOKED",
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
              text: "I revoke any prior durable power of attorney for health care.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "DISCLOSURE STATEMENT",
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
              text: "THIS MEDICAL POWER OF ATTORNEY IS AN IMPORTANT LEGAL DOCUMENT. BEFORE SIGNING THIS DOCUMENT, YOU SHOULD KNOW THESE IMPORTANT FACTS:",
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
              text: "Except to the extent you state otherwise, this document gives the person you name as your agent the authority to make any and all health care decisions for you in accordance with your wishes, including your religious and moral beliefs, when you are unable to make the decisions for yourself. Because \"health care\" means any treatment, service, or procedure to maintain, diagnose, or treat your physical or mental condition, your agent has the power to make a broad range of health care decisions for you. Your agent may consent, refuse to consent, or withdraw consent to medical treatment and may make decisions about withdrawing or withholding life-sustaining treatment. Your agent may not consent to voluntary inpatient mental health services, convulsive treatment, psychosurgery, or abortion. A physician must comply with your agent's instructions or allow you to be transferred to another physician. Your agent's authority is effective when your doctor certifies that you lack the competence to make health care decisions.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Your agent is obligated to follow your instructions when making decisions on your behalf. Unless you state otherwise, your agent has the same authority to make decisions about your health care as you would have if you were able to make health care decisions for yourself.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "It is important that you discuss this document with your physician or other health care provider before you sign the document to ensure that you understand the nature and range of decisions that may be made on your behalf. If you do not have a physician, you should talk with someone else who is knowledgeable about these issues and can answer your questions. You do not need a lawyer's assistance to complete this document, but if there is anything in this document that you do not understand, you should ask a lawyer to explain it to you.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "The person you appoint as agent should be someone you know and trust. The person must be 18 years of age or older or a person under 18 years of age who has had the disabilities of minority removed. If you appoint your health or residential care provider (e.g., your physician or an employee of a home health agency, hospital, nursing facility, or residential care facility, other than a relative), that person has to choose between acting as your agent or as your health or residential care provider; the law does not allow a person to serve as both at the same time.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "You should inform the person you appoint that you want the person to be your health care agent. You should discuss this document with your agent and your physician and give each a signed copy. You should indicate on the document itself the people and institutions that you intend to have signed copies. Your agent is not liable for health care decisions made in good faith on your behalf.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Once you have signed this document, you have the right to make health care decisions for yourself as long as you are able to make those decisions, and treatment cannot be given to you or stopped over your objection. You have the right to revoke the authority granted to your agent by informing your agent or your health or residential care provider orally or in writing or by your execution of a subsequent medical power of attorney. Unless you state otherwise in this document, your appointment of a spouse is revoked if your marriage is dissolved, annulled, or declared void.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "This document may not be changed or modified. If you want to make changes in this document, you must execute a new medical power of attorney.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "You may wish to designate an alternate agent in the event that your agent is unwilling, unable, or ineligible to act as your agent. If you designate an alternate agent, the alternate agent has the same authority as the agent to make health care decisions for you.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "THIS POWER OF ATTORNEY IS NOT VALID UNLESS:",
              bold: true,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "(1) YOU SIGN IT AND HAVE YOUR SIGNATURE ACKNOWLEDGED BEFORE A NOTARY PUBLIC; OR",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "(2) YOU SIGN IT IN THE PRESENCE OF TWO COMPETENT ADULT WITNESSES.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "THE FOLLOWING PERSONS MAY NOT ACT AS ONE OF THE WITNESSES:",
              bold: true,
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "(1) the person you have designated as your agent; (2) a person related to you by blood or marriage; (3) a person entitled to any part of your estate after your death under a will or codicil executed by you or by operation of law; (4) your attending physician; (5) an employee of your attending physician; (6) an employee of a health care facility in which you are a patient if the employee is providing direct patient care to you or is an officer, director, partner, or business office employee of the health care facility or of any parent organization of the health care facility; or (7) a person who, at the time this medical power of attorney is executed, has a claim against any part of your estate after your death.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "By signing below, I acknowledge that I have read and understand the information contained in the above disclosure statement.",
              font: "Century Gothic"
            })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "(YOU MUST DATE AND SIGN THIS POWER OF ATTORNEY. YOU MAY SIGN IT AND HAVE YOUR SIGNATURE ACKNOWLEDGED BEFORE A NOTARY PUBLIC OR YOU MAY SIGN IT IN THE PRESENCE OF TWO COMPETENT ADULT WITNESSES.)",
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
      text: `I have signed my name to this durable power of attorney for health care, on ${executionDate}, in ${executionCity}, ${executionState}.`,
      font: "Century Gothic"
    })
  ],
  spacing: { before: 600, after: 400 }
}),

new Paragraph({
  children: [new TextRun({ text: "_____________________________", font: "Century Gothic" })],
  keepNext: true
  spacing: { after: 100 }
}),
new Paragraph({
  children: [new TextRun({ text: testatorName, font: "Century Gothic" })],
  spacing: { after: 400 }
}),

// Conditional witness or notary section
...(signatureChoice === 'witnesses' ? [
  new Paragraph({
    children: [
      new TextRun({
        text: "WITNESS OPTION",
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
        text: "STATEMENT OF WITNESSES",
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
        text: "I declare under penalty of perjury that the principal has identified himself to me, that the principal signed or acknowledged this durable power of attorney in my presence, that I believe the principal to be of sound mind, that the principal has affirmed that the principal is aware of the nature of the document and is signing it voluntarily and free from duress, that the principal requested that I serve as witness to the principal's execution of this document, that I am not the person appointed as agent by this document, and that I am not a provider of health or residential care, an employee of a provider of health or residential care, the operator of a community care facility, or an employee of an operator of a health care facility.",
        font: "Century Gothic"
      })
    ],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200 }
  }),

  new Paragraph({
    children: [
      new TextRun({
        text: "I declare that I am not related to the principal by blood, marriage, or adoption and that to the best of my knowledge I am not entitled to any part of the estate of the principal on the death of the principal under a will or by operation of law.",
        font: "Century Gothic"
      })
    ],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 400 }
  }),

  new Paragraph({
    children: [
      new TextRun({
        text: "Date:",
        bold: true,
        font: "Century Gothic"
      }),
      new TextRun({
        text: ` ${executionDate}`,
        font: "Century Gothic"
      })
    ],
    spacing: { after: 200 }
  }),

  new Paragraph({
    children: [
      new TextRun({
        text: "Signature:",
        bold: true,
        font: "Century Gothic"
      }),
      new TextRun({
        text: " ______________________________",
        font: "Century Gothic"
      }),
      new TextRun({
        text: " Printed Name:",
        bold: true,
        font: "Century Gothic"
      }),
      new TextRun({
        text: " ___________________________, Witness",
        font: "Century Gothic"
      })
    ],
    spacing: { after: 200 }
  }),

  new Paragraph({
    children: [
      new TextRun({
        text: "Signature:",
        bold: true,
        font: "Century Gothic"
      }),
      new TextRun({
        text: " ______________________________",
        font: "Century Gothic"
      }),
      new TextRun({
        text: " Printed Name:",
        bold: true,
        font: "Century Gothic"
      }),
      new TextRun({
        text: " ___________________________, Witness",
        font: "Century Gothic"
      })
    ],
    spacing: { after: 400 }
  })
] : [
  new Paragraph({
    children: [
      new TextRun({
        text: "State of " + executionState,
        bold: true,
        font: "Century Gothic"
      })
    ],
    spacing: { after: 100 }
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: "County of " + executionCounty,
        bold: true,
        font: "Century Gothic"
      })
    ],
    spacing: { after: 300 }
  }),

  new Paragraph({
    children: [
      new TextRun({
        text: `The foregoing Medical Power of Attorney was acknowledged before me on ${executionDate}, by ${testatorName}.`,
        font: "Century Gothic"
      })
    ],
    spacing: { after: 400 }
  }),

 new Paragraph({
  children: [new TextRun({ text: "_____________________________", font: "Century Gothic" })],
  spacing: { after: 100 }
}),
new Paragraph({
  children: [
    new TextRun({
      text: "Notary Public, State of Texas",
      bold: true,
      font: "Century Gothic"
    })
  ]
})
])
      ]
    }]
  });
  
  return await Packer.toBuffer(doc);
}

module.exports = { generateMedicalPOA };

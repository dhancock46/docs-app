const { Paragraph, TextRun, AlignmentType } = require('docx');

/**
 * Generate the gifts section for the will
 * @param {Object} data - User data containing gift information
 * @returns {Array} Array of docx Paragraph objects
 */
function generateGiftsSection(data) {
    const paragraphs = [];
    
    // Add section title - ALWAYS INCLUDED
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "MY GIFTS",
                    bold: true,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        })
    );

    // Specific Gifts subsection title - ALWAYS INCLUDED
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "Specific Gifts",
                    bold: true,
                    font: "Century Gothic"
                })
            ],
            spacing: { after: 400 }
        })
    );

    // First paragraph - ALWAYS INCLUDED
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "I request that my Personal Representative distribute my Tangible Personal Property according to any separate instructions I may leave. To comply with my instructions, I give to my Personal Representative a power of appointment over any of my Tangible Personal Property for which I leave separate instructions exercisable only in favor of the recipients of such property as specified in my separate instructions. If my instructions leave all or portions of my Tangible Personal Property to my Personal Representative, my Personal Representative may distribute Tangible Personal Property to himself or herself as specified in the instructions. Any of my Tangible Personal Property not disposed of by my separate instructions or by other specific bequests shall be part of my Remaining Estate.",
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );

    // If user selected "no specific gifts", skip everything else
    if (data.selectedGiftTypes && data.selectedGiftTypes.includes('none')) {
        return paragraphs;
    }

    // Specific Gifts to a Person section
    if (data.selectedGiftTypes && data.selectedGiftTypes.includes('specificPersonGifts') && data.specificGifts) {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Specific Gifts to a Person",
                        bold: true,
                        font: "Century Gothic"
                    })
                ],
                spacing: { after: 400 }
            })
        );

        // Generate paragraph for each specific gift
        data.specificGifts.forEach(gift => {
            let giftText = '';
            
            // Handle survival condition for married testators
            if (data.maritalStatus === 'married' && gift.survivalCondition === 'no') {
                giftText = `If I am not survived by my spouse, ${data.spouseName}, I give ${gift.description} to ${gift.relationship} ${gift.recipient}.`;
            } else {
                giftText = `I give ${gift.description} to ${gift.relationship} ${gift.recipient}.`;
            }

            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: giftText,
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 400 }
                })
            );
        });

        // Add lapse clause after all specific gifts
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: "If the recipient of a specific gift does not survive me, the gift to that person will lapse and be distributed as part of my Remaining Estate.",
                        font: "Century Gothic"
                    })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 400 }
            })
        );
    }

    // Gift of Interest in Spouse's Retirement Accounts
    if (data.selectedGiftTypes && data.selectedGiftTypes.includes('spouseRetirement') && data.maritalStatus === 'married') {
        const spouseTitle = data.spouseGender === 'male' ? 'husband' : 'wife';
        const spousePronoun = data.spouseGender === 'male' ? 'his' : 'her';

        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Gift of My Interest in My ${spouseTitle}'s Retirement Accounts`,
                        bold: true,
                        font: "Century Gothic"
                    })
                ],
                spacing: { after: 400 }
            })
        );

        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `If I am survived by my ${spouseTitle} and I own an interest in my ${spouseTitle}'s Retirement Accounts, as defined in this Will, I give my interest in my ${spouseTitle}'s Retirement Accounts to my ${spouseTitle}, ${data.spouseName}, and relinquish the posthumous authority to designate or require the designation of a beneficiary or beneficiaries for all of ${spousePronoun} Retirement Accounts.`,
                        font: "Century Gothic"
                    })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 400 }
            })
        );
    }

    // Gift to Trust for Prior Children
    if (data.selectedGiftTypes && data.selectedGiftTypes.includes('priorChildrenTrust') && data.priorChildrenNames) {
        const spouseTitle = data.spouseGender === 'male' ? 'husband' : 'wife';
        const childText = data.priorChildrenNames.includes(',') ? 'children' : 'child';

        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Gift to Trust for My ${childText.charAt(0).toUpperCase() + childText.slice(1)} from a Prior Relationship`,
                        bold: true,
                        font: "Century Gothic"
                    })
                ],
                spacing: { after: 400 }
            })
        );

        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `If I am survived by ${data.priorChildrenNames}, my ${childText} born or adopted prior to my marriage to my ${spouseTitle}, I give $${data.trustAmount} to the trustee of the ${data.trustName} Trust established in this Will to be held and administered under the terms of this Trust. I anticipate providing additional funding for this Trust from one or more life insurance policies insuring my life.`,
                        font: "Century Gothic"
                    })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 400 }
            })
        );
    }

    // Charitable Gifts section
    if (data.selectedGiftTypes && data.selectedGiftTypes.includes('charitableGifts') && data.charitableGifts) {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Charitable Gifts",
                        bold: true,
                        font: "Century Gothic"
                    })
                ],
                spacing: { after: 400 }
            })
        );

        // Generate paragraph for each charitable gift
        data.charitableGifts.forEach(gift => {
            let giftText = '';
            
            // Handle survival condition for married testators
            if (data.maritalStatus === 'married' && gift.survivalCondition === 'no') {
                giftText = `If I am not survived by my Spouse, ${data.spouseName}, I give ${gift.description} to the ${gift.recipient}.`;
            } else {
                giftText = `I give ${gift.description} to the ${gift.recipient}.`;
            }

            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: giftText,
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 400 }
                })
            );
        });

        // Add lapse clause for charitable gifts
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: "If a charitable gift cannot be completed because the charity is no longer in operation, cannot be located, or the gift is refused, the gift will lapse and be distributed as part of my Remaining Estate.",
                        font: "Century Gothic"
                    })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 400 }
            })
        );
    }

    return paragraphs;
}

module.exports = { generateGiftsSection };

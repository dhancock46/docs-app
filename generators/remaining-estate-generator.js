const { Paragraph, TextRun, AlignmentType } = require('docx');

/**
 * Generate the remaining estate section for the will
 * @param {Object} data - User data containing remaining estate distribution information
 * @returns {Array} Array of docx Paragraph objects
 */
function generateRemainingEstateSection(data) {
    const paragraphs = [];
    
    // Section title and opening sentence - ALWAYS INCLUDED
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "Remaining Estate",
                    bold: true,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        })
    );

    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "My Remaining Estate, as defined in the Definitions section of this Will, shall be distributed as follows:",
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );

    // Handle different primary distributee options
    if (data.primaryDistributee) {
        switch (data.primaryDistributee) {
            case 'spouseAll':
                // All to spouse (100%)
                if (data.maritalStatus === 'married') {
                    const spouseTitle = data.spouseGender === 'male' ? 'husband' : 'wife';
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `I give my Remaining Estate to my ${spouseTitle}, ${data.spouseName}.`,
                                    font: "Century Gothic"
                                })
                            ],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 400 }
                        })
                    );
                }
                break;

            case 'spousePart':
                // Part to spouse (specify percentage)
                if (data.maritalStatus === 'married' && data.spousePercentage) {
                    const spouseTitle = data.spouseGender === 'male' ? 'husband' : 'wife';
                    let remainderText = '';
                    
                    // Build remainder text for additional recipients
                    if (data.additionalRecipients && data.additionalRecipients.length > 0) {
                        const recipientTexts = data.additionalRecipients.map(recipient => 
                            `${recipient.percentage}% to ${recipient.name}`
                        );
                        remainderText = ` and the remainder of my Remaining Estate to ${recipientTexts.join(', ')}.`;
                    }
                    
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `I give ${data.spousePercentage}% of my Remaining Estate to my ${spouseTitle}, ${data.spouseName}${remainderText}`,
                                    font: "Century Gothic"
                                })
                            ],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 400 }
                        })
                    );
                }
                break;

            case 'childrenEqually':
                // Children equally
                const childText = (data.hasMultipleChildren) ? 'children in equal shares' : 'child';
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `I give my Remaining Estate to my ${childText}.`,
                                font: "Century Gothic"
                            })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 400 }
                    })
                );

                // Add trust provisions if applicable
                if (data.createTrust && data.hasMinorChildren) {
                    if (data.trustType === 'common') {
                        // Common trust
                        const childOrChildren = data.hasMultipleChildren ? 'any of our children' : 'my child';
                        const myOrOur = data.maritalStatus === 'married' ? 'our' : 'my';
                        const childrenText = data.hasMultipleChildren ? 'children' : 'child';
                        
                        // Build trust name
                        let trustName = data.testatorName.split(' ').pop(); // Last name
                        if (data.maritalStatus === 'married' && data.spouseName) {
                            const spouseLastName = data.spouseName.split(' ').pop();
                            if (trustName !== spouseLastName) {
                                trustName = `${trustName}-${spouseLastName}`;
                            }
                        }
                        
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `However, if ${childOrChildren} is less than ${data.trustEndAge} years of age at my death, the entire gift to ${myOrOur} ${childrenText} shall be made to the trustee or trustees of the ${trustName} Children's Common Trust created in this Will to be held and managed under the terms of the trust for the common good of ${myOrOur} ${childrenText}.`,
                                        font: "Century Gothic"
                                    })
                                ],
                                alignment: AlignmentType.JUSTIFIED,
                                spacing: { after: 400 }
                            })
                        );
                    } else if (data.trustType === 'separate') {
                        // Separate trusts
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `However, if a child is less than ${data.trustEndAge} years of age, the gift to the child shall not be made directly to the child but shall be made to the trustee or trustees of the child's trust, created in this Will, to be held and managed for the child under the terms of such trust.`,
                                        font: "Century Gothic"
                                    })
                                ],
                                alignment: AlignmentType.JUSTIFIED,
                                spacing: { after: 400 }
                            })
                        );
                    }
                }
                break;

            case 'testatorAndSpouseChildren':
                // Blended family - all children treated equally
                if (data.maritalStatus === 'married' && data.blendedFamily === 'yes') {
                    const allChildrenNames = [];
                    if (data.currentMarriageChildren) {
                        allChildrenNames.push(...data.currentMarriageChildren.map(child => child.name));
                    }
                    if (data.priorChildren) {
                        allChildrenNames.push(...data.priorChildren.map(child => child.name));
                    }
                    if (data.spousePriorChildren) {
                        allChildrenNames.push(...data.spousePriorChildren.map(child => child.name));
                    }
                    
                    const childText = allChildrenNames.length > 1 ? 'children' : 'child';
                    
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `I give my Remaining Estate to the ${childText} of both my ${data.spouseName} and me including ${allChildrenNames.join(', ')}.`,
                                    font: "Century Gothic"
                                })
                            ],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 400 }
                        })
                    );
                }
                break;

            case 'spouseChildren':
                // Spouse's children only
                if (data.maritalStatus === 'married' && data.spousePriorChildren) {
                    const spouseTitle = data.spouseGender === 'male' ? 'husband' : 'wife';
                    const spouseChildrenNames = data.spousePriorChildren.map(child => child.name);
                    const childText = spouseChildrenNames.length > 1 ? 'children' : 'child';
                    
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `I give my Remaining Estate to my ${spouseTitle}'s ${childText}, ${spouseChildrenNames.join(', ')}, born or adopted prior to my marriage to my ${data.spouseName}.`,
                                    font: "Century Gothic"
                                })
                            ],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 400 }
                        })
                    );
                }
                break;

            case 'otherPersons':
                // Other persons with percentages and alternates
                if (data.otherPersons && data.otherPersons.length > 0) {
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "I give my Remaining Estate to the following persons:",
                                    font: "Century Gothic"
                                })
                            ],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 400 }
                        })
                    );

                    data.otherPersons.forEach(person => {
                        let personText = `${person.percentage} percent to ${person.name}.`;
                        if (person.alternate) {
                            personText += ` If ${person.name} does not survive me I give this gift to ${person.alternate}.`;
                        }
                        
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: personText,
                                        font: "Century Gothic"
                                    })
                                ],
                                alignment: AlignmentType.JUSTIFIED,
                                spacing: { after: 400 }
                            })
                        );
                    });
                }
                break;

            case 'parents':
                // Parents or surviving parent
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "I give my Remaining Estate to my parents or the survivor of them.",
                                font: "Century Gothic"
                            })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 400 }
                    })
                );
                break;

            case 'siblingsEqually':
                // Siblings equally
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "I give my Remaining Estate to my siblings who survive me in equal shares.",
                                font: "Century Gothic"
                            })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 400 }
                    })
                );
                break;

            case 'charities':
                // Charitable organizations
                if (data.charitableRecipients && data.charitableRecipients.length > 0) {
                    data.charitableRecipients.forEach(charity => {
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `I give ${charity.percentage}% to ${charity.name}. If this charity has been dissolved at the time of this gift, the gift shall lapse and be shared pro rata between any other charities receiving a bequest, or, if there are none, between the other Primary Beneficiaries.`,
                                        font: "Century Gothic"
                                    })
                                ],
                                alignment: AlignmentType.JUSTIFIED,
                                spacing: { after: 400 }
                            })
                        );
                    });
                }
                break;
        }
    }

    return paragraphs;
}

module.exports = { generateRemainingEstateSection };

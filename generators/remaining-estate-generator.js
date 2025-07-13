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

    // PRIMARY BENEFICIARY SECTION
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
                                    text: `Primary Beneficiary. I give my Remaining Estate to my ${spouseTitle}, ${data.spouseName}.`,
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
                                    text: `Primary Beneficiary. I give ${data.spousePercentage}% of my Remaining Estate to my ${spouseTitle}, ${data.spouseName}${remainderText}`,
                                    font: "Century Gothic"
                                })
                            ],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 400 }
                        })
                    );
                }
                break;

            case 'children':
                // Children equally
                const childText = data.hasMultipleChildren ? 'my children in equal shares' : 'my child';
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Primary Beneficiary. I give my Remaining Estate to ${childText}.`,
                                font: "Century Gothic"
                            })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 400 }
                    })
                );

                // Add trust provisions if applicable
                if (data.createTrust && data.hasMinorChildren) {
                    const trustText = generateTrustProvisions(data, 'primary');
                    if (trustText) {
                        paragraphs.push(
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: trustText,
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

            case 'combinedChildren':
                // Blended family - all children treated equally
                if (data.maritalStatus === 'married' && data.blendedFamily === 'yes') {
                    const allChildrenNames = getAllChildrenNames(data);
                    const childText = allChildrenNames.length > 1 ? 'children' : 'child';
                    const spouseTitle = data.spouseGender === 'male' ? 'husband' : 'wife';
                    
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Primary Beneficiary. I give my Remaining Estate to the ${childText} of both my ${spouseTitle} ${data.spouseName} and me including ${allChildrenNames.join(', ')}.`,
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
                                    text: `Primary Beneficiary. I give my Remaining Estate to my ${spouseTitle}'s ${childText}, ${spouseChildrenNames.join(', ')}, born or adopted prior to my marriage to my ${data.spouseName}.`,
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
                                    text: "Primary Beneficiary. I give my Remaining Estate to the following persons:",
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
                                text: "Primary Beneficiary. I give my Remaining Estate to my parents or the survivor of them.",
                                font: "Century Gothic"
                            })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 400 }
                    })
                );
                break;

            case 'siblings':
                // Siblings equally
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Primary Beneficiary. I give my Remaining Estate to my siblings who survive me in equal shares.",
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
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Primary Beneficiary.",
                                    font: "Century Gothic"
                                })
                            ],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 400 }
                        })
                    );

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

    // ALTERNATIVE BENEFICIARY SECTION
    if (data.alternativeDistributee && data.alternativeDistributee !== 'none') {
        generateAlternativeBeneficiarySection(paragraphs, data);
    }

    // FINAL DISTRIBUTION SECTION
    generateFinalDistributionSection(paragraphs, data);

    return paragraphs;
}

/**
 * Generate trust provisions text based on trust type
 */
function generateTrustProvisions(data, context) {
    if (!data.createTrust || !data.hasMinorChildren) return '';

    const trustEndAge = data.trustEndAge || 25;
    
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
        
        return `However, if ${childOrChildren} is less than ${trustEndAge} years of age at my death, the entire gift to ${myOrOur} ${childrenText} shall be made to the trustee or trustees of the ${trustName} Children's Common Trust created in this Will to be held and managed under the terms of the trust for the common good of ${myOrOur} ${childrenText}.`;
        
    } else if (data.trustType === 'separate') {
        // Separate trusts
        return `However, if a child is less than ${trustEndAge} years of age, the gift to the child shall not be made directly to the child but shall be made to the trustee or trustees of the child's trust, created in this Will, to be held and managed for the child under the terms of such trust.`;
    }
    
    return '';
}

/**
 * Get all children names for blended families
 */
function getAllChildrenNames(data) {
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
    
    return allChildrenNames;
}

/**
 * Generate alternative beneficiary section
 */
function generateAlternativeBeneficiarySection(paragraphs, data) {
    switch (data.alternativeDistributee) {
        case 'children':
            // Alternative is children
            const childText = data.hasMultipleChildren ? 'children' : 'child';
            const childNames = data.hasMultipleChildren ? 
                data.allChildrenNames.join(', ') : 
                data.allChildrenNames[0];
            
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Alternate Beneficiary. If I am not survived by ${getPrimaryBeneficiaryReference(data)}, I give my Remaining Estate to my ${childText}, ${childNames}.`,
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 400 }
                })
            );
            
            // Add trust provisions for alternative children if applicable
            if (data.alternativeChildrenDistributionType === 'trust') {
                const trustText = generateAlternativeTrustProvisions(data);
                if (trustText) {
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: trustText,
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

        case 'combinedChildren':
            // Alternative is combined children (blended family)
            const allChildrenNames = getAllChildrenNames(data);
            const combinedChildText = allChildrenNames.length > 1 ? 'children' : 'child';
            const spouseTitle = data.spouseGender === 'male' ? 'husband' : 'wife';
            
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Alternate Beneficiary. If I am not survived by ${getPrimaryBeneficiaryReference(data)}, I give my Remaining Estate to the ${combinedChildText} of both my ${spouseTitle} and me, ${allChildrenNames.join(', ')}.`,
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 400 }
                })
            );
            break;

        case 'spouseChildren':
            // Alternative is spouse's children
            const spouseTitle2 = data.spouseGender === 'male' ? 'husband' : 'wife';
            const spouseChildrenNames = data.spousePriorChildren.map(child => child.name);
            const spouseChildText = spouseChildrenNames.length > 1 ? 'children' : 'child';
            
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Alternate Beneficiary. If I am not survived by ${getPrimaryBeneficiaryReference(data)}, I give my Remaining Estate to my ${spouseTitle2}'s ${spouseChildText}, ${spouseChildrenNames.join(', ')}, born or adopted prior to my marriage to my ${spouseTitle2}.`,
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 400 }
                })
            );
            break;

        case 'parents':
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Alternate Beneficiary. If I am not survived by the Primary Beneficiary or Beneficiaries named above, I give my Remaining Estate to my parents or the survivor of them.`,
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 400 }
                })
            );
            break;

        case 'siblings':
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Alternate Beneficiary. If I am not survived by the Primary Beneficiary or Beneficiaries named above, I give my Remaining Estate to my siblings who survive me in equal shares.`,
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 400 }
                })
            );
            break;

        case 'charities':
            if (data.alternativeCharitableRecipients && data.alternativeCharitableRecipients.length > 0) {
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Alternate Beneficiary. If I am not survived by the Primary Beneficiary or Beneficiaries named above,`,
                                font: "Century Gothic"
                            })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 400 }
                    })
                );

                data.alternativeCharitableRecipients.forEach(charity => {
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `I give ${charity.percentage}% of my Remaining Estate to ${charity.name}.`,
                                    font: "Century Gothic"
                                })
                            ],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 400 }
                        })
                    );
                });

                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `If a charity has been dissolved at the time of this gift, the gift shall lapse and be shared pro rata between any other charities receiving a bequest, or, if there are none as part of the Final Distribution of my Remaining Estate.`,
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
            if (data.alternativeOtherPersons && data.alternativeOtherPersons.length > 0) {
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Alternate Beneficiary. If I am not survived by the Primary Beneficiary or Beneficiaries named above, I give my Remaining Estate to the following person or persons in the percentages stated:`,
                                font: "Century Gothic"
                            })
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 400 }
                    })
                );

                data.alternativeOtherPersons.forEach(person => {
                    let personText = `${person.percentage}% to ${person.name}.`;
                    if (person.alternate) {
                        const pronoun = person.gender === 'male' ? 'his' : 'her';
                        personText += ` If ${person.name} does not survive me, I give ${pronoun} share of my Remaining Estate to ${person.alternate}.`;
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
    }
}
/**
 * Get reference to primary beneficiary for alternative beneficiary text
 */
function getPrimaryBeneficiaryReference(data) {
    switch (data.primaryDistributee) {
        case 'spouseAll':
        case 'spousePart':
            return 'my spouse';
        case 'otherPersons':
            return 'the persons named as primary beneficiaries';
        default:
            return 'my spouse';
    }
}

/**
 * Generate trust provisions for alternative children
 */
function generateAlternativeTrustProvisions(data) {
    if (!data.alternativeChildrenDistributionType || data.alternativeChildrenDistributionType !== 'trust') {
        return '';
    }

    const trustEndAge = data.altTrustAge || 25;
    
    if (data.trustType === 'separate') {
        return `However, if a child who is a recipient of a gift is less than ${trustEndAge} years of age, the gift to the child shall not be made directly to the child but shall be made to the trustee or trustees of the child's trust, created in this Will, to be held and managed for the child under the terms of such trust.`;
    } else if (data.trustType === 'common') {
        const childrenText = data.hasMultipleChildren ? 'children' : 'child';
        const myOrOur = data.maritalStatus === 'married' ? 'our' : 'my';
        
        // Build trust name
        let trustName = data.testatorName.split(' ').pop();
        if (data.maritalStatus === 'married' && data.spouseName) {
            const spouseLastName = data.spouseName.split(' ').pop();
            if (trustName !== spouseLastName) {
                trustName = `${trustName}-${spouseLastName}`;
            }
        }
        
        return `However, if a child who is a recipient of a gift is less than ${trustEndAge} years of age at my death, the entire gift to ${myOrOur} ${childrenText} shall be made to the trustee or trustees of the ${trustName} Children's Common Trust created in this Will to be held and managed under the terms of the trust for the common good of all of ${myOrOur} children.`;
    }
    
    return '';
}
/**
 * Generate final distribution section
 */
function generateFinalDistributionSection(paragraphs, data) {
    if (data.maritalStatus === 'married') {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Final Distribution. If my estate has not been fully distributed and all beneficiaries named in this Will are deceased, any undistributed portion of my estate will be distributed one-half to my heirs at law and one-half to my Spouse's heirs at law, as determined by the laws of intestate succession, provided no one who has been disinherited shall receive property under this provision.",
                        font: "Century Gothic"
                    })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 400 }
            })
        );
    } else {
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Final Distribution. If my estate has not been fully distributed and all beneficiaries named in this Will are deceased, any undistributed portion of my estate will be distributed to my heirs at law, as determined by the laws of intestate succession, provided no one who has been disinherited shall receive property under this provision.",
                        font: "Century Gothic"
                    })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 400 }
            })
        );
    }
}

module.exports = { generateRemainingEstateSection };

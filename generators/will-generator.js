const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');

/**
 * Generate the family section text based on testator's information
 */
function generateFamilySection(data) {
    let familyText = '';
    
    // Marriage status
    if (data.maritalStatus === 'married') {
        const spouseTitle = data.spouseGender === 'male' ? 'husband' : 'wife';
        familyText += `I am married to ${data.spouseName}. I may also refer to ${data.spouseName} as my "${spouseTitle}" or my "Spouse". `;
    }
    
    // Children information
    if (data.hasChildren === 'no') {
        familyText += 'I have no children.';
    } else {
        // Handle different marital statuses and children scenarios
        if (data.maritalStatus === 'married') {
            let childrenParts = [];
            
            // Children from prior relationship
            if (data.hasPriorChildren === 'yes' && data.priorChildren && data.priorChildren.length > 0) {
                const priorChildrenCount = data.priorChildren.length;
                const priorChildrenText = data.priorChildren.map(child => 
                    `${child.name}, born on ${child.birthday}`
                ).join(', ');
                
                childrenParts.push(`I have ${priorChildrenCount} ${priorChildrenCount === 1 ? 'child' : 'children'} born or adopted prior to my current marriage: ${priorChildrenText}.`);
            }
            
            // Children from current marriage
            if (data.hasCurrentMarriageChildren === 'yes' && data.currentMarriageChildren && data.currentMarriageChildren.length > 0) {
                const currentChildrenCount = data.currentMarriageChildren.length;
                const currentChildrenText = data.currentMarriageChildren.map(child => 
                    `${child.name}, born on ${child.birthday}`
                ).join(', ');
                
                childrenParts.push(`I have ${currentChildrenCount} ${currentChildrenCount === 1 ? 'child' : 'children'} born or adopted during my marriage to ${data.spouseName}: ${currentChildrenText}.`);
            }
            
            // Spouse's children from prior relationship
            if (data.hasSpousePriorChildren === 'yes' && data.spousePriorChildren && data.spousePriorChildren.length > 0) {
                const spouseTitle = data.spouseGender === 'male' ? 'husband' : 'wife';
                const spousePriorChildrenCount = data.spousePriorChildren.length;
                const spousePriorChildrenText = data.spousePriorChildren.map(child => 
                    `${child.name}, born on ${child.birthday}`
                ).join(', ');
                
                childrenParts.push(`My ${spouseTitle} has ${spousePriorChildrenCount} ${spousePriorChildrenCount === 1 ? 'child' : 'children'} born or adopted prior to our marriage: ${spousePriorChildrenText}.`);
            }
            
            // Blended family clause
            if (data.blendedFamily === 'yes') {
                const spouseTitle = data.spouseGender === 'male' ? 'husband' : 'wife';
                const spousePronoun = data.spouseGender === 'male' ? 'his' : 'her';
                childrenParts.push(`My ${spouseTitle} and I have agreed to treat my children and ${spousePronoun} children as one family unit with each child to receive a share of our Remaining Estates, as defined below, as though they were all born or adopted during our marriage.`);
            }
            
            familyText += childrenParts.join(' ');
        } else {
            // Single, divorced, or widowed
            if (data.singleChildren && data.singleChildren.length > 0) {
                const childrenCount = data.singleChildren.length;
                const childrenText = data.singleChildren.map(child => 
                    `${child.name}, born on ${child.birthday}`
                ).join(', ');
                
                familyText += `I have ${childrenCount} ${childrenCount === 1 ? 'child' : 'children'}: ${childrenText}.`;
            }
        }
    }
    
    return familyText;
}

/**
 * Generate the complete will document (this will be expanded as more sections are added)
 */
async function generateWill(data) {
    const familyText = generateFamilySection(data);
    
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Title
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Last Will and Testament of",
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
                            text: data.testatorName,
                            bold: true,
                            size: 32,
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 600 }
                }),

                // Opening declaration
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `I, ${data.testatorName}, a resident of ${data.testatorCity}, ${data.testatorCounty}, ${data.testatorState}, declare this to be my last will ("Will") and I revoke all prior wills.`,
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 400 }
                }),

                new Paragraph({
                    children: [
                        new TextRun({
                            text: "I have given careful consideration to the provisions of my Will. I ask my family to honor my choices to allow the settling of my estate to be as easy and simple as possible.",
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 600 }
                }),

                // MY FAMILY AND MY ESTATE section
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "MY FAMILY AND MY ESTATE",
                            bold: true,
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),

                // Family subsection
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Family. ",
                            bold: true,
                            font: "Century Gothic"
                        }),
                        new TextRun({
                            text: familyText,
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 400 }
                }),

                // Disposition of Property
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Disposition of Property. ",
                            bold: true,
                            font: "Century Gothic"
                        }),
                        new TextRun({
                            text: "I intend to dispose of all of my property no matter how it was acquired or where it is located.",
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 400 }
                }),

                // Placeholder for additional sections
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "[Additional sections will be added as the will is completed]",
                            italics: true,
                            color: "666666",
                            font: "Century Gothic"
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                })
            ]
        }]
    });
    
    return await Packer.toBuffer(doc);
}

module.exports = { generateWill, generateFamilySection };

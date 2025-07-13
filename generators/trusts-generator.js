const { Paragraph, TextRun, AlignmentType } = require('docx');

/**
 * Generate the trusts section for the will
 * @param {Object} data - User data containing trust information
 * @returns {Array} Array of docx Paragraph objects
 */
function generateTrustsSection(data) {
    const paragraphs = [];
    
    // Only generate trust sections if trusts are being created
    if (!data.createTrust) {
        return paragraphs;
    }
    
    // Generate Children's Common Trust if selected
    if (data.trustType === 'common' && data.hasMinorChildren) {
        generateChildrensCommonTrust(paragraphs, data);
    }
    
    // Generate Separate Child's Trusts if selected
    if (data.trustType === 'separate' && data.hasMinorChildren) {
        generateChildsTrusts(paragraphs, data);
    }
    
    // Generate Prior Children Trust if applicable
    if (data.maritalStatus === 'married' && data.priorChildrenTrust && data.priorChildren) {
        generatePriorChildrenTrust(paragraphs, data);
    }
    
    return paragraphs;
}

/**
 * Generate Children's Common Trust section
 */
function generateChildrensCommonTrust(paragraphs, data) {
    // Build trust name
    let trustName = data.testatorName.split(' ').pop();
    if (data.maritalStatus === 'married' && data.spouseName) {
        const spouseLastName = data.spouseName.split(' ').pop();
        if (trustName !== spouseLastName) {
            trustName = `${trustName}-${spouseLastName}`;
        }
    }
    
    const trustEndAge = data.trustEndAge || 25;
    const myOrOur = data.maritalStatus === 'married' ? 'our' : 'my';
    const childText = data.hasMultipleChildren ? 'children' : 'child';
    
    // Section title
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "CHILDREN'S COMMON TRUST",
                    bold: true,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        })
    );
    
    // Trust establishment paragraph
    const establishmentText = getEstablishmentText(data, trustName, trustEndAge, childText, myOrOur);
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: establishmentText,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
    
    // Trustee appointments
    generateTrusteeAppointments(paragraphs, data, 'common');
    
    // Distributions during trust term
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `Distributions During Trust Term. The trustee of the ${trustName} Children's Common Trust may distribute from time to time, in convenient installments to or for the benefit of a trust beneficiary, so much of the net income and principal of the Trust as the trustee deems necessary, in the trustee's sole discretion, for the health, education, maintenance, and support of each trust beneficiary. Education includes, but is not limited to, college, graduate school, vocational studies, and reasonably related living and travel expenses.`,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
    
    // Trust termination
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `Termination of the Trust. The ${trustName} Children's Common Trust will terminate when there are no living initial Trust beneficiaries under ${trustEndAge} years of age.`,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
    
    // Distribution upon termination
    generateCommonTrustTerminationProvisions(paragraphs, data);
    
    // Statement of trust purposes
    generateCommonTrustPurposes(paragraphs, data, myOrOur, childText);
}

/**
 * Generate Child's Trusts (separate trusts) section
 */
function generateChildsTrusts(paragraphs, data) {
    const trustEndAge = data.trustEndAge || 25;
    
    // Section title
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "CHILD'S TRUST",
                    bold: true,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        })
    );
    
    // Separate trusts introduction
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "Child's Trusts Treated as Separate Trusts. Each Child's Trust created by my Will shall constitute a separate trust for the benefit of the child for whom the Child's Trust is established.",
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
    
    // Trustee appointments
    generateTrusteeAppointments(paragraphs, data, 'separate');
    
    // Distributions during trust term
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "Distributions During Trust Term. The trustee may distribute, from time to time, in convenient installments to or for the benefit of the trust beneficiary, as much of net income and principal of the Trust as the trustee deems necessary, in the trustee's sole discretion, for the health, education, maintenance, and support of the trust beneficiary.",
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
    
    // Trust termination
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `Termination of Child's Trusts. Each Child's Trust shall terminate, separately and independently of one another when the child for whom the Child's Trust is designated reaches ${trustEndAge} years of age or dies.`,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
    
    // Distribution upon termination
    generateSeparateTrustTerminationProvisions(paragraphs, data);
    
    // Statement of trust purposes
    generateSeparateTrustPurposes(paragraphs, data);
}

/**
 * Generate Prior Children Trust section
 */
function generatePriorChildrenTrust(paragraphs, data) {
    if (!data.priorChildren || data.priorChildren.length === 0) return;
    
    const priorChildrenNames = data.priorChildren.map(child => child.name);
    const trustSurname = priorChildrenNames[0].split(' ').pop().toUpperCase();
    const trustEndAge = data.priorChildrenTrustEndAge || data.trustEndAge || 25;
    const childText = priorChildrenNames.length > 1 ? 'children' : 'child';
    
    // Section title
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `${trustSurname} TRUST`,
                    bold: true,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        })
    );
    
    // Trust establishment
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `This Trust is established for benefit of ${priorChildrenNames.join(', ')}.`,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
    
    // Trustee appointments for prior children trust
    generatePriorChildrenTrusteeAppointments(paragraphs, data);
    
    // Distributions during trust term
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "Distributions During Trust Term. The trustee of this Trust may distribute from time to time, in convenient installments to or for the benefit of a trust beneficiary, so much of the net income and principal of the Trust as the trustee deems necessary, in the trustee's sole discretion, for the health, education, maintenance, and support of each beneficiary of this Trust. My Trustee shall use Trust funds to pay all court mandated child support payments unless I have provided for child support payments outside of this Trust. Education includes, but is not limited to, college, graduate school, vocational studies, and reasonably related living and travel expenses.",
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
    
    // Trust termination
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `Termination of the Trust. This Trust will terminate when the youngest beneficiary of this Trust is ${trustEndAge} years of age.`,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
    
    // Distribution upon termination
    generatePriorChildrenTrustTerminationProvisions(paragraphs, data);
    
    // Statement of trust purposes
    generatePriorChildrenTrustPurposes(paragraphs, data, priorChildrenNames, childText);
}

/**
 * Helper function to get establishment text for common trust
 */
function getEstablishmentText(data, trustName, trustEndAge, childText, myOrOur) {
    let beneficiaryText = '';
    
    if (data.maritalStatus === 'married') {
        if (data.blendedFamily === 'yes') {
            beneficiaryText = 'my spouse or I';
        } else {
            beneficiaryText = 'my spouse or I';
        }
    } else {
        beneficiaryText = 'I';
    }
    
    return `If ${beneficiaryText} a child who is less than ${trustEndAge} years of age at my death, and the gift to ${myOrOur} ${childText} is made to the trustee or trustees of this Trust, the Trust will be known as the ${trustName} Children's Common Trust. The Trust is established for the common benefit of all of ${myOrOur} children, including any child born or adopted after the date of this Will. The children named are the initial beneficiaries of this Trust. The Descendants of the initial beneficiaries may be secondary beneficiaries.`;
}

/**
 * Generate trustee appointments section
 */
function generateTrusteeAppointments(paragraphs, data, trustType) {
    if (data.trusteeStructure === 'single') {
        // Single trustee
        let trusteeText = `Trustee Appointments. I appoint ${data.primaryTrustee} as Trustee of this Trust.`;
        
        if (data.alternateTrustees && data.alternateTrustees.length > 0) {
            data.alternateTrustees.forEach(trustee => {
                trusteeText += ` If ${data.primaryTrustee} is unable or unwilling to serve, I appoint ${trustee.name} to serve as Trustee of this trust.`;
            });
        }
        
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: trusteeText,
                        font: "Century Gothic"
                    })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 400 }
            })
        );
    } else if (data.trusteeStructure === 'co-trustees') {
        // Co-trustees
        let coTrusteeText = `Trustee Appointments. I appoint ${data.coTrustee1} and ${data.coTrustee2} as co-trustees of this trust. If one co-trustee is unable or unwilling to serve, the other shall serve as the sole trustee of this trust.`;
        
        if (data.alternateTrustees && data.alternateTrustees.length > 0) {
            coTrusteeText += ` If neither ${data.coTrustee1} nor ${data.coTrustee2} are able or willing to serve as trustee of this trust, I appoint ${data.alternateTrustees[0].name} to serve as trustee of this trust.`;
            
            if (data.alternateTrustees.length > 1) {
                for (let i = 1; i < data.alternateTrustees.length; i++) {
                    coTrusteeText += ` If ${data.alternateTrustees[i-1].name} is unable or unwilling to serve, I appoint ${data.alternateTrustees[i].name} to serve as trustee of this trust.`;
                }
            }
        }
        
        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: coTrusteeText,
                        font: "Century Gothic"
                    })
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 400 }
            })
        );
    }
}

/**
 * Generate prior children trustee appointments
 */
function generatePriorChildrenTrusteeAppointments(paragraphs, data) {
    let trusteeText = `Trustee Appointments. I appoint ${data.priorChildrenTrustPrimaryTrustee} as trustee of this trust.`;
    
    if (data.priorChildrenTrustAlternateTrustees && data.priorChildrenTrustAlternateTrustees.length > 0) {
        data.priorChildrenTrustAlternateTrustees.forEach(trustee => {
            trusteeText += ` If ${data.priorChildrenTrustPrimaryTrustee} is unable or unwilling to serve as trustee of this trust, I appoint ${trustee.name} to serve as trustee of this trust.`;
        });
    }
    
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: trusteeText,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
}

/**
 * Generate common trust termination provisions
 */
function generateCommonTrustTerminationProvisions(paragraphs, data) {
    const terminationText = `Distributions Upon Trust Termination. Upon termination, if I am survived by any of the children who were initial beneficiaries of this Trust or their Descendants, the trustee shall divide the remaining assets of the trust into the number of equal shares equal to the number of the children who survive me plus the number of such children who do not survive me but who leave surviving Descendants. The trustee shall designate each share with the name of one of the children included in determining the number of shares into which the remaining trust assets were divided, and no two shares may be designated with the name of the same child. Each share shall be distributed as follows:

(a) Upon termination the assets and undistributed income of this Trust shall be distributed in equal shares to each child for whom the Trust was created.

(b) If the child for whom a share is designated is deceased, but at least one Descendant of such child survives the child, the share of the deceased child shall be distribted to such child's surviving Descendants.

(c) If a child for whom a share is designated is deceased and is not survived by any Descendants, but is survived by other children for whom this Trust was created the share of the deceased child shall be distributed in equal shares to the surviving other children.

(d) If at the termination of this trust, the assets of this Trust are not fully distributed under the above provisions, to those persons or entities who would be entitled to receive my Remaining Estate under the Final Distribution provisions of this Will determined as if I had died on the termination date of this trust, and as if the trust estate constituted my Remaining Estate.

(e) Any distributions from this Trust are subject to the discretionary power of the trustee to make distributions to parents, legal guardians, or custodians for under-age beneficiaries.`;
    
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: terminationText,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
}

/**
 * Generate separate trust termination provisions
 */
function generateSeparateTrustTerminationProvisions(paragraphs, data) {
    const terminationText = `Distribution Upon Trust Termination. Upon termination, the trust estate shall be distributed:

(a) To the child for whom the trust was created.

(b) If the child for whom the trust was created is not then living, to such child's Descendants.

(c) If a child for whom a share is designated is deceased and is not survived by any Descendants, but is survived by other children for whom a separate Trust was created the share of the deceased child shall be distributed in equal shares to the surviving other children.

(d) If at the termination of this trust, the assets of this Trust are not fully distributed under the above provisions, to those persons or entities who would be entitled to receive my Remaining Estate under the Final Distribution provisions of this Will determined as if I had died on the termination date of this trust, and as if the trust estate constituted my Remaining Estate.

(e) Any distributions from this Trust are subject to the discretionary power of the trustee to make distributions to parents, legal guardians, or custodians for under-age beneficiaries.`;
    
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: terminationText,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
}

/**
 * Generate prior children trust termination provisions
 */
function generatePriorChildrenTrustTerminationProvisions(paragraphs, data) {
    const terminationText = `Distributions Upon Trust Termination. Upon termination, if I am survived by any of my children or their Descendants who are designated as beneficiaries of this Trust, the trustee shall divide the remaining assets of the trust into the number of equal shares equal to the number of my children who are beneficiaries of this Trust who survive me plus the number of such children who do not survive me but who leave surviving Descendants ("Trust Beneficiaries"). The trustee shall designate each share with the name of one of the Trust Beneficiaries who was included in determining the number of shares into which the remaining trust assets were divided, and no two shares may be designated with the name of the same child. Each share shall be distributed as follows:

(a) If the child for whom a share is designated survives, to such child.

(b) If the child for whom a share is designated is deceased, but at least one descendant of such child survives the child, to such child's Descendants who survive the deceased child, subject to the discretionary power of the trustee to make distributions to parents, legal guardians, or custodians for under-age beneficiaries.

(c) If the child for whom a share is designated is deceased and leaves no Descendants, to my Descendants who survive the deceased child, subject to the discretionary power of the trustee to make distributions to parents, legal guardians, or custodians for under-age beneficiaries.

(d) If at the termination of this trust, none of my Descendants is then living, to those persons or entities who would be entitled to receive my Remaining Estate under this Will determined as if I had died on the termination date of this trust, and as if the trust estate constituted my Remaining Estate.`;
    
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: terminationText,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
}

/**
 * Generate common trust purposes
 */
function generateCommonTrustPurposes(paragraphs, data, myOrOur, childText) {
    const purposesText = `Statement of Trust Purposes. My primary purpose in establishing a children's common trust is to provide for ${myOrOur} ${childText} from a common fund according to their individual needs. The trustee shall have absolute discretion in determining the needs of a child but in making such determinations the trustee shall:

(a) Not be required to make equal distributions to the children, but shall use trust funds to provide for the needs of each child as the trustee determines those needs;

(b) Make the education of the children a priority and if adequate resources are available to provide for the necessities of life for the children, such as food, shelter, clothing and medical care, the trustee should use trust assets to provide liberally for the educational needs of the children; and

(c) Not allow a child or any other beneficiary who reasonably should be expected to assist in securing his or her own economic support to become so financially dependent upon this trust that he or she loses the incentive to be or become gainfully employed after completion of an education.

I know that I cannot anticipate all future needs of the children for whom this Trust was created and leave specific instructions concerning the use of trust assets to care for the children. Therefore, I entrust the trust assets to the trustee with the hope and desire that the trustee will attempt to use the trust assets to care for the children who are beneficiaries of this Trust as the trustee believes I would have used the assets or, if the trustee is not personally acquainted with me, as the trustee believes is prudent. To provide additional guidance to the trustee, I may leave additional written instructions from time to time. If I do leave such instructions, I request that the trustee honor any requests or suggestions I may leave, provided the primary objectives of this trust are not impaired by such requests or instructions. The trustee will always have the right to make a final determination as to the use of trust assets.

The trustee may consider (but shall not be required to consider) the needs of a child's family in determining such child's need for support and maintenance.`;
    
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: purposesText,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
}

/**
 * Generate separate trust purposes
 */
function generateSeparateTrustPurposes(paragraphs, data) {
    const purposesText = `Statement of Trust Purposes. My primary concern in establishing a separate child's trust for each of the children for whom trusts are created is to provide for financial guidance for the use of trust funds. My trustee shall have absolute discretion in making distributions to a child from a Child's Trust, subject to the following:

(a) My Trustee shall consider the child for whom it is designated as the preferred beneficiary of each Child's Trust and shall give preference to the needs of that child as opposed to the child's Descendants.

(b) My trustee shall manage the trust and make distributions to provide for the current beneficiaries of the trust.

(c) If a child has not completed his or her education, my trustee shall use trust assets to provide for his or her educational needs.

(d) The trustee may also consider (but shall not be required to consider) the needs of a child's family in determining a child's need for support and maintenance.

While providing the necessities of life and the opportunity for an education remains my primary goal, my Trustee is instructed to make distributions from each individual trust to provide funds for a down payment on a first home, a wedding, and other major life events as well as prudent business opportunities, or other personal needs of a beneficiary if funds are available and if distributions will not impair the ability of my Trustee to carry out my primary objectives.`;
    
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: purposesText,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
}

/**
 * Generate prior children trust purposes
 */
function generatePriorChildrenTrustPurposes(paragraphs, data, priorChildrenNames, childText) {
    const purposesText = `Statement of Trust Purposes. My primary purpose in establishing a trust for ${priorChildrenNames.join(', ')} is to provide for the ${childText} from a common fund according to their individual needs. The trustee shall have absolute discretion in determining the needs of a beneficiary but in making such determinations the trustee shall:

(a) Not be required to make equal distributions to the beneficiaries, but shall use trust funds to provide for the needs of each beneficiary as the trustee determines those needs;

(b) Make the education of my ${childText} a priority and if adequate resources are available to provide for the necessities of life for each beneficiary, such as food, shelter, clothing and medical care, the trustee should use trust assets to provide liberally for the educational needs of my children; and

(c) Not allow a beneficiary who reasonably should be expected to assist in securing his or her own economic support to become so financially dependent upon this trust that he or she loses the incentive to be or become gainfully employed after completion of an education.

I know that I cannot anticipate all future needs of ${priorChildrenNames.join(', ')} and leave specific instructions concerning the use of trust assets. Therefore, I entrust the trust assets to the trustee with the hope and desire that the trustee will attempt to use the trust assets to care for ${priorChildrenNames.join(', ')} as the trustee believes I would have used the assets or, if the trustee is not personally acquainted with me, as the trustee believes is prudent. To provide additional guidance to the trustee, I may leave additional written instructions from time to time. If I do leave such instructions, I request that the trustee honor any requests or suggestions I may leave, provided the primary objectives of this trust are not impaired by such requests or instructions. The trustee will always have the right to make a final determination as to the use of trust assets.

The trustee may consider (but shall not be required to consider) the needs of a child's family in determining such child's need for support and maintenance.`;
    
    paragraphs.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: purposesText,
                    font: "Century Gothic"
                })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
        })
    );
}

module.exports = { generateTrustsSection };

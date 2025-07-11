const { Paragraph, TextRun, AlignmentType } = require('docx');

/**
 * Generate the gifts section for the will
 * @param {Object} data - User data containing gift information
 * @returns {Array} Array of docx Paragraph objects
 */
function generateGiftsSection(data) {
    const paragraphs = [];
    
    // Add section title
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
    
    // Section content will be added here based on your text
    
    return paragraphs;
}

module.exports = { generateGiftsSection };

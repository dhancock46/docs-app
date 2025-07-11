javascriptconst { generateGiftsSection } = require('./gifts-generator');
const fs = require('fs');

// Create test data that matches what your form would send
const testData = {
    maritalStatus: 'married',
    spouseName: 'Jane Smith',
    spouseGender: 'female',
    selectedGiftTypes: ['specificPersonGifts', 'charitableGifts'],
    specificGifts: [
        {
            description: '$5,000',
            recipient: 'John Doe',
            relationship: 'my nephew',
            survivalCondition: 'no'
        }
    ],
    charitableGifts: [
        {
            description: '$1,000',
            recipient: 'American Red Cross',
            survivalCondition: 'no'
        }
    ]
};

// Generate the paragraphs
const paragraphs = generateGiftsSection(testData);

// Print out what would be generated
console.log('Generated paragraphs:');
paragraphs.forEach((paragraph, index) => {
    console.log(`\nParagraph ${index + 1}:`);
    paragraph.children.forEach(child => {
        if (child.text) {
            console.log(child.text);
        }
    });
});

// Help system functions
function showHelp(helpId) {
    document.getElementById('helpOverlay').style.display = 'block';
    document.getElementById(helpId).style.display = 'block';
}

function closeHelp() {
    document.getElementById('helpOverlay').style.display = 'none';
    const helpPopups = document.querySelectorAll('.help-popup');
    helpPopups.forEach(popup => {
        popup.style.display = 'none';
    });
}

// State abbreviations expansion
const stateAbbreviations = {
    'TX': 'Texas', 'CA': 'California', 'FL': 'Florida', 'NY': 'New York',
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana',
    'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana',
    'ME': 'Maine', 'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan',
    'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana',
    'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island',
    'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming'
};

// Toggle second agent section
function toggleSecondAgent() {
    const checkbox = document.getElementById('wantSecondAgent');
    const section = document.getElementById('secondAgentSection');
    
    if (checkbox.checked) {
        section.classList.remove('hidden');
    } else {
        section.classList.add('hidden');
        document.getElementById('wantThirdAgent').checked = false;
        document.getElementById('thirdAgentSection').classList.add('hidden');
        document.getElementById('secondAgent').value = '';
        document.getElementById('thirdAgent').value = '';
    }
}

// Toggle third agent section
function toggleThirdAgent() {
    const checkbox = document.getElementById('wantThirdAgent');
    const section = document.getElementById('thirdAgentSection');
    
    if (checkbox.checked) {
        section.classList.remove('hidden');
    } else {
        section.classList.add('hidden');
        document.getElementById('thirdAgent').value = '';
    }
}

// Toggle date input
function toggleDateInput() {
    const exactDate = document.getElementById('exactDate').checked;
    const blankDate = document.getElementById('blankDate').checked;
    const exactSection = document.getElementById('exactDateSection');
    const blankSection = document.getElementById('blankDateSection');
    
    if (exactDate) {
        exactSection.classList.remove('hidden');
        blankSection.classList.add('hidden');
        document.getElementById('executionMonth').value = '';
        document.getElementById('executionDay').value = '';
        document.getElementById('executionYear').value = '';
    } else if (blankDate) {
        blankSection.classList.remove('hidden');
        exactSection.classList.add('hidden');
        document.getElementById('executionDate').value = '';
    } else {
        exactSection.classList.add('hidden');
        blankSection.classList.add('hidden');
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup state expansion
    const executionStateField = document.getElementById('executionState');
    if (executionStateField) {
        executionStateField.addEventListener('blur', function() {
            const entered = this.value.trim().toUpperCase();
            if (stateAbbreviations[entered]) {
                this.value = stateAbbreviations[entered];
            }
        });
    }

    // Handle form submission
    const form = document.getElementById('powerOfAttorneyForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const loadingMessage = document.getElementById('loadingMessage');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            loadingMessage.style.display = 'block';
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Generating Document...';
            
            try {
                const formData = new FormData(this);
                const data = {};
                
                for (let [key, value] of formData.entries()) {
                    if (data[key]) {
                        if (Array.isArray(data[key])) {
                            data[key].push(value);
                        } else {
                            data[key] = [data[key], value];
                        }
                    } else {
                        data[key] = value;
                    }
                }
                
                // Handle date formatting
                if (data.dateChoice === 'exact' && data.executionDate) {
                    // Keep exact date
                } else if (data.dateChoice === 'blank') {
                    const month = data.executionMonth || '_______';
                    const day = data.executionDay || '___';
                    const year = data.executionYear || '____';
                    data.executionDate = `${month} ${day}, ${year}`;
                } else {
                    throw new Error('Please select a date option');
                }
                
                if (!data.testatorName || !data.clientEmail || !data.primaryAgent || 
                    !data.executionCity || !data.executionState || !data.executionCounty) {
                    throw new Error('Please fill in all required fields');
                }
                
                data.secondAgent = data.secondAgent || '';
                data.thirdAgent = data.thirdAgent || '';
                data.generateWordDocument = true;
                data.useBlankLines = true;
                data.documentType = 'power-of-attorney';
                
                const response = await fetch('/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error(result.message || 'Word document generation failed');
                }
                
                loadingMessage.style.display = 'none';
                successMessage.style.display = 'block';
                this.reset();
                
                // Reset sections
                const secondAgentSection = document.getElementById('secondAgentSection');
                const thirdAgentSection = document.getElementById('thirdAgentSection');
                const exactDateSection = document.getElementById('exactDateSection');
                const blankDateSection = document.getElementById('blankDateSection');
                
                if (secondAgentSection) secondAgentSection.classList.add('hidden');
                if (thirdAgentSection) thirdAgentSection.classList.add('hidden');
                if (exactDateSection) exactDateSection.classList.add('hidden');
                if (blankDateSection) blankDateSection.classList.add('hidden');
                
            } catch (error) {
                console.error('Error:', error);
                loadingMessage.style.display = 'none';
                errorMessage.style.display = 'block';
                
                const errorP = errorMessage.querySelector('p');
                errorP.textContent = error.message || 'There was an error generating your Word document. Please check your information and try again.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit for Review';
            }
        });
    }

    // Visual feedback for required fields
    document.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#27ae60';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    });

    // Prevent Enter key submission in text fields
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });
});
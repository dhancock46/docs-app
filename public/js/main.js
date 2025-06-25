
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
 
// Auto-expand state abbreviations
const executionStateField = document.getElementById('executionState');
if (executionStateField) {
    executionStateField.addEventListener('blur', function() {
        const stateAbbreviations = {
            'TX': 'Texas',
            'CA': 'California',
            'FL': 'Florida',
            'NY': 'New York',
            // Add more states as needed
            'AL': 'Alabama',
            'AK': 'Alaska',
            'AZ': 'Arizona',
            'AR': 'Arkansas',
            'CO': 'Colorado',
            'CT': 'Connecticut',
            'DE': 'Delaware',
            'GA': 'Georgia',
            'HI': 'Hawaii',
            'ID': 'Idaho',
            'IL': 'Illinois',
            'IN': 'Indiana',
            'IA': 'Iowa',
            'KS': 'Kansas',
            'KY': 'Kentucky',
            'LA': 'Louisiana',
            'ME': 'Maine',
            'MD': 'Maryland',
            'MA': 'Massachusetts',
            'MI': 'Michigan',
            'MN': 'Minnesota',
            'MS': 'Mississippi',
            'MO': 'Missouri',
            'MT': 'Montana',
            'NE': 'Nebraska',
            'NV': 'Nevada',
            'NH': 'New Hampshire',
            'NJ': 'New Jersey',
            'NM': 'New Mexico',
            'NC': 'North Carolina',
            'ND': 'North Dakota',
            'OH': 'Ohio',
            'OK': 'Oklahoma',
            'OR': 'Oregon',
            'PA': 'Pennsylvania',
            'RI': 'Rhode Island',
            'SC': 'South Carolina',
            'SD': 'South Dakota',
            'TN': 'Tennessee',
            'UT': 'Utah',
            'VT': 'Vermont',
            'VA': 'Virginia',
            'WA': 'Washington',
            'WV': 'West Virginia',
            'WI': 'Wisconsin',
            'WY': 'Wyoming'
        };
        
        const entered = this.value.trim().toUpperCase();
        if (stateAbbreviations[entered]) {
            this.value = stateAbbreviations[entered];
        }
    });
}
// Enable continue button when document is selected
document.getElementById('documentSelect').addEventListener('change', function() {
    const continueBtn = document.getElementById('continueBtn');
    continueBtn.disabled = this.value === '';
});
// Auto-expand state abbreviations for Medical POA
const medicalStateField = document.getElementById('medicalExecutionState');
if (medicalStateField) {
    medicalStateField.addEventListener('blur', function() {
        const stateAbbreviations = {
            'TX': 'Texas',
            'CA': 'California',
            'FL': 'Florida',
            'NY': 'New York',
            'AL': 'Alabama',
            'AK': 'Alaska',
            'AZ': 'Arizona',
            'AR': 'Arkansas',
            'CO': 'Colorado',
            'CT': 'Connecticut',
            'DE': 'Delaware',
            'GA': 'Georgia',
            'HI': 'Hawaii',
            'ID': 'Idaho',
            'IL': 'Illinois',
            'IN': 'Indiana',
            'IA': 'Iowa',
            'KS': 'Kansas',
            'KY': 'Kentucky',
            'LA': 'Louisiana',
            'ME': 'Maine',
            'MD': 'Maryland',
            'MA': 'Massachusetts',
            'MI': 'Michigan',
            'MN': 'Minnesota',
            'MS': 'Mississippi',
            'MO': 'Missouri',
            'MT': 'Montana',
            'NE': 'Nebraska',
            'NV': 'Nevada',
            'NH': 'New Hampshire',
            'NJ': 'New Jersey',
            'NM': 'New Mexico',
            'NC': 'North Carolina',
            'ND': 'North Dakota',
            'OH': 'Ohio',
            'OK': 'Oklahoma',
            'OR': 'Oregon',
            'PA': 'Pennsylvania',
            'RI': 'Rhode Island',
            'SC': 'South Carolina',
            'SD': 'South Dakota',
            'TN': 'Tennessee',
            'UT': 'Utah',
            'VT': 'Vermont',
            'VA': 'Virginia',
            'WA': 'Washington',
            'WV': 'West Virginia',
            'WI': 'Wisconsin',
            'WY': 'Wyoming'
        };
        
        const entered = this.value.trim().toUpperCase();
        if (stateAbbreviations[entered]) {
            this.value = stateAbbreviations[entered];
        }
    });
}

        // Load selected document form
       function loadSelectedDocument() {
    const selectedDoc = document.getElementById('documentSelect').value;
    const homePage = document.getElementById('homePage');
    
    if (selectedDoc === 'power-of-attorney') {
        homePage.style.display = 'none';
        document.getElementById('poaForm').style.display = 'block';
        document.getElementById('medicalPoaForm').style.display = 'none';
    } else if (selectedDoc === 'medical-power-of-attorney') {
        homePage.style.display = 'none';
        document.getElementById('poaForm').style.display = 'none';
        document.getElementById('medicalPoaForm').style.display = 'block';
    }
}

// Go back to home page
function goHome() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('poaForm').style.display = 'none';
    document.getElementById('medicalPoaForm').style.display = 'none';
    
    // Reset both forms completely
    document.getElementById('powerOfAttorneyForm').reset();
    
    // Check if medical form exists and reset it
    const medicalForm = document.getElementById('medicalPowerOfAttorneyForm');
    if (medicalForm) {
        medicalForm.reset();
    }
    
    // Hide agent sections (Statutory POA)
    const secondAgentSection = document.getElementById('secondAgentSection');
    const thirdAgentSection = document.getElementById('thirdAgentSection');
    if (secondAgentSection) secondAgentSection.classList.add('hidden');
    if (thirdAgentSection) thirdAgentSection.classList.add('hidden');
    
    // Hide alternate agent sections (Medical POA)
    const alternateSection = document.getElementById('alternateAgentsSection');
    const secondAlternateSection = document.getElementById('secondAlternateSection');
    if (alternateSection) alternateSection.classList.add('hidden');
    if (secondAlternateSection) secondAlternateSection.classList.add('hidden');
    
    // Hide date sections
    const exactDateSection = document.getElementById('exactDateSection');
    const blankDateSection = document.getElementById('blankDateSection');
    const medicalExactDateSection = document.getElementById('medicalExactDateSection');
    const medicalBlankDateSection = document.getElementById('medicalBlankDateSection');
    if (exactDateSection) exactDateSection.classList.add('hidden');
    if (blankDateSection) blankDateSection.classList.add('hidden');
    if (medicalExactDateSection) medicalExactDateSection.classList.add('hidden');
    if (medicalBlankDateSection) medicalBlankDateSection.classList.add('hidden');
    
    // Hide messages
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const loadingMessage = document.getElementById('loadingMessage');
    const medicalSuccessMessage = document.getElementById('medicalSuccessMessage');
    const medicalErrorMessage = document.getElementById('medicalErrorMessage');
    const medicalLoadingMessage = document.getElementById('medicalLoadingMessage');
    
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
    if (loadingMessage) loadingMessage.style.display = 'none';
    if (medicalSuccessMessage) medicalSuccessMessage.style.display = 'none';
    if (medicalErrorMessage) medicalErrorMessage.style.display = 'none';
    if (medicalLoadingMessage) medicalLoadingMessage.style.display = 'none';
}

        // Toggle second agent section
        function toggleSecondAgent() {
            const checkbox = document.getElementById('wantSecondAgent');
            const section = document.getElementById('secondAgentSection');
            
            if (checkbox.checked) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
                // Also hide third agent and uncheck
                document.getElementById('wantThirdAgent').checked = false;
                document.getElementById('thirdAgentSection').classList.add('hidden');
                // Clear the inputs
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
// Toggle alternate agents for Medical POA
function toggleAlternateAgents() {
    const wantAlternates = document.getElementById('wantAlternates').checked;
    const noAlternates = document.getElementById('noAlternates').checked;
    const section = document.getElementById('alternateAgentsSection');
    
    if (wantAlternates) {
        section.classList.remove('hidden');
    } else if (noAlternates) {
        section.classList.add('hidden');
        // Clear the inputs
        document.getElementById('firstAlternateAgent').value = '';
        document.getElementById('secondAlternateAgent').value = '';
        // Hide second alternate
        document.getElementById('wantSecondAlternate').checked = false;
        document.getElementById('secondAlternateSection').classList.add('hidden');
    }
}

// Toggle second alternate agent for Medical POA
function toggleSecondAlternate() {
    const checkbox = document.getElementById('wantSecondAlternate');
    const section = document.getElementById('secondAlternateSection');
    
    if (checkbox.checked) {
        section.classList.remove('hidden');
    } else {
        section.classList.add('hidden');
        document.getElementById('secondAlternateAgent').value = '';
    }
}
// Toggle date input for Statutory POA
function toggleDateInput() {
    const exactDate = document.getElementById('exactDate').checked;
    const blankDate = document.getElementById('blankDate').checked;
    const exactSection = document.getElementById('exactDateSection');
    const blankSection = document.getElementById('blankDateSection');
    
    if (exactDate) {
        exactSection.classList.remove('hidden');
        blankSection.classList.add('hidden');
        // Clear blank date fields
        document.getElementById('executionMonth').value = '';
        document.getElementById('executionDay').value = '';
        document.getElementById('executionYear').value = '';
    } else if (blankDate) {
        blankSection.classList.remove('hidden');
        exactSection.classList.add('hidden');
        // Clear exact date field
        document.getElementById('executionDate').value = '';
    } else {
        exactSection.classList.add('hidden');
        blankSection.classList.add('hidden');
    }
}
// Toggle date input for Medical POA
function toggleMedicalDateInput() {
    const exactDate = document.getElementById('medicalExactDate').checked;
    const blankDate = document.getElementById('medicalBlankDate').checked;
    const exactSection = document.getElementById('medicalExactDateSection');
    const blankSection = document.getElementById('medicalBlankDateSection');
    
    if (exactDate) {
        exactSection.classList.remove('hidden');
        blankSection.classList.add('hidden');
        // Clear blank date fields
        document.getElementById('medicalExecutionMonth').value = '';
        document.getElementById('medicalExecutionDay').value = '';
        document.getElementById('medicalExecutionYear').value = '';
    } else if (blankDate) {
        blankSection.classList.remove('hidden');
        exactSection.classList.add('hidden');
        // Clear exact date field
        document.getElementById('medicalExecutionDate').value = '';
    } else {
        exactSection.classList.add('hidden');
        blankSection.classList.add('hidden');
    }
}
            // Handle form submission
        document.getElementById('powerOfAttorneyForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const loadingMessage = document.getElementById('loadingMessage');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            
            // Hide previous messages
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            loadingMessage.style.display = 'block';
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Generating Document...';
            
            try {
                const formData = new FormData(this);
                const data = {};
                
                // Process form data properly
                for (let [key, value] of formData.entries()) {
                    if (data[key]) {
                        // Handle multiple values
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
             // Keep the exact date as entered
             } else if (data.dateChoice === 'blank') {
            // Format the partial date with blanks
            const month = data.executionMonth || '_______';
            const day = data.executionDay || '___';
            const year = data.executionYear || '____';
             data.executionDate = `${month} ${day}, ${year}`;
            } else {
            // If no date choice is made, require it
            throw new Error('Please select a date option');
            }
                
                // Ensure required fields are present
                if (!data.testatorName || !data.clientEmail || !data.primaryAgent || 
                    !data.executionCity || !data.executionState || !data.executionCounty) {
                    throw new Error('Please fill in all required fields');
                }
                
                // Ensure we have empty strings for optional fields if not provided
                data.secondAgent = data.secondAgent || '';
                data.thirdAgent = data.thirdAgent || '';
                data.clientPhone = data.clientPhone || '';
                data.additionalNotes = data.additionalNotes || '';
                
                // Add flags for Word document generation with blank lines
                data.generateWordDocument = true;
                data.useBlankLines = true;  // This tells backend to use _____ instead of checkboxes
                data.documentType = 'power-of-attorney';
                
                console.log('Sending data for Word document generation:', data);
                
                // Uncomment when backend is ready:
                const response = await fetch('/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('Response status:', response.status);
                
                const result = await response.json();
                console.log('Result:', result);
                
                if (!result.success) {
                    throw new Error(result.message || 'Word document generation failed');
                }
                
                loadingMessage.style.display = 'none';
                successMessage.style.display = 'block';
                this.reset();
               // Reset checkboxes and sections (only if they exist)
                const wantSecondAgent = document.getElementById('wantSecondAgent');
                const wantThirdAgent = document.getElementById('wantThirdAgent');
                const secondAgentSection = document.getElementById('secondAgentSection');
                const thirdAgentSection = document.getElementById('thirdAgentSection');
                const exactDateSection = document.getElementById('exactDateSection');
                const blankDateSection = document.getElementById('blankDateSection');
                
                if (wantSecondAgent) wantSecondAgent.checked = false;
                if (wantThirdAgent) wantThirdAgent.checked = false;
                if (secondAgentSection) secondAgentSection.classList.add('hidden');
                if (thirdAgentSection) thirdAgentSection.classList.add('hidden');
                if (exactDateSection) exactDateSection.classList.add('hidden');
                if (blankDateSection) blankDateSection.classList.add('hidden');
                
            } catch (error) {
                console.error('Error:', error);
                loadingMessage.style.display = 'none';
                errorMessage.style.display = 'block';
                
                // Show more specific error message
                const errorP = errorMessage.querySelector('p');
                errorP.textContent = error.message || 'There was an error generating your Word document. Please check your information and try again.';
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit for Review';
            }
        });
// Handle Medical POA form submission
document.getElementById('medicalPowerOfAttorneyForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const loadingMessage = document.getElementById('medicalLoadingMessage');
    const successMessage = document.getElementById('medicalSuccessMessage');
    const errorMessage = document.getElementById('medicalErrorMessage');
    
    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    loadingMessage.style.display = 'block';
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Generating Document...';
    
    try {
        const formData = new FormData(this);
        const data = {};
        
        // Process form data properly
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        // Handle date formatting for Medical POA
        if (data.medicalDateChoice === 'exact' && data.executionDate) {
            // Keep the exact date as entered
        } else if (data.medicalDateChoice === 'blank') {
            // Format the partial date with blanks
            const month = data.executionMonth || '_______';
            const day = data.executionDay || '___';
            const year = data.executionYear || '____';
            data.executionDate = `${month} ${day}, ${year}`;
        } else {
            // If no date choice is made, require it
            throw new Error('Please select a date option');
        }
        
        // Ensure required fields are present
        if (!data.testatorName || !data.clientEmail || !data.primaryAgent || 
            !data.executionCity || !data.executionState || !data.executionCounty) {
            throw new Error('Please fill in all required fields');
        }
        
        // Ensure we have empty strings for optional fields if not provided
        data.firstAlternateAgent = data.firstAlternateAgent || '';
        data.secondAlternateAgent = data.secondAlternateAgent || '';
        
        // Add flags for Word document generation
        data.generateWordDocument = true;
        data.documentType = 'medical-power-of-attorney';
        
        console.log('Sending Medical POA data:', data);
        
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Result:', result);
        
        if (!result.success) {
            throw new Error(result.message || 'Medical POA document generation failed');
        }
        
        loadingMessage.style.display = 'none';
        successMessage.style.display = 'block';
        this.reset();
        
        // Reset alternate agent sections
        const alternateSection = document.getElementById('alternateAgentsSection');
        const secondAlternateSection = document.getElementById('secondAlternateSection');
        const medicalExactDateSection = document.getElementById('medicalExactDateSection');
        const medicalBlankDateSection = document.getElementById('medicalBlankDateSection');
        
        if (alternateSection) alternateSection.classList.add('hidden');
        if (secondAlternateSection) secondAlternateSection.classList.add('hidden');
        if (medicalExactDateSection) medicalExactDateSection.classList.add('hidden');
        if (medicalBlankDateSection) medicalBlankDateSection.classList.add('hidden');
        
    } catch (error) {
        console.error('Error:', error);
        loadingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        
        // Show more specific error message
        const errorP = errorMessage.querySelector('p');
        errorP.textContent = error.message || 'There was an error generating your Medical Power of Attorney document. Please check your information and try again.';
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit for Review';
    }
});
        // Prevent form from submitting when user presses Enter in text fields
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
            });
        });

        // Add some visual feedback when form sections are completed
        document.querySelectorAll('input[required]').forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#27ae60';
                } else {
                    this.style.borderColor = '#ddd';
                }
            });
        });

        // Scroll to top when switching between home and form
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Add scroll to top when loading form
        document.getElementById('continueBtn').addEventListener('click', function() {
            setTimeout(scrollToTop, 100);
        });

        // Add scroll to top when going back to home
        document.querySelector('.back-btn').addEventListener('click', function() {
            setTimeout(scrollToTop, 100);
        });

        // Auto-resize textarea
        document.getElementById('additionalNotes').addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        // Form validation helper
        function validateForm() {
            const requiredFields = document.querySelectorAll('input[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    field.style.borderColor = '#27ae60';
                }
            });
            
            // Check date choice
            const dateChoice = document.querySelector('input[name="dateChoice"]:checked');
            if (!dateChoice) {
                isValid = false;
                document.querySelectorAll('input[name="dateChoice"]').forEach(radio => {
                    radio.parentElement.style.borderColor = '#e74c3c';
                });
            }
            
            return isValid;
        }

        // Add validation on form submit
        document.getElementById('powerOfAttorneyForm').addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
                const errorMessage = document.getElementById('errorMessage');
                const errorP = errorMessage.querySelector('p');
                errorP.textContent = 'Please fill in all required fields and make all necessary selections.';
                errorMessage.style.display = 'block';
                
                // Scroll to first error
                const firstError = document.querySelector('input[style*="border-color: rgb(231, 76, 60)"]');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });


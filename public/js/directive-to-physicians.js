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
// Toggle alternate agents section
function toggleAlternateAgents() {
    const alternateChoice = document.querySelector('input[name="alternateChoice"]:checked').value;
    const alternateAgentsSection = document.getElementById('alternateAgentsSection');
    
    if (alternateChoice === 'yes') {
        alternateAgentsSection.classList.remove('hidden');
    } else {
        alternateAgentsSection.classList.add('hidden');
        // Clear alternate agent fields when hiding
        document.getElementById('firstAlternateAgent').value = '';
        document.getElementById('secondAlternateAgent').value = '';
        document.getElementById('wantSecondAlternate').checked = false;
        document.getElementById('secondAlternateSection').classList.add('hidden');
    }
}

// Toggle second alternate agent
function toggleSecondAlternate() {
    const checkbox = document.getElementById('wantSecondAlternate');
    const secondAlternateSection = document.getElementById('secondAlternateSection');
    
    if (checkbox.checked) {
        secondAlternateSection.classList.remove('hidden');
    } else {
        secondAlternateSection.classList.add('hidden');
        document.getElementById('secondAlternateAgent').value = '';
    }
}

// Toggle date input sections
function toggleDateInput() {
    const dateChoice = document.querySelector('input[name="directiveDateChoice"]:checked').value;
    const exactDateSection = document.getElementById('exactDateSection');
    const blankDateSection = document.getElementById('blankDateSection');
    
    if (dateChoice === 'exact') {
        exactDateSection.classList.remove('hidden');
        blankDateSection.classList.add('hidden');
        // Clear blank date fields
        document.getElementById('executionMonth').value = '';
        document.getElementById('executionDay').value = '';
        document.getElementById('executionYear').value = '';
    } else {
        exactDateSection.classList.add('hidden');
        blankDateSection.classList.remove('hidden');
        // Clear exact date field
        document.getElementById('executionDate').value = '';
    }
}

// Help system functions
function showHelp(helpId) {
    document.getElementById('helpOverlay').style.display = 'block';
    document.getElementById(helpId).style.display = 'block';
}

function closeHelp() {
    document.getElementById('helpOverlay').style.display = 'none';
    const helpPopups = document.querySelectorAll('.help-popup');
    helpPopups.forEach(popup => popup.style.display = 'none');
}

// Form submission
document.getElementById('directiveToPhysiciansForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const loadingMessage = document.getElementById('loadingMessage');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Hide all messages initially
    loadingMessage.style.display = 'none';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Show loading message
    loadingMessage.style.display = 'block';
    
    // Collect form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    // Handle date logic
    const dateChoice = document.querySelector('input[name="directiveDateChoice"]:checked').value;
    if (dateChoice === 'exact') {
        data.executionDate = data.executionDate || '_____________';
    } else {
        // Build date from parts
        const month = data.executionMonth || '___________';
        const day = data.executionDay || '____';
        const year = data.executionYear || '______';
        data.executionDate = `${month} ${day}, ${year}`;
    }
    
    try {
        const response = await fetch('/submit/directive-to-physicians', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        loadingMessage.style.display = 'none';
        
        if (result.success) {
            successMessage.style.display = 'block';
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth' });
        } else {
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error:', error);
        loadingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth' });
    }
});
// Setup state expansion when page loads
document.addEventListener('DOMContentLoaded', function() {
    const executionStateField = document.getElementById('executionState');
    if (executionStateField) {
        executionStateField.addEventListener('blur', function() {
            const entered = this.value.trim().toUpperCase();
            if (stateAbbreviations[entered]) {
                this.value = stateAbbreviations[entered];
            }
        });
    }
});

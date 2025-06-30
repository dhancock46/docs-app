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

// Counter variables for dynamic child entries
let singleChildCount = 1;
let currentMarriageChildCount = 1;
let priorChildCount = 1;
let spousePriorChildCount = 1;

// Toggle marital status sections
function toggleMaritalSections() {
    const maritalStatus = document.querySelector('input[name="maritalStatus"]:checked').value;
    const spouseSection = document.getElementById('spouseSection');
    const marriedChildrenSection = document.getElementById('marriedChildrenSection');
    const singleChildrenSection = document.getElementById('singleChildrenSection');
    
    if (maritalStatus === 'married') {
        spouseSection.classList.remove('hidden');
        marriedChildrenSection.classList.remove('hidden');
        singleChildrenSection.classList.add('hidden');
        
        // Make spouse fields required
        document.getElementById('spouseName').required = true;
        document.querySelectorAll('input[name="spouseGender"]').forEach(radio => {
            radio.required = true;
        });
    } else {
        spouseSection.classList.add('hidden');
        marriedChildrenSection.classList.add('hidden');
        singleChildrenSection.classList.remove('hidden');
        
        // Remove required from spouse fields
        document.getElementById('spouseName').required = false;
        document.querySelectorAll('input[name="spouseGender"]').forEach(radio => {
            radio.required = false;
        });
        
        // Clear spouse data
        document.getElementById('spouseName').value = '';
        document.querySelectorAll('input[name="spouseGender"]').forEach(radio => {
            radio.checked = false;
        });
    }
    
    // Reset children sections when marital status changes
    resetChildrenSections();
}

// Toggle children section
function toggleChildrenSection() {
    const hasChildren = document.querySelector('input[name="hasChildren"]:checked').value;
    const childrenSection = document.getElementById('childrenSection');
    
    if (hasChildren === 'yes') {
        childrenSection.classList.remove('hidden');
    } else {
        childrenSection.classList.add('hidden');
        resetChildrenSections();
    }
}

// Toggle current marriage children
function toggleCurrentMarriageChildren() {
    const hasCurrentChildren = document.querySelector('input[name="hasCurrentMarriageChildren"]:checked');
    const currentMarriageChildrenDetails = document.getElementById('currentMarriageChildrenDetails');
    
    if (hasCurrentChildren && hasCurrentChildren.value === 'yes') {
        currentMarriageChildrenDetails.classList.remove('hidden');
    } else {
        currentMarriageChildrenDetails.classList.add('hidden');
        clearChildrenInputs('currentMarriageChildName[]');
        clearChildrenInputs('currentMarriageChildBirthday[]');
    }
    
    checkBlendedFamilyVisibility();
}

// Toggle prior children
function togglePriorChildren() {
    const hasPriorChildren = document.querySelector('input[name="hasPriorChildren"]:checked');
    const priorChildrenDetails = document.getElementById('priorChildrenDetails');
    
    if (hasPriorChildren && hasPriorChildren.value === 'yes') {
        priorChildrenDetails.classList.remove('hidden');
    } else {
        priorChildrenDetails.classList.add('hidden');
        clearChildrenInputs('priorChildName[]');
        clearChildrenInputs('priorChildBirthday[]');
    }
    
    checkBlendedFamilyVisibility();
}

// Toggle spouse prior children
function toggleSpousePriorChildren() {
    const hasSpousePriorChildren = document.querySelector('input[name="hasSpousePriorChildren"]:checked');
    const spousePriorChildrenDetails = document.getElementById('spousePriorChildrenDetails');
    
    if (hasSpousePriorChildren && hasSpousePriorChildren.value === 'yes') {
        spousePriorChildrenDetails.classList.remove('hidden');
    } else {
        spousePriorChildrenDetails.classList.add('hidden');
        clearChildrenInputs('spousePriorChildName[]');
        clearChildrenInputs('spousePriorChildBirthday[]');
    }
    
    checkBlendedFamilyVisibility();
}

// Check if blended family question should be visible
function checkBlendedFamilyVisibility() {
    const hasPriorChildren = document.querySelector('input[name="hasPriorChildren"]:checked');
    const hasSpousePriorChildren = document.querySelector('input[name="hasSpousePriorChildren"]:checked');
    const blendedFamilySection = document.getElementById('blendedFamilySection');
    
    // Show blended family question if either spouse has prior children
    if ((hasPriorChildren && hasPriorChildren.value === 'yes') || 
        (hasSpousePriorChildren && hasSpousePriorChildren.value === 'yes')) {
        blendedFamilySection.style.display = 'block';
    } else {
        blendedFamilySection.style.display = 'none';
        // Clear blended family selection
        document.querySelectorAll('input[name="blendedFamily"]').forEach(radio => {
            radio.checked = false;
        });
    }
}

// Add single child entry
function addSingleChild() {
    singleChildCount++;
    const childrenList = document.getElementById('singleChildrenList');
    const newChildEntry = document.createElement('div');
    newChildEntry.className = 'child-entry';
    newChildEntry.innerHTML = `
        <div class="form-group">
            <label for="singleChild${singleChildCount}Name">Child's Full Name</label>
            <input type="text" id="singleChild${singleChildCount}Name" name="singleChildName[]" class="child-name">
        </div>
        <div class="form-group">
            <label for="singleChild${singleChildCount}Birthday">Date of Birth</label>
            <input type="text" id="singleChild${singleChildCount}Birthday" name="singleChildBirthday[]" placeholder="Month Day, Year">
        </div>
        <button type="button" class="remove-child-btn" onclick="removeChildEntry(this)">Remove</button>
    `;
    childrenList.appendChild(newChildEntry);
}

// Add current marriage child entry
function addCurrentMarriageChild() {
    currentMarriageChildCount++;
    const childrenList = document.getElementById('currentMarriageChildrenList');
    const newChildEntry = document.createElement('div');
    newChildEntry.className = 'child-entry';
    newChildEntry.innerHTML = `
        <div class="form-group">
            <label for="currentChild${currentMarriageChildCount}Name">Child's Full Name</label>
            <input type="text" id="currentChild${currentMarriageChildCount}Name" name="currentMarriageChildName[]" class="child-name">
        </div>
        <div class="form-group">
            <label for="currentChild${currentMarriageChildCount}Birthday">Date of Birth</label>
            <input type="text" id="currentChild${currentMarriageChildCount}Birthday" name="currentMarriageChildBirthday[]" placeholder="Month Day, Year">
        </div>
        <button type="button" class="remove-child-btn" onclick="removeChildEntry(this)">Remove</button>
    `;
    childrenList.appendChild(newChildEntry);
}

// Add prior child entry
function addPriorChild() {
    priorChildCount++;
    const childrenList = document.getElementById('priorChildrenList');
    const newChildEntry = document.createElement('div');
    newChildEntry.className = 'child-entry';
    newChildEntry.innerHTML = `
        <div class="form-group">
            <label for="priorChild${priorChildCount}Name">Child's Full Name</label>
            <input type="text" id="priorChild${priorChildCount}Name" name="priorChildName[]" class="child-name">
        </div>
        <div class="form-group">
            <label for="priorChild${priorChildCount}Birthday">Date of Birth</label>
            <input type="text" id="priorChild${priorChildCount}Birthday" name="priorChildBirthday[]" placeholder="Month Day, Year">
        </div>
        <button type="button" class="remove-child-btn" onclick="removeChildEntry(this)">Remove</button>
    `;
    childrenList.appendChild(newChildEntry);
}

// Add spouse prior child entry
function addSpousePriorChild() {
    spousePriorChildCount++;
    const childrenList = document.getElementById('spousePriorChildrenList');
    const newChildEntry = document.createElement('div');
    newChildEntry.className = 'child-entry';
    newChildEntry.innerHTML = `
        <div class="form-group">
            <label for="spousePriorChild${spousePriorChildCount}Name">Child's Full Name</label>
            <input type="text" id="spousePriorChild${spousePriorChildCount}Name" name="spousePriorChildName[]" class="child-name">
        </div>
        <div class="form-group">
            <label for="spousePriorChild${spousePriorChildCount}Birthday">Date of Birth</label>
            <input type="text" id="spousePriorChild${spousePriorChildCount}Birthday" name="spousePriorChildBirthday[]" placeholder="Month Day, Year">
        </div>
        <button type="button" class="remove-child-btn" onclick="removeChildEntry(this)">Remove</button>
    `;
    childrenList.appendChild(newChildEntry);
}

// Remove child entry
function removeChildEntry(button) {
    const childEntry = button.parentElement;
    childEntry.remove();
}

// Clear children inputs by name
function clearChildrenInputs(inputName) {
    const inputs = document.querySelectorAll(`input[name="${inputName}"]`);
    inputs.forEach(input => {
        input.value = '';
    });
}

// Reset all children sections
function resetChildrenSections() {
    // Hide all married children sections
    document.getElementById('currentMarriageChildrenDetails').classList.add('hidden');
    document.getElementById('priorChildrenDetails').classList.add('hidden');
    document.getElementById('spousePriorChildrenDetails').classList.add('hidden');
    document.getElementById('blendedFamilySection').style.display = 'none';
    
    // Clear all radio selections
    document.querySelectorAll('input[name="hasCurrentMarriageChildren"]').forEach(radio => {
        radio.checked = false;
    });
    document.querySelectorAll('input[name="hasPriorChildren"]').forEach(radio => {
        radio.checked = false;
    });
    document.querySelectorAll('input[name="hasSpousePriorChildren"]').forEach(radio => {
        radio.checked = false;
    });
    document.querySelectorAll('input[name="blendedFamily"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Clear all children inputs
    clearChildrenInputs('singleChildName[]');
    clearChildrenInputs('singleChildBirthday[]');
    clearChildrenInputs('currentMarriageChildName[]');
    clearChildrenInputs('currentMarriageChildBirthday[]');
    clearChildrenInputs('priorChildName[]');
    clearChildrenInputs('priorChildBirthday[]');
    clearChildrenInputs('spousePriorChildName[]');
    clearChildrenInputs('spousePriorChildBirthday[]');
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
document.getElementById('willForm').addEventListener('submit', async function(e) {
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
    
    // Handle arrays for children data
    const singleChildNames = formData.getAll('singleChildName[]').filter(name => name.trim());
    const singleChildBirthdays = formData.getAll('singleChildBirthday[]').filter(birthday => birthday.trim());
    const currentMarriageChildNames = formData.getAll('currentMarriageChildName[]').filter(name => name.trim());
    const currentMarriageChildBirthdays = formData.getAll('currentMarriageChildBirthday[]').filter(birthday => birthday.trim());
    const priorChildNames = formData.getAll('priorChildName[]').filter(name => name.trim());
    const priorChildBirthdays = formData.getAll('priorChildBirthday[]').filter(birthday => birthday.trim());
    const spousePriorChildNames = formData.getAll('spousePriorChildName[]').filter(name => name.trim());
    const spousePriorChildBirthdays = formData.getAll('spousePriorChildBirthday[]').filter(birthday => birthday.trim());
    
    // Build children arrays
    data.singleChildren = singleChildNames.map((name, index) => ({
        name: name,
        birthday: singleChildBirthdays[index] || ''
    }));
    
    data.currentMarriageChildren = currentMarriageChildNames.map((name, index) => ({
        name: name,
        birthday: currentMarriageChildBirthdays[index] || ''
    }));
    
    data.priorChildren = priorChildNames.map((name, index) => ({
        name: name,
        birthday: priorChildBirthdays[index] || ''
    }));
    
    data.spousePriorChildren = spousePriorChildNames.map((name, index) => ({
        name: name,
        birthday: spousePriorChildBirthdays[index] || ''
    }));
    
    // Add document type
    data.documentType = 'will';
    data.section = 'personal-info';
    
    try {
        const response = await fetch('/submit/will', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        loadingMessage.style.display = 'none';
        
        if (result.success) {
            // Redirect to gifts section with user data
            const testatorName = encodeURIComponent(data.testatorName);
            const email = encodeURIComponent(data.clientEmail);
            window.location.href = `gifts.html?testatorName=${testatorName}&email=${email}`;
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
    const testatorStateField = document.getElementById('testatorState');
    if (testatorStateField) {
        testatorStateField.addEventListener('blur', function() {
            const entered = this.value.trim().toUpperCase();
            if (stateAbbreviations[entered]) {
                this.value = stateAbbreviations[entered];
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
    document.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });
});

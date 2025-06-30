// Counter variables for dynamic entries
let specificGiftCount = 1;
let charitableGiftCount = 1;

// Toggle gift sections based on checkboxes
function toggleGiftSections() {
    const spouseRetirement = document.getElementById('spouseRetirementGift').checked;
    const priorChildrenTrust = document.getElementById('priorChildrenTrust').checked;
    const specificPersonGifts = document.getElementById('specificPersonGifts').checked;
    const charitableGifts = document.getElementById('charitableGifts').checked;
    
    // Show/hide sections based on selections
    document.getElementById('spouseRetirementSection').classList.toggle('hidden', !spouseRetirement);
    document.getElementById('priorChildrenTrustSection').classList.toggle('hidden', !priorChildrenTrust);
    document.getElementById('specificPersonGiftsSection').classList.toggle('hidden', !specificPersonGifts);
    document.getElementById('charitableGiftsSection').classList.toggle('hidden', !charitableGifts);
}

// Toggle married options for specific gifts
function toggleMarriedOptions() {
    const isMarried = document.querySelector('input[name="isMarried"]:checked')?.value;
    const spouseNameSection = document.getElementById('spouseNameForGifts');
    const survivalConditions = document.querySelectorAll('[id^="giftSurvivalCondition"]');
    
    if (isMarried === 'yes') {
        spouseNameSection.classList.remove('hidden');
        survivalConditions.forEach(section => section.classList.remove('hidden'));
        document.getElementById('spouseNameGifts').required = true;
    } else {
        spouseNameSection.classList.add('hidden');
        survivalConditions.forEach(section => section.classList.add('hidden'));
        document.getElementById('spouseNameGifts').required = false;
        document.getElementById('spouseNameGifts').value = '';
    }
}

// Toggle married options for charitable gifts
function toggleCharityMarriedOptions() {
    const isMarried = document.querySelector('input[name="isMarriedCharity"]:checked')?.value;
    const spouseNameSection = document.getElementById('spouseNameForCharity');
    const survivalConditions = document.querySelectorAll('[id^="charitySurvivalCondition"]');
    
    if (isMarried === 'yes') {
        spouseNameSection.classList.remove('hidden');
        survivalConditions.forEach(section => section.classList.remove('hidden'));
        document.getElementById('spouseNameCharity').required = true;
    } else {
        spouseNameSection.classList.add('hidden');
        survivalConditions.forEach(section => section.classList.add('hidden'));
        document.getElementById('spouseNameCharity').required = false;
        document.getElementById('spouseNameCharity').value = '';
    }
}

// Add another specific gift entry
function addSpecificGift() {
    specificGiftCount++;
    const giftsList = document.getElementById('specificGiftsList');
    const isMarried = document.querySelector('input[name="isMarried"]:checked')?.value === 'yes';
    
    const newGiftEntry = document.createElement('div');
    newGiftEntry.className = 'specific-gift-entry';
    newGiftEntry.innerHTML = `
        <h4>Specific Gift #${specificGiftCount}</h4>
        <div class="form-group">
            <label for="specificGift${specificGiftCount}Description">Gift Description *</label>
            <input type="text" id="specificGift${specificGiftCount}Description" name="specificGiftDescription[]" placeholder="e.g., $5,000, my car, my jewelry collection">
        </div>
        <div class="form-group">
            <label for="specificGift${specificGiftCount}Recipient">Recipient's Full Name *</label>
            <input type="text" id="specificGift${specificGiftCount}Recipient" name="specificGiftRecipient[]" placeholder="Full legal name of recipient">
        </div>
        <div class="form-group">
            <label for="specificGift${specificGiftCount}Relationship">Relationship to You</label>
            <input type="text" id="specificGift${specificGiftCount}Relationship" name="specificGiftRelationship[]" placeholder="e.g., my daughter, my nephew, my friend">
        </div>
        <div class="form-group ${isMarried ? '' : 'hidden'}" id="giftSurvivalCondition${specificGiftCount}">
            <label>Should this gift be made if your spouse survives you? *</label>
            <div class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="giftIfSpouseSurvives${specificGiftCount}Yes" name="giftIfSpouseSurvives${specificGiftCount}" value="yes">
                    <label for="giftIfSpouseSurvives${specificGiftCount}Yes">Yes, make this gift even if my spouse survives me</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="giftIfSpouseSurvives${specificGiftCount}No" name="giftIfSpouseSurvives${specificGiftCount}" value="no">
                    <label for="giftIfSpouseSurvives${specificGiftCount}No">No, only make this gift if my spouse does not survive me</label>
                </div>
            </div>
        </div>
        <button type="button" class="remove-child-btn" onclick="removeSpecificGift(this)">Remove This Gift</button>
    `;
    giftsList.appendChild(newGiftEntry);
}

// Add another charitable gift entry
function addCharitableGift() {
    charitableGiftCount++;
    const giftsList = document.getElementById('charitableGiftsList');
    const isMarried = document.querySelector('input[name="isMarriedCharity"]:checked')?.value === 'yes';
    
    const newGiftEntry = document.createElement('div');
    newGiftEntry.className = 'charitable-gift-entry';
    newGiftEntry.innerHTML = `
        <h4>Charitable Gift #${charitableGiftCount}</h4>
        <div class="form-group">
            <label for="charitableGift${charitableGiftCount}Description">Gift Description *</label>
            <input type="text" id="charitableGift${charitableGiftCount}Description" name="charitableGiftDescription[]" placeholder="e.g., $1,000, 5% of my estate">
        </div>
        <div class="form-group">
            <label for="charitableGift${charitableGiftCount}Recipient">Charity Name *</label>
            <input type="text" id="charitableGift${charitableGiftCount}Recipient" name="charitableGiftRecipient[]" placeholder="Full legal name of charity">
        </div>
        <div class="form-group ${isMarried ? '' : 'hidden'}" id="charitySurvivalCondition${charitableGiftCount}">
            <label>Should this charitable gift be made if your spouse survives you? *</label>
            <div class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="charityIfSpouseSurvives${charitableGiftCount}Yes" name="charityIfSpouseSurvives${charitableGiftCount}" value="yes">
                    <label for="charityIfSpouseSurvives${charitableGiftCount}Yes">Yes, make this gift even if my spouse survives me</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="charityIfSpouseSurvives${charitableGiftCount}No" name="charityIfSpouseSurvives${charitableGiftCount}" value="no">
                    <label for="charityIfSpouseSurvives${charitableGiftCount}No">No, only make this gift if my spouse does not survive me</label>
                </div>
            </div>
        </div>
        <button type="button" class="remove-child-btn" onclick="removeCharitableGift(this)">Remove This Gift</button>
    `;
    giftsList.appendChild(newGiftEntry);
}

// Remove specific gift entry
function removeSpecificGift(button) {
    const giftEntry = button.parentElement;
    giftEntry.remove();
}

// Remove charitable gift entry
function removeCharitableGift(button) {
    const giftEntry = button.parentElement;
    giftEntry.remove();
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
document.getElementById('giftsForm').addEventListener('submit', async function(e) {
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
    
    // Handle arrays for gift data
    const specificGiftDescriptions = formData.getAll('specificGiftDescription[]').filter(desc => desc.trim());
    const specificGiftRecipients = formData.getAll('specificGiftRecipient[]').filter(recipient => recipient.trim());
    const specificGiftRelationships = formData.getAll('specificGiftRelationship[]').filter(rel => rel.trim());
    
    const charitableGiftDescriptions = formData.getAll('charitableGiftDescription[]').filter(desc => desc.trim());
    const charitableGiftRecipients = formData.getAll('charitableGiftRecipient[]').filter(recipient => recipient.trim());
    
    // Build gift arrays
    data.specificGifts = specificGiftDescriptions.map((desc, index) => ({
        description: desc,
        recipient: specificGiftRecipients[index] || '',
        relationship: specificGiftRelationships[index] || '',
        survivalCondition: data[`giftIfSpouseSurvives${index + 1}`] || 'no'
    }));
    
    data.charitableGifts = charitableGiftDescriptions.map((desc, index) => ({
        description: desc,
        recipient: charitableGiftRecipients[index] || '',
        survivalCondition: data[`charityIfSpouseSurvives${index + 1}`] || 'no'
    }));
    
    // Get selected gift types
    data.selectedGiftTypes = Array.from(document.querySelectorAll('input[name="giftTypes"]:checked')).map(cb => cb.value);
    
    // Add document type and section
    data.documentType = 'will';
    data.section = 'gifts';
    
    try {
        const response = await fetch('/submit/gifts', {
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

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    // Auto-populate testator name if coming from previous section
    const urlParams = new URLSearchParams(window.location.search);
    const testatorName = urlParams.get('testatorName');
    const email = urlParams.get('email');
    
    if (testatorName) {
        document.getElementById('testatorName').value = testatorName;
    }
    if (email) {
        document.getElementById('clientEmail').value = email;
    }
    
    // Prevent Enter key submission in text fields
    document.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });
});

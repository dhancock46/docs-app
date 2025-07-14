// Global variables
let alternateCount = 1;
let alternateCountDiff = 1;
let alternatePersonCount = 1;
let alternateEstateCount = 1;

// Validation function
function validateForm() {
    const errors = [];
    
    // Check guardian structure selection
    const structure = document.querySelector('input[name="guardianStructure"]:checked');
    if (!structure) {
        errors.push('Please select how you want to structure the guardianship');
        return { isValid: false, errors };
    }
    
    if (structure.value === 'same') {
        // Validate same guardian section
        const guardianType = document.querySelector('input[name="guardianTypeSame"]:checked');
        if (!guardianType) {
            errors.push('Please select guardian type for person and estate');
        } else {
            // Validate primary guardian
            const guardianName = document.getElementById('guardianSameName').value.trim();
            const guardianRelationship = document.getElementById('guardianSameRelationship').value.trim();
            const guardianAddress = document.getElementById('guardianSameAddress').value.trim();
            
            if (!guardianName) errors.push('Please enter the guardian\'s full name');
            if (!guardianRelationship) errors.push('Please enter the guardian\'s relationship to you');
            if (!guardianAddress) errors.push('Please enter the guardian\'s address');
            
            // Validate co-guardian if selected
            if (guardianType.value === 'co') {
                const coGuardianName = document.getElementById('coGuardianSameName').value.trim();
                const coGuardianRelationship = document.getElementById('coGuardianSameRelationship').value.trim();
                
                if (!coGuardianName) errors.push('Please enter the co-guardian\'s full name');
                if (!coGuardianRelationship) errors.push('Please enter the co-guardian\'s relationship to you');
            }
        }
        
        // Validate alternates if selected
        const wantAlternates = document.querySelector('input[name="wantAlternatesSame"]:checked');
        if (wantAlternates && wantAlternates.value === 'yes') {
            const firstAlternateName = document.getElementById('alternate1Name').value.trim();
            const firstAlternateRelationship = document.getElementById('alternate1Relationship').value.trim();
            const firstAlternateAddress = document.getElementById('alternate1Address').value.trim();
            
            if (!firstAlternateName) errors.push('Please enter the first alternate guardian\'s full name');
            if (!firstAlternateRelationship) errors.push('Please enter the first alternate guardian\'s relationship to you');
            if (!firstAlternateAddress) errors.push('Please enter the first alternate guardian\'s address');
        }
    } else if (structure.value === 'different') {
        // Validate person guardian
        const personType = document.querySelector('input[name="guardianTypePerson"]:checked');
        if (!personType) {
            errors.push('Please select guardian type for person');
        } else {
            const personName = document.getElementById('guardianPersonName').value.trim();
            const personRelationship = document.getElementById('guardianPersonRelationship').value.trim();
            const personAddress = document.getElementById('guardianPersonAddress').value.trim();
            
            if (!personName) errors.push('Please enter the guardian of person\'s full name');
            if (!personRelationship) errors.push('Please enter the guardian of person\'s relationship to you');
            if (!personAddress) errors.push('Please enter the guardian of person\'s address');
            
            if (personType.value === 'co') {
                const coPersonName = document.getElementById('coGuardianPersonName').value.trim();
                const coPersonRelationship = document.getElementById('coGuardianPersonRelationship').value.trim();
                
                if (!coPersonName) errors.push('Please enter the co-guardian of person\'s full name');
                if (!coPersonRelationship) errors.push('Please enter the co-guardian of person\'s relationship to you');
            }
        }
        
        // Validate estate guardian
        const estateType = document.querySelector('input[name="guardianTypeEstate"]:checked');
        if (!estateType) {
            errors.push('Please select guardian type for estate');
        } else {
            const estateName = document.getElementById('guardianEstateName').value.trim();
            const estateRelationship = document.getElementById('guardianEstateRelationship').value.trim();
            const estateAddress = document.getElementById('guardianEstateAddress').value.trim();
            
            if (!estateName) errors.push('Please enter the guardian of estate\'s full name');
            if (!estateRelationship) errors.push('Please enter the guardian of estate\'s relationship to you');
            if (!estateAddress) errors.push('Please enter the guardian of estate\'s address');
            
            if (estateType.value === 'co') {
                const coEstateName = document.getElementById('coGuardianEstateName').value.trim();
                const coEstateRelationship = document.getElementById('coGuardianEstateRelationship').value.trim();
                
                if (!coEstateName) errors.push('Please enter the co-guardian of estate\'s full name');
                if (!coEstateRelationship) errors.push('Please enter the co-guardian of estate\'s relationship to you');
            }
        }
        
        // Validate alternates if selected
        const wantAlternates = document.querySelector('input[name="wantAlternatesDiff"]:checked');
        if (wantAlternates && wantAlternates.value === 'yes') {
            const alternatesStructure = document.querySelector('input[name="alternatesStructure"]:checked');
            if (!alternatesStructure) {
                errors.push('Please select how you want to structure alternate guardians');
            } else if (alternatesStructure.value === 'same') {
                const firstAlternateName = document.getElementById('alternateDiff1Name');
                const firstAlternateRelationship = document.getElementById('alternateDiff1Relationship');
                const firstAlternateAddress = document.getElementById('alternateDiff1Address');
                
                if (firstAlternateName && !firstAlternateName.value.trim()) {
                    errors.push('Please enter the first alternate guardian\'s full name');
                }
                if (firstAlternateRelationship && !firstAlternateRelationship.value.trim()) {
                    errors.push('Please enter the first alternate guardian\'s relationship to you');
                }
                if (firstAlternateAddress && !firstAlternateAddress.value.trim()) {
                    errors.push('Please enter the first alternate guardian\'s address');
                }
            } else if (alternatesStructure.value === 'different') {
                // Validate person alternates
                const firstPersonName = document.getElementById('alternatePersonDiff1Name');
                const firstPersonRelationship = document.getElementById('alternatePersonDiff1Relationship');
                const firstPersonAddress = document.getElementById('alternatePersonDiff1Address');
                
                if (firstPersonName && !firstPersonName.value.trim()) {
                    errors.push('Please enter the first alternate guardian of person\'s full name');
                }
                if (firstPersonRelationship && !firstPersonRelationship.value.trim()) {
                    errors.push('Please enter the first alternate guardian of person\'s relationship to you');
                }
                if (firstPersonAddress && !firstPersonAddress.value.trim()) {
                    errors.push('Please enter the first alternate guardian of person\'s address');
                }
                
                // Validate estate alternates
                const firstEstateName = document.getElementById('alternateEstateDiff1Name');
                const firstEstateRelationship = document.getElementById('alternateEstateDiff1Relationship');
                const firstEstateAddress = document.getElementById('alternateEstateDiff1Address');
                
                if (firstEstateName && !firstEstateName.value.trim()) {
                    errors.push('Please enter the first alternate guardian of estate\'s full name');
                }
                if (firstEstateRelationship && !firstEstateRelationship.value.trim()) {
                    errors.push('Please enter the first alternate guardian of estate\'s relationship to you');
                }
                if (firstEstateAddress && !firstEstateAddress.value.trim()) {
                    errors.push('Please enter the first alternate guardian of estate\'s address');
                }
            }
        }
    }
    
    return { isValid: errors.length === 0, errors };
}

// Form submission handler
async function handleFormSubmission(event) {
    event.preventDefault();
    
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Hide all messages
    loadingMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
        const errorP = errorMessage.querySelector('p');
        errorP.textContent = 'Please fix the following issues:\n' + validation.errors.join('\n');
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // Show loading
    loadingMessage.style.display = 'block';
    loadingMessage.scrollIntoView({ behavior: 'smooth' });
    
    try {
        // Collect form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Add document type and section
        data.documentType = 'will';
        data.section = 'guardians';
        
        // Add current URL parameters to preserve data flow
        const urlParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlParams) {
            if (!data[key]) {
                data[key] = value;
            }
        }
        
        const response = await fetch('/submit/guardians', {
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
    
    // Add continue button to success message if it doesn't exist
    if (!successMessage.querySelector('.continue-btn')) {
        const continueButton = document.createElement('button');
        continueButton.type = 'button';
        continueButton.className = 'continue-btn';
        continueButton.textContent = 'Continue to Next Section →';
        continueButton.onclick = function() {
            const urlParams = new URLSearchParams(window.location.search);
            // Add current form data to URL parameters
            const formData = new FormData(document.getElementById('guardiansForm'));
            const data = Object.fromEntries(formData.entries());
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'string' || typeof data[key] === 'number') {
                    urlParams.set(key, data[key]);
                }
            });
            window.location.href = `trusts.html?${urlParams.toString()}`;
        };
        successMessage.appendChild(continueButton);
    }
} else {
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth' });
}
} catch (error) {
    console.error('Guardian submission error:', error);
    loadingMessage.style.display = 'none';
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth' });
}
}

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    // Auto-populate data from previous sections
    const urlParams = new URLSearchParams(window.location.search);
    const testatorName = urlParams.get('testatorName');
    
    if (testatorName) {
        console.log('Testator name:', testatorName);
    }
    
    // Set up form submission
    const form = document.getElementById('guardiansForm');
    form.addEventListener('submit', handleFormSubmission);
    
    // Add event listeners for summary updates
    document.addEventListener('change', updateSummary);
    
    // Prevent Enter key submission
    document.querySelectorAll('input[type="text"], textarea').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });
});

// Toggle guardian structure (same vs different)
function toggleGuardianStructure() {
    const structure = document.querySelector('input[name="guardianStructure"]:checked')?.value;
    const sameSection = document.getElementById('sameGuardianSection');
    const diffSection = document.getElementById('differentGuardiansSection');
    
    if (structure === 'same') {
        sameSection.style.display = 'block';
        diffSection.style.display = 'none';
        clearDifferentSectionData();
    } else if (structure === 'different') {
        sameSection.style.display = 'none';
        diffSection.style.display = 'block';
        clearSameSectionData();
    } else {
        sameSection.style.display = 'none';
        diffSection.style.display = 'none';
    }
    
    updateSummary();
}

// Toggle guardian type for same guardians
function toggleGuardianTypeSame() {
    const type = document.querySelector('input[name="guardianTypeSame"]:checked')?.value;
    const primaryGroup = document.getElementById('primaryGuardianSameGroup');
    const coGroup = document.getElementById('coGuardianSameGroup');
    
    if (type === 'single') {
        primaryGroup.style.display = 'block';
        coGroup.style.display = 'none';
        document.getElementById('coGuardianSameName').value = '';
        document.getElementById('coGuardianSameRelationship').value = '';
    } else if (type === 'co') {
        primaryGroup.style.display = 'block';
        coGroup.style.display = 'block';
    } else {
        primaryGroup.style.display = 'none';
        coGroup.style.display = 'none';
    }
    
    updateSummary();
}

// Toggle guardian type for person
function toggleGuardianTypePerson() {
    const type = document.querySelector('input[name="guardianTypePerson"]:checked')?.value;
    const primaryGroup = document.getElementById('primaryGuardianPersonGroup');
    const coGroup = document.getElementById('coGuardianPersonGroup');
    
    if (type === 'single') {
        primaryGroup.style.display = 'block';
        coGroup.style.display = 'none';
        document.getElementById('coGuardianPersonName').value = '';
        document.getElementById('coGuardianPersonRelationship').value = '';
    } else if (type === 'co') {
        primaryGroup.style.display = 'block';
        coGroup.style.display = 'block';
    } else {
        primaryGroup.style.display = 'none';
        coGroup.style.display = 'none';
    }
    
    updateSummary();
}

// Toggle guardian type for estate
function toggleGuardianTypeEstate() {
    const type = document.querySelector('input[name="guardianTypeEstate"]:checked')?.value;
    const primaryGroup = document.getElementById('primaryGuardianEstateGroup');
    const coGroup = document.getElementById('coGuardianEstateGroup');
    
    if (type === 'single') {
        primaryGroup.style.display = 'block';
        coGroup.style.display = 'none';
        document.getElementById('coGuardianEstateName').value = '';
        document.getElementById('coGuardianEstateRelationship').value = '';
    } else if (type === 'co') {
        primaryGroup.style.display = 'block';
        coGroup.style.display = 'block';
    } else {
        primaryGroup.style.display = 'none';
        coGroup.style.display = 'none';
    }
    
    updateSummary();
}

// Toggle alternates for same guardians
function toggleAlternatesSame() {
    const wantAlternates = document.querySelector('input[name="wantAlternatesSame"]:checked')?.value;
    const alternatesGroup = document.getElementById('alternatesSameGroup');
    
    if (wantAlternates === 'yes') {
        alternatesGroup.style.display = 'block';
    } else {
        alternatesGroup.style.display = 'none';
        clearAlternateFields();
    }
    
    updateSummary();
}

// Toggle alternates for different guardians
function toggleAlternatesDiff() {
    const wantAlternates = document.querySelector('input[name="wantAlternatesDiff"]:checked')?.value;
    const alternatesGroup = document.getElementById('alternatesDiffGroup');
    
    if (wantAlternates === 'yes') {
        alternatesGroup.style.display = 'block';
    } else {
        alternatesGroup.style.display = 'none';
        clearAlternateFieldsDiff();
    }
    
    updateSummary();
}

// Toggle alternates structure for different guardians
function toggleAlternatesStructure() {
    const structure = document.querySelector('input[name="alternatesStructure"]:checked')?.value;
    const sameStructureGroup = document.getElementById('alternatesSameStructureGroup');
    const diffStructureGroup = document.getElementById('alternatesDiffStructureGroup');
    
    if (structure === 'same') {
        if (sameStructureGroup) sameStructureGroup.style.display = 'block';
        if (diffStructureGroup) diffStructureGroup.style.display = 'none';
        clearAlternatePersonFields();
        clearAlternateEstateFields();
    } else if (structure === 'different') {
        if (sameStructureGroup) sameStructureGroup.style.display = 'none';
        if (diffStructureGroup) diffStructureGroup.style.display = 'block';
        clearAlternateFieldsDiff();
    } else {
        if (sameStructureGroup) sameStructureGroup.style.display = 'none';
        if (diffStructureGroup) diffStructureGroup.style.display = 'none';
    }
    
    updateSummary();
}

// Add alternate guardian (same section)
function addAlternateGuardian() {
    alternateCount++;
    const alternatesList = document.getElementById('alternatesList');
    
    const alternateDiv = document.createElement('div');
    alternateDiv.className = 'alternate-guardian';
    alternateDiv.id = `alternate${alternateCount}`;
    
    alternateDiv.innerHTML = `
        <h5>Alternate Guardian ${alternateCount}</h5>
        <div class="form-group">
            <label for="alternate${alternateCount}Name">Full Name *</label>
            <input type="text" id="alternate${alternateCount}Name" name="alternate${alternateCount}Name" placeholder="Full legal name">
        </div>
        <div class="form-group">
            <label for="alternate${alternateCount}Relationship">Relationship to You *</label>
            <input type="text" id="alternate${alternateCount}Relationship" name="alternate${alternateCount}Relationship" placeholder="e.g., my cousin, my friend">
        </div>
        <div class="form-group">
            <label for="alternate${alternateCount}Address">Address *</label>
            <textarea id="alternate${alternateCount}Address" name="alternate${alternateCount}Address" rows="3" placeholder="Full address including city, state, ZIP"></textarea>
        </div>
        <button type="button" class="btn-remove" onclick="removeAlternateGuardian(${alternateCount})">Remove This Alternate</button>
    `;
    
    alternatesList.appendChild(alternateDiv);
    updateSummary();
}

// Add alternate guardian (different section - same structure)
function addAlternateGuardianDiff() {
    alternateCountDiff++;
    const alternatesList = document.getElementById('alternatesListDiff');
    
    const alternateDiv = document.createElement('div');
    alternateDiv.className = 'alternate-guardian';
    alternateDiv.id = `alternateDiff${alternateCountDiff}`;
    
    alternateDiv.innerHTML = `
        <h5>Alternate Guardian ${alternateCountDiff}</h5>
        <div class="form-group">
            <label for="alternateDiff${alternateCountDiff}Name">Full Name *</label>
            <input type="text" id="alternateDiff${alternateCountDiff}Name" name="alternateDiff${alternateCountDiff}Name" placeholder="Full legal name">
        </div>
        <div class="form-group">
            <label for="alternateDiff${alternateCountDiff}Relationship">Relationship to You *</label>
            <input type="text" id="alternateDiff${alternateCountDiff}Relationship" name="alternateDiff${alternateCountDiff}Relationship" placeholder="e.g., my cousin, my friend">
        </div>
        <div class="form-group">
            <label for="alternateDiff${alternateCountDiff}Address">Address *</label>
            <textarea id="alternateDiff${alternateCountDiff}Address" name="alternateDiff${alternateCountDiff}Address" rows="3" placeholder="Full address including city, state, ZIP"></textarea>
        </div>
        <button type="button" class="btn-remove" onclick="removeAlternateGuardianDiff(${alternateCountDiff})">Remove This Alternate</button>
    `;
    
    alternatesList.appendChild(alternateDiv);
    updateSummary();
}

// Add alternate guardian for person
function addAlternateGuardianPerson() {
    const alternatesPersonList = document.getElementById('alternatesPersonList');
    const existingAlternates = alternatesPersonList.querySelectorAll('.alternate-guardian');
    const newId = existingAlternates.length + 1;
    
    const alternateDiv = document.createElement('div');
    alternateDiv.className = 'alternate-guardian';
    alternateDiv.id = `alternatePersonDiff${newId}`;
    
    alternateDiv.innerHTML = `
        <h6>Alternate Guardian of Person ${newId}</h6>
        <div class="form-group">
            <label for="alternatePersonDiff${newId}Name">Full Name *</label>
            <input type="text" id="alternatePersonDiff${newId}Name" name="alternatePersonDiff${newId}Name" placeholder="Full legal name">
        </div>
        <div class="form-group">
            <label for="alternatePersonDiff${newId}Relationship">Relationship to You *</label>
            <input type="text" id="alternatePersonDiff${newId}Relationship" name="alternatePersonDiff${newId}Relationship" placeholder="e.g., my cousin, my friend">
        </div>
        <div class="form-group">
            <label for="alternatePersonDiff${newId}Address">Address *</label>
            <textarea id="alternatePersonDiff${newId}Address" name="alternatePersonDiff${newId}Address" rows="3" placeholder="Full address including city, state, ZIP"></textarea>
        </div>
        <button type="button" class="btn-remove" onclick="removeAlternateGuardianPerson(${newId})">Remove This Alternate</button>
    `;
    
    alternatesPersonList.appendChild(alternateDiv);
    updateSummary();
}

// Add alternate guardian for estate
function addAlternateGuardianEstate() {
    const alternatesEstateList = document.getElementById('alternatesEstateList');
    const existingAlternates = alternatesEstateList.querySelectorAll('.alternate-guardian');
    const newId = existingAlternates.length + 1;
    
    const alternateDiv = document.createElement('div');
    alternateDiv.className = 'alternate-guardian';
    alternateDiv.id = `alternateEstateDiff${newId}`;
    
    alternateDiv.innerHTML = `
        <h6>Alternate Guardian of Estate ${newId}</h6>
        <div class="form-group">
            <label for="alternateEstateDiff${newId}Name">Full Name *</label>
            <input type="text" id="alternateEstateDiff${newId}Name" name="alternateEstateDiff${newId}Name" placeholder="Full legal name">
        </div>
        <div class="form-group">
            <label for="alternateEstateDiff${newId}Relationship">Relationship to You *</label>
            <input type="text" id="alternateEstateDiff${newId}Relationship" name="alternateEstateDiff${newId}Relationship" placeholder="e.g., my accountant, my brother">
        </div>
        <div class="form-group">
            <label for="alternateEstateDiff${newId}Address">Address *</label>
            <textarea id="alternateEstateDiff${newId}Address" name="alternateEstateDiff${newId}Address" rows="3" placeholder="Full address including city, state, ZIP"></textarea>
        </div>
        <button type="button" class="btn-remove" onclick="removeAlternateGuardianEstate(${newId})">Remove This Alternate</button>
    `;
    
    alternatesEstateList.appendChild(alternateDiv);
    updateSummary();
}

// Remove functions
function removeAlternateGuardian(id) {
    const alternate = document.getElementById(`alternate${id}`);
    if (alternate) {
        alternate.remove();
        updateSummary();
    }
}

function removeAlternateGuardianDiff(id) {
    const alternate = document.getElementById(`alternateDiff${id}`);
    if (alternate) {
        alternate.remove();
        updateSummary();
    }
}

function removeAlternateGuardianPerson(id) {
    const alternate = document.getElementById(`alternatePersonDiff${id}`);
    if (alternate) {
        alternate.remove();
        updateSummary();
    }
}

function removeAlternateGuardianEstate(id) {
    const alternate = document.getElementById(`alternateEstateDiff${id}`);
    if (alternate) {
        alternate.remove();
        updateSummary();
    }
}

// Clear data functions
function clearSameSectionData() {
    document.querySelectorAll('input[name="guardianTypeSame"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="wantAlternatesSame"]').forEach(radio => radio.checked = false);
    
    document.getElementById('guardianSameName').value = '';
    document.getElementById('guardianSameRelationship').value = '';
    document.getElementById('guardianSameAddress').value = '';
    document.getElementById('coGuardianSameName').value = '';
    document.getElementById('coGuardianSameRelationship').value = '';
    
    clearAlternateFields();
    
    document.getElementById('primaryGuardianSameGroup').style.display = 'none';
    document.getElementById('coGuardianSameGroup').style.display = 'none';
    document.getElementById('alternatesSameGroup').style.display = 'none';
}

function clearDifferentSectionData() {
    document.querySelectorAll('input[name="guardianTypePerson"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="guardianTypeEstate"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="wantAlternatesDiff"]').forEach(radio => radio.checked = false);
    
    document.getElementById('guardianPersonName').value = '';
    document.getElementById('guardianPersonRelationship').value = '';
    document.getElementById('guardianPersonAddress').value = '';
    document.getElementById('coGuardianPersonName').value = '';
    document.getElementById('coGuardianPersonRelationship').value = '';
    
    document.getElementById('guardianEstateName').value = '';
    document.getElementById('guardianEstateRelationship').value = '';
    document.getElementById('guardianEstateAddress').value = '';
    document.getElementById('coGuardianEstateName').value = '';
    document.getElementById('coGuardianEstateRelationship').value = '';
    
    clearAlternateFieldsDiff();
    
    document.getElementById('primaryGuardianPersonGroup').style.display = 'none';
    document.getElementById('coGuardianPersonGroup').style.display = 'none';
    document.getElementById('primaryGuardianEstateGroup').style.display = 'none';
    document.getElementById('coGuardianEstateGroup').style.display = 'none';
    document.getElementById('alternatesDiffGroup').style.display = 'none';
}

function clearAlternateFields() {
    const alternatesList = document.getElementById('alternatesList');
    const additionalAlternates = alternatesList.querySelectorAll('.alternate-guardian:not(#alternate1)');
    additionalAlternates.forEach(alt => alt.remove());
    
    document.getElementById('alternate1Name').value = '';
    document.getElementById('alternate1Relationship').value = '';
    document.getElementById('alternate1Address').value = '';
    
    alternateCount = 1;
}

function clearAlternateFieldsDiff() {
    const alternatesList = document.getElementById('alternatesListDiff');
    if (alternatesList) {
        const additionalAlternates = alternatesList.querySelectorAll('.alternate-guardian:not(#alternateDiff1)');
        additionalAlternates.forEach(alt => alt.remove());
        
        const nameField = document.getElementById('alternateDiff1Name');
        const relationshipField = document.getElementById('alternateDiff1Relationship');
        const addressField = document.getElementById('alternateDiff1Address');
        
        if (nameField) nameField.value = '';
        if (relationshipField) relationshipField.value = '';
        if (addressField) addressField.value = '';
    }
    
    alternateCountDiff = 1;
}

function clearAlternatePersonFields() {
    const alternatesPersonList = document.getElementById('alternatesPersonList');
    if (alternatesPersonList) {
        const additionalAlternates = alternatesPersonList.querySelectorAll('.alternate-guardian:not(#alternatePersonDiff1)');
        additionalAlternates.forEach(alt => alt.remove());
        
        const nameField = document.getElementById('alternatePersonDiff1Name');
        const relationshipField = document.getElementById('alternatePersonDiff1Relationship');
        const addressField = document.getElementById('alternatePersonDiff1Address');
        
        if (nameField) nameField.value = '';
        if (relationshipField) relationshipField.value = '';
        if (addressField) addressField.value = '';
    }
}

function clearAlternateEstateFields() {
    const alternatesEstateList = document.getElementById('alternatesEstateList');
    if (alternatesEstateList) {
        const additionalAlternates = alternatesEstateList.querySelectorAll('.alternate-guardian:not(#alternateEstateDiff1)');
        additionalAlternates.forEach(alt => alt.remove());
        
        const nameField = document.getElementById('alternateEstateDiff1Name');
        const relationshipField = document.getElementById('alternateEstateDiff1Relationship');
        const addressField = document.getElementById('alternateEstateDiff1Address');
        
        if (nameField) nameField.value = '';
        if (relationshipField) relationshipField.value = '';
        if (addressField) addressField.value = '';
    }
}

// Update summary
function updateSummary() {
    const summaryDiv = document.getElementById('guardianSummary');
    const structure = document.querySelector('input[name="guardianStructure"]:checked')?.value;
    
    if (!structure) {
        summaryDiv.style.display = 'none';
        return;
    }
    
    let summaryHTML = '<h4>Guardian Nominations Summary</h4>';
    
    if (structure === 'same') {
        const guardianType = document.querySelector('input[name="guardianTypeSame"]:checked')?.value;
        const guardianName = document.getElementById('guardianSameName').value;
        const coGuardianName = document.getElementById('coGuardianSameName').value;
        
        if (guardianType === 'single' && guardianName) {
            summaryHTML += `<p><strong>Guardian of Person and Estate:</strong> ${guardianName}</p>`;
        } else if (guardianType === 'co' && guardianName && coGuardianName) {
            summaryHTML += `<p><strong>Co-Guardians of Person and Estate:</strong> ${guardianName} and ${coGuardianName}</p>`;
        }
        
        // Add alternates summary
        const wantAlternates = document.querySelector('input[name="wantAlternatesSame"]:checked')?.value;
        if (wantAlternates === 'yes') {
            const alternates = document.querySelectorAll('#alternatesList .alternate-guardian');
            const alternateNames = [];
            alternates.forEach(alt => {
                const nameInput = alt.querySelector('input[name*="Name"]');
                if (nameInput && nameInput.value) {
                    alternateNames.push(nameInput.value);
                }
            });
            if (alternateNames.length > 0) {
                summaryHTML += `<p><strong>Alternate Guardians:</strong> ${alternateNames.join(', ')}</p>`;
            }
        }
    } else if (structure === 'different') {
    // Add alternates summary
    const wantAlternates = document.querySelector('input[name="wantAlternatesSame"]:checked')?.value;
    if (wantAlternates === 'yes') {
        const alternates = document.querySelectorAll('#alternatesList .alternate-guardian');
        const alternateNames = [];
        alternates.forEach(alt => {
            const nameInput = alt.querySelector('input[name*="Name"]');
            if (nameInput && nameInput.value) {
                alternateNames.push(nameInput.value);
            }
        });
        if (alternateNames.length > 0) {
            summaryHTML += `<p><strong>Alternate Guardians:</strong> ${alternateNames.join(', ')}</p>`;
        }
    }
} else if (structure === 'different') {
    // Person guardian summary
    const personType = document.querySelector('input[name="guardianTypePerson"]:checked')?.value;
    const personName = document.getElementById('guardianPersonName').value;
    const coPersonName = document.getElementById('coGuardianPersonName').value;
    
    if (personType === 'single' && personName) {
        summaryHTML += `<p><strong>Guardian of Person:</strong> ${personName}</p>`;
    } else if (personType === 'co' && personName && coPersonName) {
        summaryHTML += `<p><strong>Co-Guardians of Person:</strong> ${personName} and ${coPersonName}</p>`;
    }
    
    // Estate guardian summary
    const estateType = document.querySelector('input[name="guardianTypeEstate"]:checked')?.value;
    const estateName = document.getElementById('guardianEstateName').value;
    const coEstateName = document.getElementById('coGuardianEstateName').value;
    
    if (estateType === 'single' && estateName) {
        summaryHTML += `<p><strong>Guardian of Estate:</strong> ${estateName}</p>`;
    } else if (estateType === 'co' && estateName && coEstateName) {
        summaryHTML += `<p><strong>Co-Guardians of Estate:</strong> ${estateName} and ${coEstateName}</p>`;
    }
    
    // Add alternates summary for different guardians
    const wantAlternates = document.querySelector('input[name="wantAlternatesDiff"]:checked')?.value;
    if (wantAlternates === 'yes') {
        const alternatesStructure = document.querySelector('input[name="alternatesStructure"]:checked')?.value;
        
        if (alternatesStructure === 'same') {
            // Same alternates for both person and estate
            const alternates = document.querySelectorAll('#alternatesListDiff .alternate-guardian');
            const alternateNames = [];
            alternates.forEach(alt => {
                const nameInput = alt.querySelector('input[name*="Name"]');
                if (nameInput && nameInput.value) {
                    alternateNames.push(nameInput.value);
                }
            });
            if (alternateNames.length > 0) {
                summaryHTML += `<p><strong>Alternate Guardians (Person & Estate):</strong> ${alternateNames.join(', ')}</p>`;
            }
        } else if (alternatesStructure === 'different') {
            // Different alternates for person and estate
            const personAlternates = document.querySelectorAll('#alternatesPersonList .alternate-guardian');
            const personNames = [];
            personAlternates.forEach(alt => {
                const nameInput = alt.querySelector('input[name*="Name"]');
                if (nameInput && nameInput.value) {
                    personNames.push(nameInput.value);
                }
            });
            if (personNames.length > 0) {
                summaryHTML += `<p><strong>Alternate Guardians of Person:</strong> ${personNames.join(', ')}</p>`;
            }
            
            const estateAlternates = document.querySelectorAll('#alternatesEstateList .alternate-guardian');
            const estateNames = [];
            estateAlternates.forEach(alt => {
                const nameInput = alt.querySelector('input[name*="Name"]');
                if (nameInput && nameInput.value) {
                    estateNames.push(nameInput.value);
                }
            });
            if (estateNames.length > 0) {
                summaryHTML += `<p><strong>Alternate Guardians of Estate:</strong> ${estateNames.join(', ')}</p>`;
            }
        }
    }
}

summaryDiv.innerHTML = summaryHTML;
summaryDiv.style.display = 'block';
displayGuardianshipProvisions();
}
// Function to get minor children count and determine singular/plural
function getMinorChildrenInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const childrenData = urlParams.get('childrenData');
    
    if (!childrenData) return { count: 1, isPlural: false }; // Default to singular if no data
    
    try {
        const children = JSON.parse(decodeURIComponent(childrenData));
        const currentDate = new Date();
        let minorChildrenCount = 0;
        
        for (let child of children) {
            if (child.birthday) {
                const birthDate = new Date(child.birthday);
                const age = Math.floor((currentDate - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
                if (age < 18) {
                    minorChildrenCount++;
                }
            }
        }
        
        return {
            count: minorChildrenCount,
            isPlural: minorChildrenCount !== 1
        };
    } catch (error) {
        console.error('Error parsing children data:', error);
        return { count: 1, isPlural: false }; // Default to singular if error
    }
}

// Function to generate and display guardianship provisions
function displayGuardianshipProvisions() {
    const childrenInfo = getMinorChildrenInfo();
    const isPlural = childrenInfo.isPlural;
    
    const childText = isPlural ? 'children' : 'child';
    const introText = isPlural 
        ? 'I have given careful attention to the selection of guardians for my minor children. I believe the person or persons I have nominated will provide loving and thoughtful care to my children.'
        : 'I have given careful attention to the selection of a guardian for my minor child. I believe the person or persons I have nominated will provide loving and thoughtful care to my child.';
    
    const ifText = isPlural
        ? 'If the guardian I have nominated is appointed as guardian, in any capacity, of my minor children:'
        : 'If the guardian I have nominated is appointed as guardian, in any capacity, of my minor child:';
    
    const discretionText = isPlural
        ? '(a) I want the guardian to have as much discretion in dealing with the person and estate of my minor children as is permissible under applicable law; and'
        : '(a) I want the guardian to have as much discretion in dealing with the person and estate of my minor child as is permissible under applicable law; and';
    
    let provisionsContainer = document.getElementById('guardianshipProvisions');
    
    if (!provisionsContainer) {
        // Create the container after the summary section
        const summarySection = document.getElementById('guardianSummary').parentElement;
        const provisionsDiv = document.createElement('div');
        provisionsDiv.id = 'guardianshipProvisions';
        provisionsDiv.className = 'form-section';
        summarySection.appendChild(provisionsDiv);
        provisionsContainer = provisionsDiv;
    }
    
    provisionsContainer.innerHTML = `
        <h3>GUARDIANSHIP PROVISIONS</h3>
        <div class="guardianship-text">
            <p>${introText} I have made this choice based upon my belief of what is best for my ${childText} and I ask my family to honor my decision.</p>
            
            <p>${ifText}</p>
            
            <p>${discretionText}</p>
            
            <p>(b) Unless required by applicable law, no bond shall be required of such person.</p>
            
            <p>(c) Co-guardians must both agree prior to taking any action, if they are both serving. If one co-guardian is unable or unwilling to serve or continue to serve, the other co-guardian shall serve or continue to serve as the sole guardian.</p>
        </div>
    `;
    
    provisionsContainer.style.display = 'block';
}
// Continue to next section
function continueToReview() {
    const urlParams = new URLSearchParams(window.location.search);
    window.location.href = `final-review.html?${urlParams.toString()}`;
}

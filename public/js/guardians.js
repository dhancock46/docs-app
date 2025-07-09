// Global variables
let alternateCount = 1;
let alternateCountDiff = 1;

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
});

// Toggle guardian structure (same vs different)
function toggleGuardianStructure() {
    const structure = document.querySelector('input[name="guardianStructure"]:checked')?.value;
    const sameSection = document.getElementById('sameGuardianSection');
    const diffSection = document.getElementById('differentGuardiansSection');
    
    if (structure === 'same') {
        sameSection.style.display = 'block';
        diffSection.style.display = 'none';
        // Clear different section data
        clearDifferentSectionData();
    } else if (structure === 'different') {
        sameSection.style.display = 'none';
        diffSection.style.display = 'block';
        // Clear same section data
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
        // Clear co-guardian fields
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
        // Clear co-guardian fields
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
        // Clear co-guardian fields
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
        // Clear alternate fields
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
        // Clear alternate fields
        clearAlternateFieldsDiff();
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

// Add alternate guardian (different section)
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

// Remove alternate guardian (same section)
function removeAlternateGuardian(id) {
    const alternate = document.getElementById(`alternate${id}`);
    if (alternate) {
        alternate.remove();
        updateSummary();
    }
}

// Remove alternate guardian (different section)
function removeAlternateGuardianDiff(id) {
    const alternate = document.getElementById(`alternateDiff${id}`);
    if (alternate) {
        alternate.remove();
        updateSummary();
    }
}

// Clear data functions
function clearSameSectionData() {
    // Clear radio buttons
    document.querySelectorAll('input[name="guardianTypeSame"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="wantAlternatesSame"]').forEach(radio => radio.checked = false);
    
    // Clear text fields
    document.getElementById('guardianSameName').value = '';
    document.getElementById('guardianSameRelationship').value = '';
    document.getElementById('guardianSameAddress').value = '';
    document.getElementById('coGuardianSameName').value = '';
    document.getElementById('coGuardianSameRelationship').value = '';
    
    // Clear alternates
    clearAlternateFields();
    
    // Hide sections
    document.getElementById('primaryGuardianSameGroup').style.display = 'none';
    document.getElementById('coGuardianSameGroup').style.display = 'none';
    document.getElementById('alternatesSameGroup').style.display = 'none';
}

function clearDifferentSectionData() {
    // Clear radio buttons
    document.querySelectorAll('input[name="guardianTypePerson"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="guardianTypeEstate"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="wantAlternatesDiff"]').forEach(radio => radio.checked = false);
    
    // Clear person guardian fields
    document.getElementById('guardianPersonName').value = '';
    document.getElementById('guardianPersonRelationship').value = '';
    document.getElementById('guardianPersonAddress').value = '';
    document.getElementById('coGuardianPersonName').value = '';
    document.getElementById('coGuardianPersonRelationship').value = '';
    
    // Clear estate guardian fields
    document.getElementById('guardianEstateName').value = '';
    document.getElementById('guardianEstateRelationship').value = '';
    document.getElementById('guardianEstateAddress').value = '';
    document.getElementById('coGuardianEstateName').value = '';
    document.getElementById('coGuardianEstateRelationship').value = '';
    
    // Clear alternates
    clearAlternateFieldsDiff();
    
    // Hide sections
    document.getElementById('primaryGuardianPersonGroup').style.display = 'none';
    document.getElementById('coGuardianPersonGroup').style.display = 'none';
    document.getElementById('primaryGuardianEstateGroup').style.display = 'none';
    document.getElementById('coGuardianEstateGroup').style.display = 'none';
    document.getElementById('alternatesDiffGroup').style.display = 'none';
}

function clearAlternateFields() {
    const alternatesList = document.getElementById('alternatesList');
    // Keep first alternate, clear additional ones
    const additionalAlternates = alternatesList.querySelectorAll('.alternate-guardian:not(#alternate1)');
    additionalAlternates.forEach(alt => alt.remove());
    
    // Clear first alternate fields
    document.getElementById('alternate1Name').value = '';
    document.getElementById('alternate1Relationship').value = '';
    document.getElementById('alternate1Address').value = '';
    
    alternateCount = 1;
}

function clearAlternateFieldsDiff() {
    const alternatesList = document.getElementById('alternatesListDiff');
    // Keep first alternate, clear additional ones
    const additionalAlternates = alternatesList.querySelectorAll('.alternate-guardian:not(#alternateDiff1)');
    additionalAlternates.forEach(alt => alt.remove());
    
    // Clear first alternate fields
    document.getElementById('alternateDiff1Name').value = '';
    document.getElementById('alternateDiff1Relationship').value = '';
    document.getElementById('alternateDiff1Address').value = '';
    
    alternateCountDiff = 1;
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
        
        // Add alternates summary
        const wantAlternates = document.querySelector('input[name="wantAlternatesDiff"]:checked')?.value;
        if (wantAlternates === 'yes') {
            const alternates = document.querySelectorAll('#alternatesListDiff .alternate-guardian');
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
    }
    
    summaryDiv.innerHTML = summaryHTML;
    summaryDiv.style.display = 'block';
}

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
            
            if (!guardianName) {
                errors.push('Please enter the guardian\'s full name');
            }
            if (!guardianRelationship) {
                errors.push('Please enter the guardian\'s relationship to you');
            }
            if (!guardianAddress) {
                errors.push('Please enter the guardian\'s address');
            }
            
            // Validate co-guardian if selected
            if (guardianType.value === 'co') {
                const coGuardianName = document.getElementById('coGuardianSameName').value.trim();
                const coGuardianRelationship = document.getElementById('coGuardianSameRelationship').value.trim();
                
                if (!coGuardianName) {
                    errors.push('Please enter the co-guardian\'s full name');
                }
                if (!coGuardianRelationship) {
                    errors.push('Please enter the co-guardian\'s relationship to you');
                }
            }
        }
        
        // Validate alternates if selected
        const wantAlternates = document.querySelector('input[name="wantAlternatesSame"]:checked');
        if (wantAlternates && wantAlternates.value === 'yes') {
            const firstAlternateName = document.getElementById('alternate1Name').value.trim();
            const firstAlternateRelationship = document.getElementById('alternate1Relationship').value.trim();
            const firstAlternateAddress = document.getElementById('alternate1Address').value.trim();
            
            if (!firstAlternateName) {
                errors.push('Please enter the first alternate guardian\'s full name');
            }
            if (!firstAlternateRelationship) {
                errors.push('Please enter the first alternate guardian\'s relationship to you');
            }
            if (!firstAlternateAddress) {
                errors.push('Please enter the first alternate guardian\'s address');
            }
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
            
            if (!personName) {
                errors.push('Please enter the guardian of person\'s full name');
            }
            if (!personRelationship) {
                errors.push('Please enter the guardian of person\'s relationship to you');
            }
            if (!personAddress) {
                errors.push('Please enter the guardian of person\'s address');
            }
            
            if (personType.value === 'co') {
                const coPersonName = document.getElementById('coGuardianPersonName').value.trim();
                const coPersonRelationship = document.getElementById('coGuardianPersonRelationship').value.trim();
                
                if (!coPersonName) {
                    errors.push('Please enter the co-guardian of person\'s full name');
                }
                if (!coPersonRelationship) {
                    errors.push('Please enter the co-guardian of person\'s relationship to you');
                }
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
            
            if (!estateName) {
                errors.push('Please enter the guardian of estate\'s full name');
            }
            if (!estateRelationship) {
                errors.push('Please enter the guardian of estate\'s relationship to you');
            }
            if (!estateAddress) {
                errors.push('Please enter the guardian of estate\'s address');
            }
            
            if (estateType.value === 'co') {
                const coEstateName = document.getElementById('coGuardianEstateName').value.trim();
                const coEstateRelationship = document.getElementById('coGuardianEstateRelationship').value.trim();
                
                if (!coEstateName) {
                    errors.push('Please enter the co-guardian of estate\'s full name');
                }
                if (!coEstateRelationship) {
                    errors.push('Please enter the co-guardian of estate\'s relationship to you');
                }
            }
        }
        
        // Validate alternates if selected
        const wantAlternates = document.querySelector('input[name="wantAlternatesDiff"]:checked');
        if (wantAlternates && wantAlternates.value === 'yes') {
            const firstAlternateName = document.getElementById('alternateDiff1Name').value.trim();
            const firstAlternateRelationship = document.getElementById('alternateDiff1Relationship').value.trim();
            const firstAlternateAddress = document.getElementById('alternateDiff1Address').value.trim();
            
            if (!firstAlternateName) {
                errors.push('Please enter the first alternate guardian\'s full name');
            }
            if (!firstAlternateRelationship) {
                errors.push('Please enter the first alternate guardian\'s relationship to you');
            }
            if (!firstAlternateAddress) {
                errors.push('Please enter the first alternate guardian\'s address');
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
        alert('Please correct the following errors:\n\n' + validation.errors.join('\n'));
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
    // Toggle alternates structure for different guardians
function toggleAlternatesStructure() {
    const structure = document.querySelector('input[name="alternatesStructure"]:checked')?.value;
    const sameStructureGroup = document.getElementById('alternatesSameStructureGroup');
    const diffStructureGroup = document.getElementById('alternatesDiffStructureGroup');
    
    if (structure === 'same') {
        sameStructureGroup.style.display = 'block';
        diffStructureGroup.style.display = 'none';
        // Clear different structure fields
        clearAlternatePersonFields();
        clearAlternateEstateFields();
    } else if (structure === 'different') {
        sameStructureGroup.style.display = 'none';
        diffStructureGroup.style.display = 'block';
        // Clear same structure fields
        clearAlternateFieldsDiff();
    } else {
        sameStructureGroup.style.display = 'none';
        diffStructureGroup.style.display = 'none';
    }
    
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

// Remove alternate guardian functions
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

// Clear functions for new structure
function clearAlternatePersonFields() {
    const alternatesPersonList = document.getElementById('alternatesPersonList');
    const additionalAlternates = alternatesPersonList.querySelectorAll('.alternate-guardian:not(#alternatePersonDiff1)');
    additionalAlternates.forEach(alt => alt.remove());
    
    // Clear first alternate fields
    document.getElementById('alternatePersonDiff1Name').value = '';
    document.getElementById('alternatePersonDiff1Relationship').value = '';
    document.getElementById('alternatePersonDiff1Address').value = '';
}

function clearAlternateEstateFields() {
    const alternatesEstateList = document.getElementById('alternatesEstateList');
    const additionalAlternates = alternatesEstateList.querySelectorAll('.alternate-guardian:not(#alternateEstateDiff1)');
    additionalAlternates.forEach(alt => alt.remove());
    
    // Clear first alternate fields
    document.getElementById('alternateEstateDiff1Name').value = '';
    document.getElementById('alternateEstateDiff1Relationship').value = '';
    document.getElementById('alternateEstateDiff1Address').value = '';
}


// Continue to next section
function continueToReview() {
    const urlParams = new URLSearchParams(window.location.search);
    window.location.href = `final-review.html?${urlParams.toString()}`;
}

// Add event listeners for summary updates
document.addEventListener('input', updateSummary);
document.addEventListener('change', updateSummary);

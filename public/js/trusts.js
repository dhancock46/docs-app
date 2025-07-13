// Global variables
let alternateTrusteeCount = 1;
let priorChildrenAlternateTrusteeCount = 1;
let currentUserData = {};

document.addEventListener('DOMContentLoaded', function() {
    // Auto-populate data from previous sections
    const urlParams = new URLSearchParams(window.location.search);
    
    // Extract user data
    currentUserData = {
        testatorName: urlParams.get('testatorName'),
        maritalStatus: urlParams.get('maritalStatus'),
        hasChildren: urlParams.get('hasChildren'),
        hasMinorChildren: urlParams.get('hasMinorChildren'),
        hasMultipleChildren: urlParams.get('hasMultipleChildren'),
        hasPriorChildren: urlParams.get('hasPriorChildren'),
        childrenData: urlParams.get('childrenData')
    };
    
    console.log('Trust form loaded with user data:', currentUserData);
    
    // Show prior children trust section if applicable
    if (currentUserData.maritalStatus === 'married' && currentUserData.hasPriorChildren === 'yes') {
        document.getElementById('priorChildrenTrustSection').classList.remove('hidden');
    }
    
    // Add form change listener
    document.addEventListener('change', updateSummary);
});

// Toggle trust sections based on whether user wants to create trusts
function toggleTrustSections() {
    const createTrust = document.querySelector('input[name="createTrust"]:checked').value;
    const trustConfigSection = document.getElementById('trustConfigSection');
    
    if (createTrust === 'yes') {
        trustConfigSection.classList.remove('hidden');
    } else {
        trustConfigSection.classList.add('hidden');
        resetTrustForm();
    }
    
    updateSummary();
}

// Toggle trust type details
function toggleTrustTypeDetails() {
    // No specific details needed for trust type selection, just update summary
    updateSummary();
}

// Toggle trustee structure sections
function toggleTrusteeStructure() {
    const structure = document.querySelector('input[name="trusteeStructure"]:checked').value;
    const singleSection = document.getElementById('singleTrusteeSection');
    const coSection = document.getElementById('coTrusteesSection');
    
    if (structure === 'single') {
        singleSection.classList.remove('hidden');
        coSection.classList.add('hidden');
        
        // Clear co-trustee fields
        document.getElementById('coTrustee1Name').value = '';
        document.getElementById('coTrustee1Relationship').value = '';
        document.getElementById('coTrustee2Name').value = '';
        document.getElementById('coTrustee2Relationship').value = '';
    } else if (structure === 'co-trustees') {
        singleSection.classList.add('hidden');
        coSection.classList.remove('hidden');
        
        // Clear single trustee fields
        document.getElementById('primaryTrustee').value = '';
        document.getElementById('primaryTrusteeRelationship').value = '';
    }
    
    updateSummary();
}

// Toggle prior children trust details
function togglePriorChildrenTrustDetails() {
    const createPriorTrust = document.querySelector('input[name="priorChildrenTrust"]:checked').value;
    const detailsSection = document.getElementById('priorChildrenTrustDetails');
    
    if (createPriorTrust === 'yes') {
        detailsSection.classList.remove('hidden');
    } else {
        detailsSection.classList.add('hidden');
        
        // Clear prior children trust fields
        document.getElementById('priorChildrenTrustEndAge').value = '';
        document.getElementById('priorChildrenTrustPrimaryTrustee').value = '';
        clearPriorChildrenAlternateTrustees();
    }
    
    updateSummary();
}

// Add alternate trustee
function addAlternateTrustee() {
    alternateTrusteeCount++;
    const container = document.getElementById('alternateTrusteesList');
    
    const trusteeEntry = document.createElement('div');
    trusteeEntry.className = 'trustee-entry';
    trusteeEntry.innerHTML = `
        <h6>Alternate Trustee #${alternateTrusteeCount}</h6>
        <div class="form-group">
            <label for="alternateTrustee${alternateTrusteeCount}Name">Full Name</label>
            <input type="text" id="alternateTrustee${alternateTrusteeCount}Name" name="alternateTrusteeName[]" placeholder="Full legal name (optional)">
        </div>
        <div class="form-group">
            <label for="alternateTrustee${alternateTrusteeCount}Relationship">Relationship to you</label>
            <input type="text" id="alternateTrustee${alternateTrusteeCount}Relationship" name="alternateTrusteeRelationship[]" placeholder="e.g., my cousin">
        </div>
        <button type="button" onclick="removeAlternateTrustee(this)" class="remove-btn">Remove This Trustee</button>
    `;
    
    container.appendChild(trusteeEntry);
}

// Remove alternate trustee
function removeAlternateTrustee(button) {
    button.parentElement.remove();
    updateSummary();
}

// Add alternate trustee for prior children trust
function addPriorChildrenAlternateTrustee() {
    priorChildrenAlternateTrusteeCount++;
    const container = document.getElementById('priorChildrenAlternateTrusteesList');
    
    const trusteeEntry = document.createElement('div');
    trusteeEntry.className = 'trustee-entry';
    trusteeEntry.innerHTML = `
        <div class="form-group">
            <label for="priorChildrenAlternateTrustee${priorChildrenAlternateTrusteeCount}">Alternate Trustee #${priorChildrenAlternateTrusteeCount}</label>
            <input type="text" id="priorChildrenAlternateTrustee${priorChildrenAlternateTrusteeCount}" name="priorChildrenAlternateTrusteeName[]" placeholder="Full legal name (optional)">
        </div>
        <button type="button" onclick="removePriorChildrenAlternateTrustee(this)" class="remove-btn">Remove This Trustee</button>
    `;
    
    container.appendChild(trusteeEntry);
}

// Remove alternate trustee for prior children trust
function removePriorChildrenAlternateTrustee(button) {
    button.parentElement.remove();
}

// Clear prior children alternate trustees
function clearPriorChildrenAlternateTrustees() {
    const container = document.getElementById('priorChildrenAlternateTrusteesList');
    container.innerHTML = `
        <div class="trustee-entry">
            <div class="form-group">
                <label for="priorChildrenAlternateTrustee1">Alternate Trustee #1</label>
                <input type="text" id="priorChildrenAlternateTrustee1" name="priorChildrenAlternateTrusteeName[]" placeholder="Full legal name (optional)">
            </div>
        </div>
    `;
    priorChildrenAlternateTrusteeCount = 1;
}

// Reset trust form
function resetTrustForm() {
    // Clear all form fields
    document.querySelectorAll('#trustConfigSection input').forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    // Hide subsections
    document.getElementById('singleTrusteeSection').classList.add('hidden');
    document.getElementById('coTrusteesSection').classList.add('hidden');
    document.getElementById('priorChildrenTrustDetails').classList.add('hidden');
    
    // Reset counters
    alternateTrusteeCount = 1;
    priorChildrenAlternateTrusteeCount = 1;
    
    // Clear dynamic sections
    const alternateTrusteesList = document.getElementById('alternateTrusteesList');
    alternateTrusteesList.innerHTML = `
        <div class="trustee-entry">
            <h6>Alternate Trustee #1</h6>
            <div class="form-group">
                <label for="alternateTrustee1Name">Full Name</label>
                <input type="text" id="alternateTrustee1Name" name="alternateTrusteeName[]" placeholder="Full legal name (optional)">
            </div>
            <div class="form-group">
                <label for="alternateTrustee1Relationship">Relationship to you</label>
                <input type="text" id="alternateTrustee1Relationship" name="alternateTrusteeRelationship[]" placeholder="e.g., my cousin">
            </div>
        </div>
    `;
    
    clearPriorChildrenAlternateTrustees();
}

// Update summary
function updateSummary() {
    const summaryDiv = document.getElementById('trustsSummary');
    
    const createTrust = document.querySelector('input[name="createTrust"]:checked')?.value;
    
    if (!createTrust) {
        summaryDiv.style.display = 'none';
        return;
    }
    
    let summaryHTML = '<h4>Trust Configuration Summary</h4>';
    
    if (createTrust === 'no') {
        summaryHTML += '<p><strong>Trust Creation:</strong> No trusts will be created</p>';
    } else {
        summaryHTML += '<p><strong>Trust Creation:</strong> Trusts will be created for minor children</p>';
        
        const trustType = document.querySelector('input[name="trustType"]:checked')?.value;
        if (trustType) {
            const trustTypeText = trustType === 'common' ? 'Common Trust (all children share one trust)' : 'Separate Trusts (each child gets their own trust)';
            summaryHTML += `<p><strong>Trust Type:</strong> ${trustTypeText}</p>`;
        }
        
        const trustEndAge = document.getElementById('trustEndAge').value;
        if (trustEndAge) {
            summaryHTML += `<p><strong>Trust End Age:</strong> ${trustEndAge} years old</p>`;
        }
        
        const trusteeStructure = document.querySelector('input[name="trusteeStructure"]:checked')?.value;
        if (trusteeStructure) {
            summaryHTML += `<p><strong>Trustee Structure:</strong> ${trusteeStructure === 'single' ? 'Single Trustee' : 'Co-Trustees'}</p>`;
            
            if (trusteeStructure === 'single') {
                const primaryTrustee = document.getElementById('primaryTrustee').value;
                if (primaryTrustee) {
                    summaryHTML += `<p><strong>Primary Trustee:</strong> ${primaryTrustee}</p>`;
                }
            } else if (trusteeStructure === 'co-trustees') {
                const coTrustee1 = document.getElementById('coTrustee1Name').value;
                const coTrustee2 = document.getElementById('coTrustee2Name').value;
                if (coTrustee1 && coTrustee2) {
                    summaryHTML += `<p><strong>Co-Trustees:</strong> ${coTrustee1} and ${coTrustee2}</p>`;
                }
            }
        }
        
        // Alternate trustees
        const alternateNames = Array.from(document.querySelectorAll('input[name="alternateTrusteeName[]"]'))
            .map(input => input.value.trim())
            .filter(name => name !== '');
        
        if (alternateNames.length > 0) {
            summaryHTML += `<p><strong>Alternate Trustees:</strong> ${alternateNames.join(', ')}</p>`;
        }
        
        // Prior children trust
        const priorChildrenTrust = document.querySelector('input[name="priorChildrenTrust"]:checked')?.value;
        if (priorChildrenTrust === 'yes') {
            summaryHTML += '<p><strong>Prior Children Trust:</strong> Separate trust will be created for children from prior relationship</p>';
            
            const priorTrustEndAge = document.getElementById('priorChildrenTrustEndAge').value;
            if (priorTrustEndAge) {
                summaryHTML += `<p><strong>Prior Children Trust End Age:</strong> ${priorTrustEndAge} years old</p>`;
            }
            
            const priorTrustPrimaryTrustee = document.getElementById('priorChildrenTrustPrimaryTrustee').value;
            if (priorTrustPrimaryTrustee) {
                summaryHTML += `<p><strong>Prior Children Trust Trustee:</strong> ${priorTrustPrimaryTrustee}</p>`;
            }
        }
    }
    
    summaryDiv.innerHTML = summaryHTML;
    summaryDiv.style.display = 'block';
}

// Form validation
function validateForm() {
    const errors = [];
    
    const createTrust = document.querySelector('input[name="createTrust"]:checked');
    if (!createTrust) {
        errors.push('Please select whether to create trusts');
        return errors;
    }
    
    if (createTrust.value === 'yes') {
        // Validate trust configuration
        const trustType = document.querySelector('input[name="trustType"]:checked');
        if (!trustType) {
            errors.push('Please select a trust type');
        }
        
        const trustEndAge = document.getElementById('trustEndAge').value;
        if (!trustEndAge || trustEndAge < 18 || trustEndAge > 50) {
            errors.push('Please enter a valid trust end age between 18 and 50');
        }
        
        const trusteeStructure = document.querySelector('input[name="trusteeStructure"]:checked');
        if (!trusteeStructure) {
            errors.push('Please select a trustee structure');
        } else {
            if (trusteeStructure.value === 'single') {
                const primaryTrustee = document.getElementById('primaryTrustee').value.trim();
                if (!primaryTrustee) {
                    errors.push('Please enter the primary trustee name');
                }
            } else if (trusteeStructure.value === 'co-trustees') {
                const coTrustee1 = document.getElementById('coTrustee1Name').value.trim();
                const coTrustee2 = document.getElementById('coTrustee2Name').value.trim();
                if (!coTrustee1 || !coTrustee2) {
                    errors.push('Please enter both co-trustee names');
                }
            }
        }
        
        // Validate prior children trust if selected
        const priorChildrenTrust = document.querySelector('input[name="priorChildrenTrust"]:checked');
        if (priorChildrenTrust && priorChildrenTrust.value === 'yes') {
            const priorTrustPrimaryTrustee = document.getElementById('priorChildrenTrustPrimaryTrustee').value.trim();
            if (!priorTrustPrimaryTrustee) {
                errors.push('Please enter the primary trustee for the prior children trust');
            }
        }
    }
    
    return errors;
}

// Handle form submission
document.getElementById('trustsForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const errors = validateForm();
    const errorMessage = document.getElementById('errorMessage');
    const loadingMessage = document.getElementById('loadingMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Hide all messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    if (errors.length > 0) {
        errorMessage.querySelector('p').textContent = errors.join('. ');
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    loadingMessage.style.display = 'block';
    
    try {
        // Collect form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Add arrays for multiple values
        data.alternateTrusteeNames = Array.from(document.querySelectorAll('input[name="alternateTrusteeName[]"]'))
            .map(input => input.value.trim())
            .filter(name => name !== '');
        
        data.alternateTrusteeRelationships = Array.from(document.querySelectorAll('input[name="alternateTrusteeRelationship[]"]'))
            .map(input => input.value.trim())
            .filter(rel => rel !== '');
        
        data.priorChildrenAlternateTrusteeNames = Array.from(document.querySelectorAll('input[name="priorChildrenAlternateTrusteeName[]"]'))
            .map(input => input.value.trim())
            .filter(name => name !== '');
        
        // Add user data from previous sections
        Object.assign(data, currentUserData);
        
        console.log('Submitting trust data:', data);
        
        const response = await fetch('/submit/trusts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            successMessage.style.display = 'block';
            loadingMessage.style.display = 'none';
            
            // Continue to next section after brief delay
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                Object.keys(data).forEach(key => {
                    if (typeof data[key] === 'string' || typeof data[key] === 'number') {
                        urlParams.set(key, data[key]);
                    } else if (Array.isArray(data[key])) {
                        urlParams.set(key, JSON.stringify(data[key]));
                    }
                });
                
                // Continue to next section (you'll need to determine what comes after trusts)
                window.location.href = `next-section.html?${urlParams.toString()}`;
            }, 2000);
        } else {
            throw new Error(result.message || 'Unknown error occurred');
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        loadingMessage.style.display = 'none';
        errorMessage.querySelector('p').textContent = 'Error: ' + error.message;
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth' });
    }
});

// Help system functions
function showHelp(helpId) {
    document.getElementById('helpOverlay').style.display = 'block';
    document.getElementById(helpId).style.display = 'block';
}

function closeHelp() {
    document.getElementById('helpOverlay').style.display = 'none';
    document.querySelectorAll('.help-popup').forEach(popup => {
        popup.style.display = 'none';
    });
}

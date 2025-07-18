// Global variables
let charityCount = 1;
let otherPersonCount = 1;
let altCharityCount = 1;
let altOtherPersonCount = 1;
let remainingCharityCount = 1;
let remainingOtherPersonCount = 1;
let disinheritedPersonCount = 1;
let currentUserData = {};

document.addEventListener('DOMContentLoaded', function() {
    // Auto-populate data from previous sections
    const urlParams = new URLSearchParams(window.location.search);
    const testatorName = urlParams.get('testatorName');
    const email = urlParams.get('email');
    const maritalStatus = urlParams.get('maritalStatus');
    const hasChildren = urlParams.get('hasChildren');
    const childrenNames = urlParams.get('childrenNames') || urlParams.get('priorChildrenNames');
    
    console.log('URL Parameters:', {
        testatorName,
        email,
        maritalStatus,
        hasChildren,
        childrenNames
    });
    
    // Store user data globally
    currentUserData = {
        testatorName,
        email,
        maritalStatus,
        hasChildren,
        childrenNames
    };
    
    // Populate hidden fields
    if (testatorName) {
        document.getElementById('testatorName').value = decodeURIComponent(testatorName);
    }
    if (email) {
        document.getElementById('clientEmail').value = decodeURIComponent(email);
    }
    
    // Count children and get their names
    let childCount = 0;
    let childrenNamesArray = [];
    if (hasChildren === 'yes' && childrenNames) {
        childrenNamesArray = decodeURIComponent(childrenNames).split(',').map(name => name.trim()).filter(name => name.length > 0);
        childCount = childrenNamesArray.length;
    }
    
    currentUserData.childCount = childCount;
    currentUserData.childrenNamesArray = childrenNamesArray;
    
    console.log('Processed user data:', currentUserData);
    
    // Initialize the form based on user situation
    initializePrimaryBeneficiariesSection();
    
    // Update summary when form changes
    updateDistributionSummary();
    
    // Add event listeners for form changes
    document.addEventListener('change', updateDistributionSummary);
    
    // Prevent Enter key submission
    document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });
});

function initializePrimaryBeneficiariesSection() {
    console.log('Initializing primary beneficiaries section...');
    const radioGroup = document.getElementById('primaryBeneficiariesRadioGroup');
    
    if (!radioGroup) {
        console.error('Radio group not found!');
        return;
    }
    
    // Clear existing options
    radioGroup.innerHTML = '';
    
    // Build options based on user situation
    let options = [];
    
    // Add spouse options for married users
    if (currentUserData.maritalStatus === 'married') {
        console.log('Adding spouse options for married user');
        options.push({
            id: 'primarySpouseAll',
            value: 'spouseAll',
            label: 'All of my remaining estate (100%) to my Spouse',
            onchange: 'selectSpouseAll()'
        });
        options.push({
            id: 'primarySpousePartial',
            value: 'spousePartial',
            label: 'Part of my remaining estate (specify percentage) to my Spouse',
            onchange: 'selectSpousePartial()'
        });
    }
    
    // Add children option if user has children
    if (currentUserData.hasChildren === 'yes') {
        console.log('Adding children option for user with', currentUserData.childCount, 'children');
        const childLabel = currentUserData.childCount === 1 ? 'All to my child' : 'All to my children';
        options.push({
            id: 'primaryChildren',
            value: 'children',
            label: childLabel,
            onchange: 'selectChildren()'
        });
    }
    // ADD THIS SECTION - Combined children option for blended families
    if (currentUserData.maritalStatus === 'married') {
        const urlParams = new URLSearchParams(window.location.search);
        const hasCurrentChildren = urlParams.get('hasChildren') === 'yes';
        const hasSpouseChildren = urlParams.get('hasSpousePriorChildren') === 'yes';
        const blendedFamily = urlParams.get('blendedFamily') === 'yes';
        
        if (hasCurrentChildren && hasSpouseChildren && blendedFamily) {
            options.push({
                id: 'primaryCombinedChildren',
                value: 'combinedChildren',
                label: 'All to the combined children of Testator and Spouse',
                onchange: 'selectCombinedChildren()'
            });
        }
        
        // Spouse's children only option
        if (!hasCurrentChildren && hasSpouseChildren) {
            options.push({
                id: 'primarySpouseChildren',
                value: 'spouseChildren',
                label: 'All to my Spouse\'s children',
                onchange: 'selectSpouseChildren()'
            });
        }
    }

    // Add standard options for all users
    options.push({
        id: 'primaryCharity',
        value: 'charity',
        label: 'Charitable organization(s)',
        onchange: 'selectCharity()'
    });
    options.push({
        id: 'primaryOtherPersons',
        value: 'otherPersons',
        label: 'Other person(s)',
        onchange: 'selectOtherPersons()'
    });
    
    console.log('Generated options:', options);
    
    // Generate HTML for options
    options.forEach(option => {
        radioGroup.innerHTML += `
            <div class="radio-item">
                <input type="radio" id="${option.id}" name="primaryBeneficiaries" value="${option.value}" onchange="${option.onchange}">
                <label for="${option.id}">${option.label}</label>
            </div>
        `;
    });
    
    console.log('Primary beneficiaries section populated');
    updateAlternativeOptions();
}

// Primary selection handlers
function selectSpouseAll() {
    console.log('Selected spouse all');
    hideAllDetailGroups();
    hideStandardPrimaryOptions();
    hideSpousePercentageGroup();
    hideRemainingDistribution();
    updateAlternativeOptions();
}

function selectSpousePartial() {
    console.log('Selected spouse partial');
    hideAllDetailGroups();
    hideStandardPrimaryOptions();
    showSpousePercentageGroup();
    updateAlternativeOptions();
}

function selectChildren() {
    console.log('Selected children');
    hideSpousePercentageGroup();
    hideRemainingDistribution();
    showStandardPrimaryOptions();
    hideAllDetailGroups();
    document.getElementById('childrenDetailsGroup').style.display = 'block';
    
    // Show custom option only if multiple children
    if (currentUserData.childCount > 1) {
        document.getElementById('childrenCustomOption').style.display = 'block';
    }
    updateAlternativeOptions();
}

function selectCharity() {
    console.log('Selected charity');
    hideSpousePercentageGroup();
    hideRemainingDistribution();
    showStandardPrimaryOptions();
    hideAllDetailGroups();
    document.getElementById('charityDetailsGroup').style.display = 'block';
    updateAlternativeOptions();
}

function selectOtherPersons() {
    console.log('Selected other persons');
    hideSpousePercentageGroup();
    hideRemainingDistribution();
    showStandardPrimaryOptions();
    hideAllDetailGroups();
    document.getElementById('otherPersonsDetailsGroup').style.display = 'block';
    updateAlternativeOptions();
}
function selectCombinedChildren() {
    console.log('Selected combined children');
    hideSpousePercentageGroup();
    hideRemainingDistribution();
    showStandardPrimaryOptions();
    hideAllDetailGroups();
    document.getElementById('childrenDetailsGroup').style.display = 'block';
    updateAlternativeOptions();
}

function selectSpouseChildren() {
    console.log('Selected spouse children');
    hideSpousePercentageGroup();
    hideRemainingDistribution();
    showStandardPrimaryOptions();
    hideAllDetailGroups();
    document.getElementById('childrenDetailsGroup').style.display = 'block';
    updateAlternativeOptions();
}
function hideAllDetailGroups() {
    const detailGroups = [
        'childrenDetailsGroup',
        'charityDetailsGroup',
        'otherPersonsDetailsGroup'
    ];
    
    detailGroups.forEach(groupId => {
        const group = document.getElementById(groupId);
        if (group) {
            group.style.display = 'none';
        }
    });
}

function hideStandardPrimaryOptions() {
    const standardOptions = document.getElementById('standardPrimaryOptions');
    if (standardOptions) {
        standardOptions.style.display = 'none';
    }
}

function showStandardPrimaryOptions() {
    const standardOptions = document.getElementById('standardPrimaryOptions');
    if (standardOptions) {
        standardOptions.style.display = 'block';
    }
}

function showSpousePercentageGroup() {
    document.getElementById('spousePercentageGroup').style.display = 'block';
}

function hideSpousePercentageGroup() {
    document.getElementById('spousePercentageGroup').style.display = 'none';
}

function hideRemainingDistribution() {
    document.getElementById('remainingDistributionGroup').style.display = 'none';
}

// Handle spouse percentage change
function handleSpousePercentageChange() {
    const spousePercentage = parseInt(document.getElementById('spousePercentage').value) || 0;
    
    console.log('Spouse percentage changed to:', spousePercentage);
    
    if (spousePercentage > 0 && spousePercentage < 100) {
        const remaining = 100 - spousePercentage;
        
        // Show remaining distribution section
        document.getElementById('remainingDistributionGroup').style.display = 'block';
        document.getElementById('remainingAmount').textContent = remaining;
        
        // Show children option if user has children
        if (currentUserData.hasChildren === 'yes' && currentUserData.childCount > 0) {
            document.getElementById('remainingChildrenOption').style.display = 'block';
            
            // Show custom option only if multiple children
            if (currentUserData.childCount > 1) {
                document.getElementById('childrenCustomRemainingOption').style.display = 'block';
            }
        } else {
            document.getElementById('remainingChildrenOption').style.display = 'none';
        }
        
        // Reset validation
        validateRemainingDistribution();
    } else {
        hideRemainingDistribution();
    }
}

// Remaining distribution toggle functions
function toggleRemainingChildrenDetails() {
    const checkbox = document.getElementById('remainingChildren');
    const details = document.getElementById('remainingChildrenDetails');
    
    if (checkbox.checked) {
        details.style.display = 'block';
        
        // Populate custom child shares if multiple children
        if (currentUserData.childCount > 1) {
            populateRemainingCustomChildShares();
        }
    } else {
        details.style.display = 'none';
        document.getElementById('childrenRemainingPercent').value = '';
    }
    
    validateRemainingDistribution();
}

function toggleRemainingCharityDetails() {
    const checkbox = document.getElementById('remainingCharity');
    const details = document.getElementById('remainingCharityDetails');
    
    if (checkbox.checked) {
        details.style.display = 'block';
    } else {
        details.style.display = 'none';
        document.getElementById('charityRemainingPercent').value = '';
    }
    
    validateRemainingDistribution();
}

function toggleRemainingOtherPersonsDetails() {
    const checkbox = document.getElementById('remainingOtherPersons');
    const details = document.getElementById('remainingOtherPersonsDetails');
    
    if (checkbox.checked) {
        details.style.display = 'block';
    } else {
        details.style.display = 'none';
        document.getElementById('otherPersonsRemainingPercent').value = '';
    }
    
    validateRemainingDistribution();
}

// Validate remaining distribution percentages
function validateRemainingDistribution() {
    const childrenPercent = parseInt(document.getElementById('childrenRemainingPercent').value) || 0;
    const charityPercent = parseInt(document.getElementById('charityRemainingPercent').value) || 0;
    const otherPersonsPercent = parseInt(document.getElementById('otherPersonsRemainingPercent').value) || 0;
    
    const total = childrenPercent + charityPercent + otherPersonsPercent;
    const target = parseInt(document.getElementById('remainingAmount').textContent) || 0;
    
    const validationDiv = document.getElementById('remainingDistributionValidation');
    
    if (total === 0) {
        validationDiv.style.display = 'none';
        return;
    }
    
    if (total === target) {
        validationDiv.style.color = 'white';
        validationDiv.style.backgroundColor = '#28a745';
        validationDiv.textContent = `✓ Perfect! Total: ${total}% (matches required ${target}%)`;
        validationDiv.style.display = 'block';
    } else if (total > target) {
        validationDiv.style.color = 'white';
        validationDiv.style.backgroundColor = '#dc3545';
        validationDiv.textContent = `✗ Total: ${total}% exceeds required ${target}% by ${total - target}%`;
        validationDiv.style.display = 'block';
    } else {
        validationDiv.style.color = 'white';
        validationDiv.style.backgroundColor = '#ffc107';
        validationDiv.textContent = `⚠ Total: ${total}% - need ${target - total}% more to reach ${target}%`;
        validationDiv.style.display = 'block';
    }
}

// Custom child shares for remaining percentage
function showRemainingCustomChildShares() {
    document.getElementById('remainingCustomChildSharesGroup').style.display = 'block';
    populateRemainingCustomChildShares();
}

function populateRemainingCustomChildShares() {
    const childSharesList = document.getElementById('remainingChildSharesList');
    childSharesList.innerHTML = '';
    
    currentUserData.childrenNamesArray.forEach((name, index) => {
        childSharesList.innerHTML += `
            <div class="form-group">
                <label for="remainingChild${index + 1}Share">${name}</label>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="number" id="remainingChild${index + 1}Share" name="remainingChildShare[]" min="0" max="100" placeholder="50" style="width: 80px;" step="1">
                    <span>%</span>
                    <input type="hidden" name="remainingChildName[]" value="${name}">
                </div>
            </div>
        `;
    });
}

// Trust details for remaining children
function showRemainingTrustDetails() {
    document.getElementById('remainingTrustDetailsGroup').style.display = 'block';
}

// Standard children detail functions
function showCustomChildShares() {
    const customSharesGroup = document.getElementById('customChildSharesGroup');
    const childSharesList = document.getElementById('childSharesList');
    
    // Clear existing shares
    childSharesList.innerHTML = '';
    
    // Add input for each child
    currentUserData.childrenNamesArray.forEach((name, index) => {
        childSharesList.innerHTML += `
            <div class="form-group">
                <label for="child${index + 1}Share">${name}</label>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="number" id="child${index + 1}Share" name="childShare[]" min="0" max="100" placeholder="50" style="width: 80px;" step="1">
                    <span>%</span>
                    <input type="hidden" name="childName[]" value="${name}">
                </div>
            </div>
        `;
    });
    
    customSharesGroup.style.display = 'block';
}

// Trust functions
function showTrustDetails() {
    document.getElementById('trustDetailsGroup').style.display = 'block';
}

// Charity functions
function addCharity() {
    charityCount++;
    const charitiesList = document.getElementById('charitiesList');
    
    const newCharityEntry = document.createElement('div');
    newCharityEntry.className = 'charity-entry';
    newCharityEntry.innerHTML = `
        <h4>Charity #${charityCount}</h4>
        <div class="form-group">
            <label for="charity${charityCount}Name">Charity Name *</label>
            <input type="text" id="charity${charityCount}Name" name="charityName[]" placeholder="Full legal name of charity">
        </div>
        <div class="form-group">
            <label for="charity${charityCount}Percentage">Percentage *</label>
            <input type="number" id="charity${charityCount}Percentage" name="charityPercentage[]" min="1" max="100" placeholder="50" step="1">
            <span>%</span>
        </div>
        <button type="button" class="remove-btn" onclick="removeCharity(this)">Remove This Charity</button>
    `;
    charitiesList.appendChild(newCharityEntry);
}

function removeCharity(button) {
    button.parentElement.remove();
}

function addRemainingCharity() {
    remainingCharityCount++;
    const charitiesList = document.getElementById('remainingCharitiesList');
    
    const newCharityEntry = document.createElement('div');
    newCharityEntry.className = 'charity-entry';
    newCharityEntry.innerHTML = `
        <h4>Charity #${remainingCharityCount}</h4>
        <div class="form-group">
            <label for="remainingCharity${remainingCharityCount}Name">Charity Name *</label>
            <input type="text" id="remainingCharity${remainingCharityCount}Name" name="remainingCharityName[]" placeholder="Full legal name of charity">
        </div>
        <div class="form-group">
            <label for="remainingCharity${remainingCharityCount}Percentage">Percentage of charity portion *</label>
            <input type="number" id="remainingCharity${remainingCharityCount}Percentage" name="remainingCharityPercentage[]" min="1" max="100" placeholder="50" step="1">
            <span>%</span>
        </div>
        <button type="button" class="remove-btn" onclick="removeRemainingCharity(this)">Remove This Charity</button>
    `;
    charitiesList.appendChild(newCharityEntry);
}

function removeRemainingCharity(button) {
    button.parentElement.remove();
}

// Other persons functions
function addOtherPerson() {
    otherPersonCount++;
    const otherPersonsList = document.getElementById('otherPersonsList');
    
    const newPersonEntry = document.createElement('div');
    newPersonEntry.className = 'other-person-entry';
    newPersonEntry.innerHTML = `
        <h4>Person #${otherPersonCount}</h4>
        <div class="form-group">
            <label for="otherPerson${otherPersonCount}Name">Full Name *</label>
            <input type="text" id="otherPerson${otherPersonCount}Name" name="otherPersonName[]" placeholder="Full legal name">
        </div>
        <div class="form-group">
            <label for="otherPerson${otherPersonCount}Percentage">Percentage *</label>
            <input type="number" id="otherPerson${otherPersonCount}Percentage" name="otherPersonPercentage[]" min="1" max="100" placeholder="50" step="1">
            <span>%</span>
        </div>
        <div class="form-group">
            <label for="otherPerson${otherPersonCount}Alternate">If this person doesn't survive me, give their share to:</label>
            <input type="text" id="otherPerson${otherPersonCount}Alternate" name="otherPersonAlternate[]" placeholder="Name of alternate beneficiary (optional)">
        </div>
        <button type="button" class="remove-btn" onclick="removeOtherPerson(this)">Remove This Person</button>
    `;
    otherPersonsList.appendChild(newPersonEntry);
}

function removeOtherPerson(button) {
    button.parentElement.remove();
}

function addRemainingOtherPerson() {
    remainingOtherPersonCount++;
    const otherPersonsList = document.getElementById('remainingOtherPersonsList');
    
    const newPersonEntry = document.createElement('div');
    newPersonEntry.className = 'other-person-entry';
    newPersonEntry.innerHTML = `
        <h4>Person #${remainingOtherPersonCount}</h4>
        <div class="form-group">
            <label for="remainingOtherPerson${remainingOtherPersonCount}Name">Full Name *</label>
            <input type="text" id="remainingOtherPerson${remainingOtherPersonCount}Name" name="remainingOtherPersonName[]" placeholder="Full legal name">
        </div>
        <div class="form-group">
            <label for="remainingOtherPerson${remainingOtherPersonCount}Percentage">Percentage of other persons portion *</label>
            <input type="number" id="remainingOtherPerson${remainingOtherPersonCount}Percentage" name="remainingOtherPersonPercentage[]" min="1" max="100" placeholder="50" step="1">
            <span>%</span>
        </div>
        <div class="form-group">
            <label for="remainingOtherPerson${remainingOtherPersonCount}Alternate">If this person doesn't survive me, give their share to:</label>
            <input type="text" id="remainingOtherPerson${remainingOtherPersonCount}Alternate" name="remainingOtherPersonAlternate[]" placeholder="Name of alternate beneficiary (optional)">
        </div>
        <button type="button" class="remove-btn" onclick="removeRemainingOtherPerson(this)">Remove This Person</button>
    `;
    otherPersonsList.appendChild(newPersonEntry);
}

function removeRemainingOtherPerson(button) {
    button.parentElement.remove();
}

function updateAlternativeOptions() {
    const primarySelection = document.querySelector('input[name="primaryBeneficiaries"]:checked')?.value;
    
    // Get all alternative option containers
    const altParents = document.getElementById('altParentsOption');
    const altSiblings = document.getElementById('altSiblingsOption');
    const altChildren = document.getElementById('altChildrenOption');
    const altCharity = document.getElementById('altCharityOption');
    const altOtherPersons = document.getElementById('altOtherPersonsOption');
    
    // Clear existing dynamic options first
    const dynamicOptions = document.querySelectorAll('.dynamic-alt-option');
    dynamicOptions.forEach(option => option.remove());
    
    // Show standard options first
    if (altParents) altParents.style.display = 'block';
    if (altSiblings) altSiblings.style.display = 'block';
    if (altCharity) altCharity.style.display = 'block';
    if (altOtherPersons) altOtherPersons.style.display = 'block';
    
    // Show children option only if user has children and it wasn't selected as primary
    if (altChildren) {
        if (currentUserData.hasChildren === 'yes' && primarySelection !== 'children') {
            altChildren.style.display = 'block';
        } else {
            altChildren.style.display = 'none';
        }
    }
    
    // Add dynamic options based on user situation
    const alternativeOptionsGroup = document.getElementById('alternativeOptionsGroup');
    
    if (currentUserData.maritalStatus === 'married') {
        const urlParams = new URLSearchParams(window.location.search);
        const hasCurrentChildren = urlParams.get('hasChildren') === 'yes';
        const hasSpouseChildren = urlParams.get('hasSpousePriorChildren') === 'yes';
        const blendedFamily = urlParams.get('blendedFamily') === 'yes';
        
   // Combined children option
        if (hasCurrentChildren && hasSpouseChildren && blendedFamily && primarySelection !== 'combinedChildren') {
            const combinedChildrenOption = document.createElement('div');
            combinedChildrenOption.className = 'radio-item dynamic-alt-option';
            combinedChildrenOption.innerHTML = `
                <input type="radio" id="altCombinedChildren" name="alternativeBeneficiaries" value="combinedChildren">
                <label for="altCombinedChildren">All to the combined children of Testator and Spouse</label>
            `;
            // Insert after children option
            if (altChildren) {
                altChildren.insertAdjacentElement('afterend', combinedChildrenOption);
            } else {
                altSiblings.insertAdjacentElement('afterend', combinedChildrenOption);
            }
            
            // Add event listener for combined children option
            const altCombinedChildrenRadio = document.getElementById('altCombinedChildren');
            if (altCombinedChildrenRadio) {
                altCombinedChildrenRadio.addEventListener('change', function() {
                    if (this.checked) {
                        showAlternativeChildrenDetails();
                    }
                });
            }
        }
       // Spouse's children option
        if (!hasCurrentChildren && hasSpouseChildren && primarySelection !== 'spouseChildren') {
            const spouseChildrenOption = document.createElement('div');
            spouseChildrenOption.className = 'radio-item dynamic-alt-option';
            spouseChildrenOption.innerHTML = `
                <input type="radio" id="altSpouseChildren" name="alternativeBeneficiaries" value="spouseChildren">
                <label for="altSpouseChildren">All to my Spouse's children</label>
            `;
            // Find the last dynamic option or children option
            const lastDynamic = document.querySelector('.dynamic-alt-option:last-of-type');
            if (lastDynamic) {
                lastDynamic.insertAdjacentElement('afterend', spouseChildrenOption);
            } else if (altChildren && altChildren.style.display !== 'none') {
                altChildren.insertAdjacentElement('afterend', spouseChildrenOption);
            } else {
                altSiblings.insertAdjacentElement('afterend', spouseChildrenOption);
            }
            
            // Add event listener for spouse children option
            const altSpouseChildrenRadio = document.getElementById('altSpouseChildren');
            if (altSpouseChildrenRadio) {
                altSpouseChildrenRadio.addEventListener('change', function() {
                    if (this.checked) {
                        showAlternativeChildrenDetails();
                    }
                });
            }
        }
        } 
    // Add "no alternate" option at the end
    const noAlternateOption = document.createElement('div');
    noAlternateOption.className = 'radio-item dynamic-alt-option';
    noAlternateOption.innerHTML = `
        <input type="radio" id="altNone" name="alternativeBeneficiaries" value="none">
        <label for="altNone">I do not want to name an alternate beneficiary</label>
    `;
    alternativeOptionsGroup.appendChild(noAlternateOption);
    
    // Hide the option that was selected as primary
    if (primarySelection === 'charity' && altCharity) {
        altCharity.style.display = 'none';
    } else if (primarySelection === 'otherPersons' && altOtherPersons) {
        altOtherPersons.style.display = 'none';
    }
}
// Toggle disinheritance details section
function toggleDisinheritanceDetails() {
    const wantToDisinherit = document.querySelector('input[name="wantToDisinherit"]:checked')?.value;
    const disinheritanceGroup = document.getElementById('disinheritanceDetailsGroup');
    
    if (wantToDisinherit === 'yes') {
        disinheritanceGroup.style.display = 'block';
    } else {
        disinheritanceGroup.style.display = 'none';
        // Clear any entered data when hiding
        document.querySelectorAll('input[name="disinheritedPersonName[]"]').forEach(input => {
            input.value = '';
        });
        document.querySelectorAll('input[name="disinheritedPersonRelationship[]"]').forEach(input => {
            input.value = '';
        });
    }
}

// Add another disinherited person entry
function addDisinheritedPerson() {
    disinheritedPersonCount++;
    const personsList = document.getElementById('disinheritedPersonsList');
    
    const newPersonEntry = document.createElement('div');
    newPersonEntry.className = 'disinherited-person-entry';
    newPersonEntry.innerHTML = `
        <h4>Person #${disinheritedPersonCount} to Disinherit</h4>
        <div class="form-group">
            <label for="disinheritedPerson${disinheritedPersonCount}Name">Full Name *</label>
            <input type="text" id="disinheritedPerson${disinheritedPersonCount}Name" name="disinheritedPersonName[]" placeholder="Full legal name of person to disinherit">
        </div>
        <div class="form-group">
            <label for="disinheritedPerson${disinheritedPersonCount}Relationship">Relationship to You</label>
            <input type="text" id="disinheritedPerson${disinheritedPersonCount}Relationship" name="disinheritedPersonRelationship[]" placeholder="e.g., my son, my sister, my former spouse">
        </div>
        <button type="button" class="remove-btn" onclick="removeDisinheritedPerson(this)">Remove This Person</button>
    `;
    personsList.appendChild(newPersonEntry);
}

// Remove disinherited person entry
function removeDisinheritedPerson(button) {
    button.parentElement.remove();
}
// Alternative beneficiaries functions
function toggleAlternativeCharityDetails() {
    const altCharity = document.getElementById('altCharity').checked;
    const altCharityGroup = document.getElementById('alternativeCharityDetailsGroup');
    const altOtherPersonsGroup = document.getElementById('alternativeOtherPersonsDetailsGroup');
    
    if (altCharity) {
        altCharityGroup.style.display = 'block';
        altOtherPersonsGroup.style.display = 'none';
    } else {
        altCharityGroup.style.display = 'none';
    }
}

function toggleAlternativeOtherPersonsDetails() {
    const altOtherPersons = document.getElementById('altOtherPersons').checked;
    const altOtherPersonsGroup = document.getElementById('alternativeOtherPersonsDetailsGroup');
    const altCharityGroup = document.getElementById('alternativeCharityDetailsGroup');
    
    if (altOtherPersons) {
        altOtherPersonsGroup.style.display = 'block';
        altCharityGroup.style.display = 'none';
    } else {
        altOtherPersonsGroup.style.display = 'none';
    }
}

function addAlternativeCharity() {
    altCharityCount++;
    const charitiesList = document.getElementById('alternativeCharitiesList');
    
    const newCharityEntry = document.createElement('div');
    newCharityEntry.className = 'charity-entry';
    newCharityEntry.innerHTML = `
        <h4>Alternative Charity #${altCharityCount}</h4>
        <div class="form-group">
            <label for="altCharity${altCharityCount}Name">Charity Name *</label>
            <input type="text" id="altCharity${altCharityCount}Name" name="altCharityName[]" placeholder="Full legal name of charity">
        </div>
        <div class="form-group">
            <label for="altCharity${altCharityCount}Percentage">Percentage *</label>
            <input type="number" id="altCharity${altCharityCount}Percentage" name="altCharityPercentage[]" min="1" max="100" placeholder="50" step="1">
            <span>%</span>
        </div>
        <button type="button" class="remove-btn" onclick="removeAlternativeCharity(this)">Remove This Charity</button>
    `;
    charitiesList.appendChild(newCharityEntry);
}

function removeAlternativeCharity(button) {
    button.parentElement.remove();
}

function addAlternativeOtherPerson() {
    altOtherPersonCount++;
    const otherPersonsList = document.getElementById('alternativeOtherPersonsList');
    
    const newPersonEntry = document.createElement('div');
    newPersonEntry.className = 'other-person-entry';
    newPersonEntry.innerHTML = `
        <h4>Alternative Person #${altOtherPersonCount}</h4>
        <div class="form-group">
            <label for="altOtherPerson${altOtherPersonCount}Name">Full Name *</label>
            <input type="text" id="altOtherPerson${altOtherPersonCount}Name" name="altOtherPersonName[]" placeholder="Full legal name">
        </div>
        <div class="form-group">
            <label for="altOtherPerson${altOtherPersonCount}Percentage">Percentage *</label>
            <input type="number" id="altOtherPerson${altOtherPersonCount}Percentage" name="altOtherPersonPercentage[]" min="1" max="100" placeholder="50" step="1">
            <span>%</span>
        </div>
        <div class="form-group">
            <label for="altOtherPerson${altOtherPersonCount}Alternate">If this person doesn't survive me, give their share to:</label>
            <input type="text" id="altOtherPerson${altOtherPersonCount}Alternate" name="altOtherPersonAlternate[]" placeholder="Name of alternate beneficiary (optional)">
        </div>
        <button type="button" class="remove-btn" onclick="removeAlternativeOtherPerson(this)">Remove This Person</button>
    `;
    otherPersonsList.appendChild(newPersonEntry);
}

function removeAlternativeOtherPerson(button) {
    button.parentElement.remove();
}
function showAlternativeChildrenDetails() {
    // Hide other alternative detail sections if they exist
    const altCharityGroup = document.getElementById('alternativeCharityDetailsGroup');
    const altOtherPersonsGroup = document.getElementById('alternativeOtherPersonsDetailsGroup');
    
    if (altCharityGroup) altCharityGroup.style.display = 'none';
    if (altOtherPersonsGroup) altOtherPersonsGroup.style.display = 'none';
    
    // Show alternative children details section
    const altChildrenGroup = document.getElementById('alternativeChildrenDetailsGroup');
    if (altChildrenGroup) {
        altChildrenGroup.style.display = 'block';
    }
    
    console.log('Alternative children option selected - showing trust/outright options');
}
// Summary functions
function updateDistributionSummary() {
    const summarySection = document.getElementById('distributionSummary');
    const summaryContent = document.getElementById('summaryContent');
    
    const primarySelection = document.querySelector('input[name="primaryBeneficiaries"]:checked')?.value;
    const spousePercentage = document.getElementById('spousePercentage')?.value;
    const alternativeSelection = document.querySelector('input[name="alternativeBeneficiaries"]:checked')?.value;
    
    let summaryHTML = '<h4>Your Estate Distribution Plan:</h4>';
    
    // Primary distribution
    if (primarySelection === 'spouseAll') {
        summaryHTML += '<p><strong>Spouse:</strong> 100% of remaining estate</p>';
    } else if (primarySelection === 'spousePartial' && spousePercentage) {
        summaryHTML += `<p><strong>Spouse:</strong> ${spousePercentage}% of remaining estate</p>`;
        
        const remaining = 100 - parseInt(spousePercentage);
        const childrenChecked = document.getElementById('remainingChildren')?.checked;
        const charityChecked = document.getElementById('remainingCharity')?.checked;
        const otherPersonsChecked = document.getElementById('remainingOtherPersons')?.checked;
        
        if (childrenChecked || charityChecked || otherPersonsChecked) {
            summaryHTML += `<p><strong>Remaining ${remaining}%:</strong> `;
            let remainingParts = [];
            
            if (childrenChecked) {
                const childrenPercent = document.getElementById('childrenRemainingPercent')?.value;
                if (childrenPercent) {
                    remainingParts.push(`${childrenPercent}% to children`);
                }
            }
            
            if (charityChecked) {
                const charityPercent = document.getElementById('charityRemainingPercent')?.value;
                if (charityPercent) {
                    remainingParts.push(`${charityPercent}% to charity`);
                }
            }
            
            if (otherPersonsChecked) {
                const otherPersonsPercent = document.getElementById('otherPersonsRemainingPercent')?.value;
                if (otherPersonsPercent) {
                    remainingParts.push(`${otherPersonsPercent}% to other persons`);
                }
            }
            
            summaryHTML += remainingParts.join(', ') + '</p>';
        }
    } else if (primarySelection === 'children') {
        const childLabel = currentUserData.childCount === 1 ? 'child' : 'children';
        summaryHTML += `<p><strong>All to ${childLabel}:</strong> 100% of remaining estate</p>`;
    } else if (primarySelection === 'charity') {
        summaryHTML += '<p><strong>Charity:</strong> 100% of remaining estate</p>';
    } else if (primarySelection === 'otherPersons') {
        summaryHTML += '<p><strong>Other persons:</strong> 100% of remaining estate</p>';
    }
    
    // Alternative beneficiaries
    if (alternativeSelection) {
        summaryHTML += `<p><strong>If primary beneficiaries cannot inherit:</strong> ${getAlternativeText(alternativeSelection)}</p>`;
    }
    
    summaryContent.innerHTML = summaryHTML;
    summarySection.style.display = 'block';
}

function getAlternativeText(selection) {
    switch(selection) {
        case 'parents': return 'Parents (or surviving parent)';
        case 'siblings': return 'Siblings equally';
        case 'charity': return 'Charitable organizations';
        case 'otherPersons': return 'Other persons';
        default: return '';
    }
}

// Form validation
function validateForm() {
    const errors = [];
    
    // Check primary beneficiaries selection
    const primarySelection = document.querySelector('input[name="primaryBeneficiaries"]:checked');
    if (!primarySelection) {
        errors.push('Please select primary beneficiaries');
        return { isValid: false, errors };
    }
    
    // Validate spouse partial distribution
    if (primarySelection.value === 'spousePartial') {
        const spousePercentage = document.getElementById('spousePercentage').value;
        if (!spousePercentage || spousePercentage < 1 || spousePercentage > 99) {
            errors.push('Please enter a valid percentage for your spouse (1-99)');
        } else {
            // Validate remaining distribution
            const childrenPercent = parseInt(document.getElementById('childrenRemainingPercent').value) || 0;
            const charityPercent = parseInt(document.getElementById('charityRemainingPercent').value) || 0;
            const otherPersonsPercent = parseInt(document.getElementById('otherPersonsRemainingPercent').value) || 0;
            const totalRemaining = childrenPercent + charityPercent + otherPersonsPercent;
            const expectedRemaining = 100 - parseInt(spousePercentage);
            
            if (totalRemaining === 0) {
                errors.push('Please specify how to distribute the remaining percentage');
            } else if (totalRemaining !== expectedRemaining) {
                errors.push(`Remaining distribution percentages must add up to ${expectedRemaining}% (currently ${totalRemaining}%)`);
            }
        }
    }
    
    // Check alternative beneficiaries
const alternativeSelection = document.querySelector('input[name="alternativeBeneficiaries"]:checked');
if (!alternativeSelection) {
    errors.push('Please select alternative beneficiaries');
} else if (alternativeSelection.value === 'none') {
    // No validation needed for "none" option
    console.log('User chose no alternate beneficiary');
}
    
    return { isValid: errors.length === 0, errors };
}

// Form submission
document.getElementById('remainingEstateForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const validation = validateForm();
if (!validation.isValid) {
    const errorMessage = document.getElementById('errorMessage');
    const errorP = errorMessage.querySelector('p');
    errorP.textContent = 'Please fix the following issues: ' + validation.errors.join(', ');
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth' });
    return;
}
   
   const loadingMessage = document.getElementById('loadingMessage');
   const successMessage = document.getElementById('successMessage');
   const errorMessage = document.getElementById('errorMessage');
   
   loadingMessage.style.display = 'none';
   successMessage.style.display = 'none';
   errorMessage.style.display = 'none';
   
   loadingMessage.style.display = 'block';
   
   const formData = new FormData(this);
   const data = Object.fromEntries(formData.entries());
   
   // Handle arrays for charity and person data
   const charityNames = formData.getAll('charityName[]').filter(name => name.trim());
   const charityPercentages = formData.getAll('charityPercentage[]').filter(pct => pct.trim());
   
   const otherPersonNames = formData.getAll('otherPersonName[]').filter(name => name.trim());
   const otherPersonPercentages = formData.getAll('otherPersonPercentage[]').filter(pct => pct.trim());
   const otherPersonAlternates = formData.getAll('otherPersonAlternate[]');
   
   const remainingCharityNames = formData.getAll('remainingCharityName[]').filter(name => name.trim());
   const remainingCharityPercentages = formData.getAll('remainingCharityPercentage[]').filter(pct => pct.trim());
   
   const remainingOtherPersonNames = formData.getAll('remainingOtherPersonName[]').filter(name => name.trim());
   const remainingOtherPersonPercentages = formData.getAll('remainingOtherPersonPercentage[]').filter(pct => pct.trim());
   const remainingOtherPersonAlternates = formData.getAll('remainingOtherPersonAlternate[]');
    
 //  const disinheritedPersonNames = formData.getAll('disinheritedPersonName[]').filter(name => name.trim());
 //  const disinheritedPersonRelationships = formData.getAll('disinheritedPersonRelationship[]');
    
   const altCharityNames = formData.getAll('altCharityName[]').filter(name => name.trim());
   const altCharityPercentages = formData.getAll('altCharityPercentage[]').filter(pct => pct.trim());
   
   const altOtherPersonNames = formData.getAll('altOtherPersonName[]').filter(name => name.trim());
   const altOtherPersonPercentages = formData.getAll('altOtherPersonPercentage[]').filter(pct => pct.trim());
   const altOtherPersonAlternates = formData.getAll('altOtherPersonAlternate[]');
   
   // Handle custom child shares
   const childShares = formData.getAll('childShare[]');
   const childNames = formData.getAll('childName[]');
   const remainingChildShares = formData.getAll('remainingChildShare[]');
   const remainingChildNames = formData.getAll('remainingChildName[]');
   
   // Build data object
   data.charities = charityNames.map((name, index) => ({
       name: name,
       percentage: parseInt(charityPercentages[index]) || 0
   }));
   
   data.otherPersons = otherPersonNames.map((name, index) => ({
       name: name,
       percentage: parseInt(otherPersonPercentages[index]) || 0,
       alternate: otherPersonAlternates[index] || ''
   }));
   
   data.remainingCharities = remainingCharityNames.map((name, index) => ({
       name: name,
       percentage: parseInt(remainingCharityPercentages[index]) || 0
   }));
   
   data.remainingOtherPersons = remainingOtherPersonNames.map((name, index) => ({
       name: name,
       percentage: parseInt(remainingOtherPersonPercentages[index]) || 0,
       alternate: remainingOtherPersonAlternates[index] || ''
   }));
   
   data.alternativeCharities = altCharityNames.map((name, index) => ({
       name: name,
       percentage: parseInt(altCharityPercentages[index]) || 0
   }));
   
   data.alternativeOtherPersons = altOtherPersonNames.map((name, index) => ({
       name: name,
       percentage: parseInt(altOtherPersonPercentages[index]) || 0,
       alternate: altOtherPersonAlternates[index] || ''
   }));
    
  // data.disinheritedPersons = disinheritedPersonNames.map((name, index) => ({
    //name: name,
    //relationship: disinheritedPersonRelationships[index] || ''
   //}));
    
   data.customChildShares = childShares.map((share, index) => ({
       name: childNames[index],
       percentage: parseInt(share) || 0
   }));
   
   data.remainingCustomChildShares = remainingChildShares.map((share, index) => ({
       name: remainingChildNames[index],
       percentage: parseInt(share) || 0
   }));
   
   data.documentType = 'will';
   data.section = 'remainingEstate';
   
   try {
       const response = await fetch('/submit/remaining-estate', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(data)
       });
       
       if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
       }
       
       const result = await response.json();
       
       loadingMessage.style.display = 'none';
       
      if (result.success) {
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Auto-advance to next section after 2 seconds with all form data
    setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Add all current form data to URL parameters
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'string' || typeof data[key] === 'number') {
                urlParams.set(key, data[key]);
            } else if (Array.isArray(data[key])) {
                urlParams.set(key, JSON.stringify(data[key]));
            }
        });
        
        // Navigate to next section with all data preserved
        window.location.href = `per-rep.html?${urlParams.toString()}`;
    }, 2000);
} else {
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth' });
}
   } catch (error) {
       console.error('Remaining estate submission error:', error);
       loadingMessage.style.display = 'none';
       errorMessage.style.display = 'block';
       errorMessage.scrollIntoView({ behavior: 'smooth' });
   }
});
function showAltTrustDetails() {
    document.getElementById('altChildrenTrustDetails').style.display = 'block';
}
function continueToExecutors() {
    // Collect current form data
    const formData = new FormData(document.getElementById('remainingEstateForm'));
    const currentData = Object.fromEntries(formData.entries());
    
    // Add arrays for multiple values
    currentData.childShares = Array.from(document.querySelectorAll('input[name="childShare[]"]')).map(input => input.value);
    currentData.childNames = Array.from(document.querySelectorAll('input[name="childName[]"]')).map(input => input.value);
    
    const urlParams = new URLSearchParams(window.location.search);
    
    // Add current form data to URL parameters
    Object.keys(currentData).forEach(key => {
        if (typeof currentData[key] === 'string' || typeof currentData[key] === 'number') {
            urlParams.set(key, currentData[key]);
        } else if (Array.isArray(currentData[key])) {
            urlParams.set(key, JSON.stringify(currentData[key]));
        }
    });
    
    window.location.href = `per-rep.html?${urlParams.toString()}`;
}
// Show alternate trust options when children are selected as alternate beneficiaries
function showAlternateTrustOptions() {
    let altTrustOptionsGroup = document.getElementById('alternateTrustOptionsGroup');
    
    // Create trust options if they don't exist
    if (!altTrustOptionsGroup) {
        const alternativeSection = document.getElementById('alternativeBeneficiariesSection');
        const altTrustOptionsHTML = `
            <div class="form-group" id="alternateTrustOptionsGroup">
                <label>How should your children receive the inheritance as alternate beneficiaries? *</label>
                <div class="radio-group">
                    <div class="radio-item">
                        <input type="radio" id="altDistributionOutright" name="altDistributionType" value="outright" onchange="hideAlternateTrustDetails()">
                        <label for="altDistributionOutright">Outright distribution (no trust)</label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" id="altDistributionTrust" name="altDistributionType" value="trust" onchange="showAlternateTrustDetails()">
                        <label for="altDistributionTrust">In trust</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group" id="alternateTrustDetailsGroup" style="display: none;">
                ${window.childCount === 1 ? 
                    `<div class="form-group">
                        <label for="altSingleTrustAge">At what age should the trust end? *</label>
                        <input type="number" id="altSingleTrustAge" name="altSingleTrustAge" min="18" max="50" placeholder="25">
                        <small>Enter age between 18 and 50</small>
                    </div>` 
                    : 
                    `<div class="form-group">
                        <label>Trust structure for multiple children as alternates *</label>
                        <div class="radio-group">
                            <div class="radio-item">
                                <input type="radio" id="altSeparateTrusts" name="altTrustStructure" value="separate" onchange="showAltSeparateTrustAge()">
                                <label for="altSeparateTrusts">Separate trust for each child</label>
                            </div>
                            <div class="radio-item">
                                <input type="radio" id="altCommonTrust" name="altTrustStructure" value="common" onchange="showAltCommonTrustAge()">
                                <label for="altCommonTrust">One common trust for all children</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group" id="altSeparateTrustAgeGroup" style="display: none;">
                        <label for="altSeparateTrustAge">At what age should each child's trust end? *</label>
                        <input type="number" id="altSeparateTrustAge" name="altSeparateTrustAge" min="18" max="50" placeholder="25">
                        <small>Enter age between 18 and 50</small>
                    </div>
                    
                    <div class="form-group" id="altCommonTrustAgeGroup" style="display: none;">
                        <label for="altCommonTrustAge">At what age of the youngest child should the common trust end? *</label>
                        <input type="number" id="altCommonTrustAge" name="altCommonTrustAge" min="18" max="50" placeholder="25">
                        <small>Enter age between 18 and 50</small>
                    </div>`
                }
            </div>
        `;
        
        alternativeSection.insertAdjacentHTML('beforeend', altTrustOptionsHTML);
    } else {
        altTrustOptionsGroup.style.display = 'block';
    }
}

// Hide alternate trust options
function hideAlternateTrustOptions() {
    const altTrustOptionsGroup = document.getElementById('alternateTrustOptionsGroup');
    if (altTrustOptionsGroup) {
        altTrustOptionsGroup.style.display = 'none';
    }
    hideAlternateTrustDetails();
}

// Show alternate trust details
function showAlternateTrustDetails() {
    const altTrustDetailsGroup = document.getElementById('alternateTrustDetailsGroup');
    if (altTrustDetailsGroup) {
        altTrustDetailsGroup.style.display = 'block';
    }
}

// Hide alternate trust details
function hideAlternateTrustDetails() {
    const altTrustDetailsGroup = document.getElementById('alternateTrustDetailsGroup');
    if (altTrustDetailsGroup) {
        altTrustDetailsGroup.style.display = 'none';
    }
    
    // Also hide specific trust age groups
    const altSeparateTrustAgeGroup = document.getElementById('altSeparateTrustAgeGroup');
    const altCommonTrustAgeGroup = document.getElementById('altCommonTrustAgeGroup');
    if (altSeparateTrustAgeGroup) altSeparateTrustAgeGroup.style.display = 'none';
    if (altCommonTrustAgeGroup) altCommonTrustAgeGroup.style.display = 'none';
}

// Show alternate separate trust age input
function showAltSeparateTrustAge() {
    document.getElementById('altSeparateTrustAgeGroup').style.display = 'block';
    document.getElementById('altCommonTrustAgeGroup').style.display = 'none';
}

// Show alternate common trust age input
function showAltCommonTrustAge() {
    document.getElementById('altCommonTrustAgeGroup').style.display = 'block';
    document.getElementById('altSeparateTrustAgeGroup').style.display = 'none';
}

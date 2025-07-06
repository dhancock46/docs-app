// Global variables
let charityCount = 1;
let otherPersonCount = 1;
let altCharityCount = 1;
let altOtherPersonCount = 1;
let currentUserData = {};

document.addEventListener('DOMContentLoaded', function() {
    // Auto-populate data from previous sections
    const urlParams = new URLSearchParams(window.location.search);
    const testatorName = urlParams.get('testatorName');
    const email = urlParams.get('email');
    const maritalStatus = urlParams.get('maritalStatus');
    const hasChildren = urlParams.get('hasChildren');
    const childrenNames = urlParams.get('childrenNames') || urlParams.get('priorChildrenNames');
    
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
    
    // Initialize the form based on user situation
    initializePrimaryBeneficiariesSection();
    
    // Initialize alternative beneficiaries
    initializeAlternativeBeneficiariesSection();
    
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
    const primarySection = document.getElementById('primaryBeneficiariesSection');
    const radioGroup = document.getElementById('primaryBeneficiariesRadioGroup');
    
    // Clear existing options
    radioGroup.innerHTML = '';
    
    // Build options based on user situation
    let options = [];
    
    // Add spouse options for married users
    if (currentUserData.maritalStatus === 'married') {
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
    if (currentUserData.hasChildren === 'yes' && currentUserData.childCount > 0) {
        const childLabel = currentUserData.childCount === 1 ? 'All to my child' : 'All to my children';
        options.push({
            id: 'primaryChildren',
            value: 'children',
            label: childLabel,
            onchange: 'selectChildren()'
        });
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
    
    // Generate HTML for options
    options.forEach(option => {
        radioGroup.innerHTML += `
            <div class="radio-item">
                <input type="radio" id="${option.id}" name="primaryBeneficiaries" value="${option.value}" onchange="${option.onchange}">
                <label for="${option.id}">${option.label}</label>
            </div>
        `;
    });
    
    // Show the section
    primarySection.style.display = 'block';
}

function initializeAlternativeBeneficiariesSection() {
    const altSection = document.getElementById('alternativeBeneficiariesSection');
    const radioGroup = document.getElementById('alternativeOptionsGroup');
    
    // Clear existing options
    radioGroup.innerHTML = '';
    
    // Standard alternative options
    const altOptions = [
        { id: 'altParents', value: 'parents', label: 'My parents (or surviving parent)' },
        { id: 'altSiblings', value: 'siblings', label: 'My siblings equally' },
        { id: 'altCharity', value: 'charity', label: 'Charitable organization(s)', onchange: 'toggleAlternativeCharityDetails()' },
        { id: 'altOtherPersons', value: 'otherPersons', label: 'Other person(s)', onchange: 'toggleAlternativeOtherPersonsDetails()' }
    ];
    
    altOptions.forEach(option => {
        const onchangeAttr = option.onchange ? ` onchange="${option.onchange}"` : '';
        radioGroup.innerHTML += `
            <div class="radio-item" id="${option.id}Option">
                <input type="radio" id="${option.id}" name="alternativeBeneficiaries" value="${option.value}"${onchangeAttr}>
                <label for="${option.id}">${option.label}</label>
            </div>
        `;
    });
    
    // Show the section
    altSection.style.display = 'block';
}

// Primary selection handlers
function selectSpouseAll() {
    hideAllDetailGroups();
    // No additional details needed for spouse all
}

function selectSpousePartial() {
    hideAllDetailGroups();
    document.getElementById('spousePercentageGroup').style.display = 'block';
}

function selectChildren() {
    hideAllDetailGroups();
    document.getElementById('childrenDetailsGroup').style.display = 'block';
    
    // Show custom option only if multiple children
    if (currentUserData.childCount > 1) {
        document.getElementById('childrenCustomOption').style.display = 'block';
    }
}

function selectCharity() {
    hideAllDetailGroups();
    document.getElementById('charityDetailsGroup').style.display = 'block';
}

function selectOtherPersons() {
    hideAllDetailGroups();
    document.getElementById('otherPersonsDetailsGroup').style.display = 'block';
}

function hideAllDetailGroups() {
    const detailGroups = [
        'spousePercentageGroup',
        'remainingPercentageGroup',
        'childrenDetailsGroup',
        'charityDetailsGroup',
        'otherPersonsDetailsGroup',
        'multipleDistributionGroup'
    ];
    
    detailGroups.forEach(groupId => {
        const group = document.getElementById(groupId);
        if (group) {
            group.style.display = 'none';
        }
    });
}

// Spouse percentage calculation
function calculateRemainingPercentage() {
    const spousePercentage = parseInt(document.getElementById('spousePercentage').value) || 0;
    const remaining = 100 - spousePercentage;
    
    if (remaining > 0 && remaining < 100) {
        // Show remaining distribution options
        document.getElementById('remainingPercentageGroup').style.display = 'block';
        document.getElementById('remainingAmount').textContent = remaining;
        
        // Populate remaining distribution options
        populateRemainingDistributionOptions(remaining);
    } else {
        document.getElementById('remainingPercentageGroup').style.display = 'none';
    }
}

function populateRemainingDistributionOptions(remainingPercent) {
    const radioGroup = document.getElementById('remainingDistributionRadioGroup');
    radioGroup.innerHTML = '';
    
    let options = [];
    
    // Add children option if user has children
    if (currentUserData.hasChildren === 'yes' && currentUserData.childCount > 0) {
        const childLabel = currentUserData.childCount === 1 ? 'To my child' : 'To my children';
        options.push({
            id: 'remainingChildren',
            value: 'children',
            label: childLabel,
            onchange: 'selectRemainingChildren()'
        });
    }
    
    options.push({
        id: 'remainingCharity',
        value: 'charity',
        label: 'To charitable organization(s)',
        onchange: 'selectRemainingCharity()'
    });
    options.push({
        id: 'remainingOtherPersons',
        value: 'otherPersons',
        label: 'To other person(s)',
        onchange: 'selectRemainingOtherPersons()'
    });
    options.push({
        id: 'remainingMultiple',
        value: 'multiple',
        label: 'Split among multiple options',
        onchange: 'selectRemainingMultiple()'
    });
    
    options.forEach(option => {
        radioGroup.innerHTML += `
            <div class="radio-item">
                <input type="radio" id="${option.id}" name="remainingDistribution" value="${option.value}" onchange="${option.onchange}">
                <label for="${option.id}">${option.label}</label>
            </div>
        `;
    });
}

// Remaining distribution handlers
function selectRemainingChildren() {
    hideRemainingDetailGroups();
    document.getElementById('childrenDetailsGroup').style.display = 'block';
    
    // Show custom option only if multiple children
    if (currentUserData.childCount > 1) {
        document.getElementById('childrenCustomOption').style.display = 'block';
    }
}

function selectRemainingCharity() {
    hideRemainingDetailGroups();
    document.getElementById('charityDetailsGroup').style.display = 'block';
}

function selectRemainingOtherPersons() {
    hideRemainingDetailGroups();
    document.getElementById('otherPersonsDetailsGroup').style.display = 'block';
}

function selectRemainingMultiple() {
    hideRemainingDetailGroups();
    document.getElementById('multipleDistributionGroup').style.display = 'block';
    
    const remainingAmount = parseInt(document.getElementById('remainingAmount').textContent);
    document.getElementById('multipleRemainingAmount').textContent = remainingAmount;
    
    // Show children option if user has children
    if (currentUserData.hasChildren === 'yes' && currentUserData.childCount > 0) {
        document.getElementById('multipleChildrenOption').style.display = 'block';
    }
}

function hideRemainingDetailGroups() {
    const detailGroups = [
        'childrenDetailsGroup',
        'charityDetailsGroup',
        'otherPersonsDetailsGroup',
        'multipleDistributionGroup'
    ];
    
    detailGroups.forEach(groupId => {
        const group = document.getElementById(groupId);
        if (group) {
            group.style.display = 'none';
        }
    });
}

// Children detail functions
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
                    <input type="number" id="child${index + 1}Share" name="childShare[]" min="0" max="100" placeholder="50" style="width: 80px;" step="1" onchange="validateCustomChildShares()">
                    <span>%</span>
                    <input type="hidden" name="childName[]" value="${name}">
                </div>
            </div>
        `;
    });
    
    customSharesGroup.style.display = 'block';
}

function hideCustomChildShares() {
    document.getElementById('customChildSharesGroup').style.display = 'none';
}

function validateCustomChildShares() {
    const childShares = document.querySelectorAll('input[name="childShare[]"]');
    let total = 0;
    
    childShares.forEach(share => {
        const value = parseInt(share.value) || 0;
        total += value;
    });
    
    const targetTotal = getTargetPercentage();
    
    // Visual feedback for total
    const customSharesGroup = document.getElementById('customChildSharesGroup');
    const existingTotal = customSharesGroup.querySelector('.total-display');
    if (existingTotal) existingTotal.remove();
    
    const totalDisplay = document.createElement('div');
    totalDisplay.className = 'total-display';
    totalDisplay.style.marginTop = '10px';
    totalDisplay.style.fontWeight =
         totalDisplay.style.fontWeight = 'bold';
   
   if (total === targetTotal) {
       totalDisplay.style.color = 'green';
       totalDisplay.textContent = `✓ Total: ${total}% (matches required ${targetTotal}%)`;
   } else if (total > targetTotal) {
       totalDisplay.style.color = 'red';
       totalDisplay.textContent = `✗ Total: ${total}% (exceeds required ${targetTotal}% by ${total - targetTotal}%)`;
   } else {
       totalDisplay.style.color = 'orange';
       totalDisplay.textContent = `⚠ Total: ${total}% (need ${targetTotal - total}% more to reach ${targetTotal}%)`;
   }
   
   customSharesGroup.appendChild(totalDisplay);
}

function getTargetPercentage() {
   // If spouse partial, target is remaining percentage
   const spousePartial = document.getElementById('primarySpousePartial');
   if (spousePartial && spousePartial.checked) {
       const remaining = parseInt(document.getElementById('remainingAmount').textContent) || 100;
       return remaining;
   }
   
   // Otherwise target is 100%
   return 100;
}

// Trust functions
function showTrustDetails() {
   document.getElementById('trustDetailsGroup').style.display = 'block';
}

function hideTrustDetails() {
   document.getElementById('trustDetailsGroup').style.display = 'none';
}

// Multiple distribution functions
function toggleMultipleChildrenDetails() {
   const checkbox = document.getElementById('multipleChildren');
   const percentageDiv = document.getElementById('multipleChildrenPercentage');
   
   if (checkbox.checked) {
       percentageDiv.style.display = 'block';
   } else {
       percentageDiv.style.display = 'none';
       document.getElementById('childrenMultiplePercent').value = '';
   }
   
   validateMultipleDistribution();
}

function toggleMultipleCharityDetails() {
   const checkbox = document.getElementById('multipleCharity');
   const percentageDiv = document.getElementById('multipleCharityPercentage');
   
   if (checkbox.checked) {
       percentageDiv.style.display = 'block';
   } else {
       percentageDiv.style.display = 'none';
       document.getElementById('charityMultiplePercent').value = '';
   }
   
   validateMultipleDistribution();
}

function toggleMultipleOtherPersonsDetails() {
   const checkbox = document.getElementById('multipleOtherPersons');
   const percentageDiv = document.getElementById('multipleOtherPersonsPercentage');
   
   if (checkbox.checked) {
       percentageDiv.style.display = 'block';
   } else {
       percentageDiv.style.display = 'none';
       document.getElementById('otherPersonsMultiplePercent').value = '';
   }
   
   validateMultipleDistribution();
}

function validateMultipleDistribution() {
   const childrenPercent = parseInt(document.getElementById('childrenMultiplePercent').value) || 0;
   const charityPercent = parseInt(document.getElementById('charityMultiplePercent').value) || 0;
   const otherPersonsPercent = parseInt(document.getElementById('otherPersonsMultiplePercent').value) || 0;
   
   const total = childrenPercent + charityPercent + otherPersonsPercent;
   const target = parseInt(document.getElementById('multipleRemainingAmount').textContent);
   
   const validationDiv = document.getElementById('multipleDistributionValidation');
   
   if (total === target) {
       validationDiv.style.color = 'green';
       validationDiv.textContent = `✓ Total: ${total}% (matches required ${target}%)`;
       validationDiv.style.display = 'block';
   } else if (total > target) {
       validationDiv.style.color = 'red';
       validationDiv.textContent = `✗ Total: ${total}% (exceeds required ${target}% by ${total - target}%)`;
       validationDiv.style.display = 'block';
   } else if (total > 0) {
       validationDiv.style.color = 'orange';
       validationDiv.textContent = `⚠ Total: ${total}% (need ${target - total}% more to reach ${target}%)`;
       validationDiv.style.display = 'block';
   } else {
       validationDiv.style.display = 'none';
   }
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
           <input type="number" id="charity${charityCount}Percentage" name="charityPercentage[]" min="1" max="100" placeholder="25" step="1" onchange="validateCharityPercentages()">
           <span>%</span>
       </div>
       <button type="button" class="remove-btn" onclick="removeCharity(this)">Remove This Charity</button>
   `;
   charitiesList.appendChild(newCharityEntry);
}

function removeCharity(button) {
   button.parentElement.remove();
   validateCharityPercentages();
}

function validateCharityPercentages() {
   const charityPercentages = document.querySelectorAll('input[name="charityPercentage[]"]');
   let total = 0;
   
   charityPercentages.forEach(input => {
       const value = parseInt(input.value) || 0;
       total += value;
   });
   
   const targetTotal = getTargetPercentage();
   
   // Visual feedback
   const charityGroup = document.getElementById('charityDetailsGroup');
   const existingTotal = charityGroup.querySelector('.charity-total-display');
   if (existingTotal) existingTotal.remove();
   
   const totalDisplay = document.createElement('div');
   totalDisplay.className = 'charity-total-display';
   totalDisplay.style.marginTop = '10px';
   totalDisplay.style.fontWeight = 'bold';
   
   if (total === targetTotal) {
       totalDisplay.style.color = 'green';
       totalDisplay.textContent = `✓ Total: ${total}% (matches required ${targetTotal}%)`;
   } else if (total > targetTotal) {
       totalDisplay.style.color = 'red';
       totalDisplay.textContent = `✗ Total: ${total}% (exceeds required ${targetTotal}% by ${total - targetTotal}%)`;
   } else {
       totalDisplay.style.color = 'orange';
       totalDisplay.textContent = `⚠ Total: ${total}% (need ${targetTotal - total}% more to reach ${targetTotal}%)`;
   }
   
   charityGroup.appendChild(totalDisplay);
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
           <input type="number" id="otherPerson${otherPersonCount}Percentage" name="otherPersonPercentage[]" min="1" max="100" placeholder="25" step="1" onchange="validateOtherPersonsPercentages()">
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
   validateOtherPersonsPercentages();
}

function validateOtherPersonsPercentages() {
   const otherPersonPercentages = document.querySelectorAll('input[name="otherPersonPercentage[]"]');
   let total = 0;
   
   otherPersonPercentages.forEach(input => {
       const value = parseInt(input.value) || 0;
       total += value;
   });
   
   const targetTotal = getTargetPercentage();
   
   // Visual feedback
   const otherPersonsGroup = document.getElementById('otherPersonsDetailsGroup');
   const existingTotal = otherPersonsGroup.querySelector('.other-persons-total-display');
   if (existingTotal) existingTotal.remove();
   
   const totalDisplay = document.createElement('div');
   totalDisplay.className = 'other-persons-total-display';
   totalDisplay.style.marginTop = '10px';
   totalDisplay.style.fontWeight = 'bold';
   
   if (total === targetTotal) {
       totalDisplay.style.color = 'green';
       totalDisplay.textContent = `✓ Total: ${total}% (matches required ${targetTotal}%)`;
   } else if (total > targetTotal) {
       totalDisplay.style.color = 'red';
       totalDisplay.textContent = `✗ Total: ${total}% (exceeds required ${targetTotal}% by ${total - targetTotal}%)`;
   } else {
       totalDisplay.style.color = 'orange';
       totalDisplay.textContent = `⚠ Total: ${total}% (need ${targetTotal - total}% more to reach ${targetTotal}%)`;
   }
   
   otherPersonsGroup.appendChild(totalDisplay);
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

// Summary functions
function updateDistributionSummary() {
   const summarySection = document.getElementById('distributionSummary');
   const summaryContent = document.getElementById('summaryContent');
   
   const primarySelection = document.querySelector('input[name="primaryBeneficiaries"]:checked')?.value;
   const spousePercentage = document.getElementById('spousePercentage')?.value;
   const remainingSelection = document.querySelector('input[name="remainingDistribution"]:checked')?.value;
   const alternativeSelection = document.querySelector('input[name="alternativeBeneficiaries"]:checked')?.value;
   
   let summaryHTML = '<h4>Your Estate Distribution Plan:</h4>';
   
   // Primary distribution
   if (primarySelection === 'spouseAll') {
       summaryHTML += '<p><strong>Spouse:</strong> 100% of remaining estate</p>';
   } else if (primarySelection === 'spousePartial' && spousePercentage) {
       summaryHTML += `<p><strong>Spouse:</strong> ${spousePercentage}% of remaining estate</p>`;
       
       if (remainingSelection) {
           const remaining = 100 - parseInt(spousePercentage);
           summaryHTML += `<p><strong>Remaining ${remaining}%:</strong> ${getRemainingDistributionText(remainingSelection)}</p>`;
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

function getRemainingDistributionText(selection) {
   switch(selection) {
       case 'children': 
           return currentUserData.childCount === 1 ? 'To child' : 'To children equally';
       case 'charity': 
           return 'To charitable organizations';
       case 'otherPersons': 
           return 'To other persons';
       case 'multiple': 
           return 'Split among multiple beneficiaries';
       default: 
           return '';
   }
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
           const remainingSelection = document.querySelector('input[name="remainingDistribution"]:checked');
           if (!remainingSelection) {
               errors.push('Please select how to distribute the remaining percentage');
           } else {
               // Validate remaining distribution details
               if (remainingSelection.value === 'multiple') {
                   const targetTotal = 100 - parseInt(spousePercentage);
                   const childrenPercent = parseInt(document.getElementById('childrenMultiplePercent').value) || 0;
                   const charityPercent = parseInt(document.getElementById('charityMultiplePercent').value) || 0;
                   const otherPersonsPercent = parseInt(document.getElementById('otherPersonsMultiplePercent').value) || 0;
                   const actualTotal = childrenPercent + charityPercent + otherPersonsPercent;
                   
                   if (actualTotal !== targetTotal) {
                       errors.push(`Multiple distribution percentages must add up to ${targetTotal}% (currently ${actualTotal}%)`);
                   }
               }
           }
       }
   }
   
   // Validate children distribution if selected
   const childrenDistribution = document.querySelector('input[name="childrenDistribution"]:checked');
   if (childrenDistribution?.value === 'custom') {
       const childShares = document.querySelectorAll('input[name="childShare[]"]');
       let totalShares = 0;
       let hasEmptyShares = false;
       
       childShares.forEach(share => {
           const value = parseInt(share.value);
           if (!value || value < 0) {
               hasEmptyShares = true;
           } else {
               totalShares += value;
           }
       });
       
       if (hasEmptyShares) {
           errors.push('Please specify percentages for all children');
       } else {
           const targetTotal = getTargetPercentage();
           if (totalShares !== targetTotal) {
               errors.push(`Children's percentages must add up to ${targetTotal}% (currently ${totalShares}%)`);
           }
       }
   }
   
   // Validate trust details if trust is selected
   const trustDistribution = document.getElementById('distributionTrust');
   if (trustDistribution?.checked) {
       const trustAge = document.getElementById('trustAge').value;
       if (!trustAge || trustAge < 18 || trustAge > 50) {
           errors.push('Please enter a valid trust age (18-50)');
       }
   }
   
   // Check alternative beneficiaries
   const alternativeSelection = document.querySelector('input[name="alternativeBeneficiaries"]:checked');
   if (!alternativeSelection) {
       errors.push('Please select alternative beneficiaries');
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
       errorP.textContent = 'Please fix the following issues:\n' + validation.errors.join('\n');
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
   
   const altCharityNames = formData.getAll('altCharityName[]').filter(name => name.trim());
   const altCharityPercentages = formData.getAll('altCharityPercentage[]').filter(pct => pct.trim());
   
   const altOtherPersonNames = formData.getAll('altOtherPersonName[]').filter(name => name.trim());
   const altOtherPersonPercentages = formData.getAll('altOtherPersonPercentage[]').filter(pct => pct.trim());
   const altOtherPersonAlternates = formData.getAll('altOtherPersonAlternate[]');
   
   // Handle custom child shares
   const childShares = formData.getAll('childShare[]');
   const childNames = formData.getAll('childName[]');
   
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
   
   data.alternativeCharities = altCharityNames.map((name, index) => ({
       name: name,
       percentage: parseInt(altCharityPercentages[index]) || 0
   }));
   
   data.alternativeOtherPersons = altOtherPersonNames.map((name, index) => ({
       name: name,
       percentage: parseInt(altOtherPersonPercentages[index]) || 0,
       alternate: altOtherPersonAlternates[index] || ''
   }));
   
   data.customChildShares = childShares.map((share, index) => ({
       name: childNames[index],
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

function continueToExecutors() {
   const urlParams = new URLSearchParams(window.location.search);
   window.location.href = `executors.html?${urlParams.toString()}`;
}

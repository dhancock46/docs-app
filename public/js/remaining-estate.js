document.addEventListener('DOMContentLoaded', function() {
    // Auto-populate data from previous sections
    const urlParams = new URLSearchParams(window.location.search);
    const testatorName = urlParams.get('testatorName');
    const email = urlParams.get('email');
    const maritalStatus = urlParams.get('maritalStatus');
    const hasChildren = urlParams.get('hasChildren');
    const childrenNames = urlParams.get('childrenNames') || urlParams.get('priorChildrenNames');
    
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
    
    // Simple section display logic - show what's needed from the start
    if (hasChildren === 'yes' && childCount > 0) {
        // Show primary distributees section for users with children
        setupPrimaryDistributeesForChildren(childCount, childrenNamesArray);
        document.getElementById('primaryDistributeesSection').style.display = 'block';
} else if (maritalStatus === 'married' && hasChildren === 'no') {
    console.log('Showing primary beneficiaries for married with no children');
    // Show primary beneficiaries for married users with no children
    document.getElementById('primaryBeneficiariesSection').style.display = 'block';
    
} else if (maritalStatus === 'single' && hasChildren === 'no') {
    console.log('Showing primary beneficiaries for single with no children');
    // Show primary beneficiaries for single users with no children
    document.getElementById('primaryBeneficiariesSection').style.display = 'block';
}  
    // Show spouse options for married users
    document.getElementById('primarySpouseAllOption').style.display = 'block';
    document.getElementById('primarySpousePartialOption').style.display = 'block';

      // Show spouse options for married users
    document.getElementById('primarySpouseAllOption').style.display = 'block';
    document.getElementById('primarySpousePartialOption').style.display = 'block';

    // ALWAYS show alternative beneficiaries section
    document.getElementById('alternativeBeneficiariesSection').style.display = 'block';
    
    // Prevent Enter key submission
    document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });

// Setup primary distributees section for users with children (simplified)
function setupPrimaryDistributeesForChildren(childCount, childrenNames) {
    const primarySection = document.getElementById('primaryDistributeesSection');
    const primaryTitle = document.querySelector('#primaryDistributeesSection h3');
    const radioGroup = document.querySelector('#primaryDistributeesSection .radio-group');
    
    // Update heading
    primaryTitle.textContent = 'Primary Beneficiaries';
    
    // Create child distribution options based on count
    if (childCount === 1) {
        // Single child option
        radioGroup.innerHTML = `
            <div class="radio-item">
                <input type="radio" id="primaryAllToChild" name="primaryDistribution" value="allToChild" onchange="showTrustOptions()">
                <label for="primaryAllToChild">All to my child</label>
            </div>
            <div class="radio-item">
                <input type="radio" id="primaryCharity" name="primaryDistribution" value="charity" onchange="showPrimaryCharityDetails()">
                <label for="primaryCharity">Charitable organization(s)</label>
            </div>
            <div class="radio-item">
               <input type="radio" id="primaryOtherPersons" name="primaryDistribution" value="otherPersons" onchange="showPrimaryOtherPersonsDetails()">
                <label for="primaryOtherPersons">Other person(s)</label>
            </div>
        `;
    } else {
        // Multiple children options
        radioGroup.innerHTML = `
            <div class="radio-item">
                <input type="radio" id="primaryEqualChildren" name="primaryDistribution" value="equalChildren" onchange="showTrustOptions()">
                <label for="primaryEqualChildren">All to my children in equal shares</label>
            </div>
            <div class="radio-item">
                <input type="radio" id="primaryCustomChildren" name="primaryDistribution" value="customChildren" onchange="showCustomChildShares(); showTrustOptions()">
                <label for="primaryCustomChildren">All to my children with different amounts to each child</label>
            </div>
            <div class="radio-item">
                <input type="radio" id="primaryCharity" name="primaryDistribution" value="charity" onchange="showPrimaryCharityDetails()">
                <label for="primaryCharity">Charitable organization(s)</label>
            </div>
            <div class="radio-item">
                <input type="radio" id="primaryOtherPersons" name="primaryDistribution" value="otherPersons" onchange="showPrimaryOtherPersonsDetails()">
                <label for="primaryOtherPersons">Other person(s)</label>
            </div>
        `;
    }
    
    // Store child count and names for later use
    window.childCount = childCount;
    window.childrenNames = childrenNames;
}

// Counter variables
let charityCount = 1;
let otherPersonCount = 1;
// Counter variables for alternative section
let altCharityCount = 1;
let altOtherPersonCount = 1;

// Show primary charity details (copied exactly from gifts.js pattern)
function showPrimaryCharityDetails() {
    console.log('showPrimaryCharityDetails called!');
    const charitySection = document.getElementById('primaryCharityDetailsGroup');
    if (charitySection) {
        charitySection.style.display = 'block';
        console.log('Primary charity section shown');
        
        // Make sure the charity list is visible (copied from gifts.js)
        const charitiesList = document.getElementById('charitiesList');
        if (charitiesList) {
            charitiesList.style.display = 'block';
        }
    } else {
        console.log('primaryCharityDetailsGroup not found!');
    }
    hideTrustOptions();
    updateAlternativeOptions();
}

// Show primary other persons details (copied exactly from gifts.js pattern)
function showPrimaryOtherPersonsDetails() {
    console.log('showPrimaryOtherPersonsDetails called!');
    const otherPersonsSection = document.getElementById('otherPersonsDetailsGroup');
    if (otherPersonsSection) {
        otherPersonsSection.style.display = 'block';
        console.log('Primary other persons section shown');
        
        // Make sure the other persons list is visible (copied from gifts.js)
        const otherPersonsList = document.getElementById('otherPersonsList');
        if (otherPersonsList) {
            otherPersonsList.style.display = 'block';
        }
    } else {
        console.log('otherPersonsDetailsGroup not found!');
    }
    hideTrustOptions();
    updateAlternativeOptions();
}
// Functions for single users without children
function togglePrimaryCharityDetails() {
    const primaryCharity = document.getElementById('primaryCharity').checked;
    const charityDetailsGroup = document.getElementById('primaryCharityDetailsForSingle');
    
    if (primaryCharity && charityDetailsGroup) {
        charityDetailsGroup.style.display = 'block';
    } else if (charityDetailsGroup) {
        charityDetailsGroup.style.display = 'none';
    }
    updateAlternativeOptions();
}

function toggleOtherPersonsDetails() {
    const otherPersons = document.getElementById('primaryOtherPersons').checked;
    const otherPersonsGroup = document.getElementById('primaryOtherPersonsDetailsForSingle');
    
    if (otherPersons && otherPersonsGroup) {
        otherPersonsGroup.style.display = 'block';
    } else if (otherPersonsGroup) {
        otherPersonsGroup.style.display = 'none';
    }
    updateAlternativeOptions();
}
// Add another charity (copied from gifts.js pattern)
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
            <input type="number" id="charity${charityCount}Percentage" name="charityPercentage[]" min="1" max="100" placeholder="25" step="1">
            <span>%</span>
        </div>
        <button type="button" class="remove-btn" onclick="removeCharity(this)">Remove This Charity</button>
    `;
    charitiesList.appendChild(newCharityEntry);
}

// Add another other person (copied from gifts.js pattern)
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
            <input type="number" id="otherPerson${otherPersonCount}Percentage" name="otherPersonPercentage[]" min="1" max="100" placeholder="25" step="1">
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
// Add another other person (copied from gifts.js pattern)
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
            <input type="number" id="otherPerson${otherPersonCount}Percentage" name="otherPersonPercentage[]" min="1" max="100" placeholder="25" step="1">
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

// ADD THE NEW FUNCTIONS HERE:

// Add another alternative charity
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
            <label for="altCharity${altCharityCount}Percentage">Percentage of Remaining Estate *</label>
            <input type="number" id="altCharity${altCharityCount}Percentage" name="altCharityPercentage[]" min="1" max="100" placeholder="25" step="1">
            <span>%</span>
        </div>
        <button type="button" class="remove-btn" onclick="removeAlternativeCharity(this)">Remove This Charity</button>
    `;
    charitiesList.appendChild(newCharityEntry);
}

// Add another alternative other person
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
            <label for="altOtherPerson${altOtherPersonCount}Percentage">Percentage of Remaining Estate *</label>
            <input type="number" id="altOtherPerson${altOtherPersonCount}Percentage" name="altOtherPersonPercentage[]" min="1" max="100" placeholder="25" step="1">
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
// Remove functions (copied from gifts.js)
function removeCharity(button) {
    button.parentElement.remove();
}

function removeOtherPerson(button) {
    button.parentElement.remove();
}

// Remove functions for alternative section
function removeAlternativeCharity(button) {
    button.parentElement.remove();
}

function removeAlternativeOtherPerson(button) {
    button.parentElement.remove();
}
// Show trust options when children are selected
function showTrustOptions() {
    let trustOptionsGroup = document.getElementById('trustOptionsGroup');
    
    // Create trust options if they don't exist
    if (!trustOptionsGroup) {
        const primarySection = document.getElementById('primaryDistributeesSection');
        const trustOptionsHTML = `
            <div class="form-group" id="trustOptionsGroup">
                <label>How should your child${window.childCount > 1 ? 'ren' : ''} receive the inheritance? *</label>
                <div class="radio-group">
                    <div class="radio-item">
                        <input type="radio" id="distributionOutright" name="distributionType" value="outright" onchange="hideTrustDetails()">
                        <label for="distributionOutright">Outright distribution (no trust)</label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" id="distributionTrust" name="distributionType" value="trust" onchange="showTrustDetails()">
                        <label for="distributionTrust">In trust</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group" id="trustDetailsGroup" style="display: none;">
                ${window.childCount === 1 ? 
                    `<div class="form-group">
                        <label for="singleTrustAge">At what age should the trust end? *</label>
                        <input type="number" id="singleTrustAge" name="singleTrustAge" min="18" max="50" placeholder="25">
                        <small>Enter age between 18 and 50</small>
                    </div>` 
                    : 
                    `<div class="form-group">
                        <label>Trust structure for multiple children *</label>
                        <div class="radio-group">
                            <div class="radio-item">
                                <input type="radio" id="separateTrusts" name="trustStructure" value="separate" onchange="showSeparateTrustAge()">
                                <label for="separateTrusts">Separate trust for each child</label>
                            </div>
                            <div class="radio-item">
                                <input type="radio" id="commonTrust" name="trustStructure" value="common" onchange="showCommonTrustAge()">
                                <label for="commonTrust">One common trust for all children</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group" id="separateTrustAgeGroup" style="display: none;">
                        <label for="separateTrustAge">At what age should each child's trust end? *</label>
                        <input type="number" id="separateTrustAge" name="separateTrustAge" min="18" max="50" placeholder="25">
                        <small>Enter age between 18 and 50</small>
                    </div>
                    
                    <div class="form-group" id="commonTrustAgeGroup" style="display: none;">
                        <label for="commonTrustAge">At what age of the youngest child should the common trust end? *</label>
                        <input type="number" id="commonTrustAge" name="commonTrustAge" min="18" max="50" placeholder="25">
                        <small>Enter age between 18 and 50</small>
                    </div>`
                }
            </div>
        `;
        
        primarySection.insertAdjacentHTML('beforeend', trustOptionsHTML);
    } else {
        trustOptionsGroup.style.display = 'block';
    }
    updateAlternativeOptions();
}

// Hide trust options
function hideTrustOptions() {
    const trustOptionsGroup = document.getElementById('trustOptionsGroup');
    if (trustOptionsGroup) {
        trustOptionsGroup.style.display = 'none';
    }
    hideTrustDetails();
}

// Show trust details
function showTrustDetails() {
    const trustDetailsGroup = document.getElementById('trustDetailsGroup');
    if (trustDetailsGroup) {
        trustDetailsGroup.style.display = 'block';
    }
}

// Hide trust details
function hideTrustDetails() {
    const trustDetailsGroup = document.getElementById('trustDetailsGroup');
    if (trustDetailsGroup) {
        trustDetailsGroup.style.display = 'none';
    }
    
    // Also hide specific trust age groups
    const separateTrustAgeGroup = document.getElementById('separateTrustAgeGroup');
    const commonTrustAgeGroup = document.getElementById('commonTrustAgeGroup');
    if (separateTrustAgeGroup) separateTrustAgeGroup.style.display = 'none';
    if (commonTrustAgeGroup) commonTrustAgeGroup.style.display = 'none';
}

// Show separate trust age input
function showSeparateTrustAge() {
    document.getElementById('separateTrustAgeGroup').style.display = 'block';
    document.getElementById('commonTrustAgeGroup').style.display = 'none';
}

// Show common trust age input
function showCommonTrustAge() {
    document.getElementById('commonTrustAgeGroup').style.display = 'block';
    document.getElementById('separateTrustAgeGroup').style.display = 'none';
}

// Show custom child shares
function showCustomChildShares() {
    let customSharesGroup = document.getElementById('customChildSharesGroup');
    
    if (!customSharesGroup) {
        const primarySection = document.getElementById('primaryDistributeesSection');
        const customSharesHTML = `
            <div class="form-group" id="customChildSharesGroup">
                <label>Specify percentage for each child:</label>
                <div id="childSharesList">
                    ${window.childrenNames.map((name, index) => `
                        <div class="form-group">
                            <label for="child${index + 1}Share">${name}</label>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="number" id="child${index + 1}Share" name="childShare[]" min="0" max="100" placeholder="50" style="width: 80px;" step="1">
                                <span>%</span>
                                <input type="hidden" name="childName[]" value="${name}">
                            </div>
                        </div>
                    `).join('')}
                </div>
                <small>Percentages must add up to 100%</small>
            </div>
        `;
        
        primarySection.insertAdjacentHTML('beforeend', customSharesHTML);
    } else {
        customSharesGroup.style.display = 'block';
    }
}

// Update alternative options based on primary selection (simplified)
function updateAlternativeOptions() {
    const primarySelection = document.querySelector('input[name="primaryDistribution"]:checked')?.value || 
                           document.querySelector('input[name="primaryBeneficiaries"]:checked')?.value;
    
    // Get all alternative option containers
    const altParents = document.getElementById('altParentsOption');
    const altSiblings = document.getElementById('altSiblingsOption');
    const altCharity = document.getElementById('altCharityOption');
    const altOtherPersons = document.getElementById('altOtherPersonsOption');
    
    // Show all options first
    if (altParents) altParents.style.display = 'block';
    if (altSiblings) altSiblings.style.display = 'block';
    if (altCharity) altCharity.style.display = 'block';
    if (altOtherPersons) altOtherPersons.style.display = 'block';
    
    // Hide the option that was selected as primary
    if (primarySelection === 'parents' && altParents) {
        altParents.style.display = 'none';
    } else if (primarySelection === 'siblings' && altSiblings) {
        altSiblings.style.display = 'none';
    } else if (primarySelection === 'charity' && altCharity) {
        altCharity.style.display = 'none';
    } else if (primarySelection === 'otherPersons' && altOtherPersons) {
        altOtherPersons.style.display = 'none';
    }
}

// Alternative details toggles (simplified like gifts.js)
function toggleAlternativeCharityDetails() {
    const altCharity = document.getElementById('altCharity').checked;
    const altCharityGroup = document.getElementById('alternativeCharityDetailsGroup');
    const altOtherPersonsGroup = document.getElementById('alternativeOtherPersonsDetailsGroup');
    
    if (altCharity && altCharityGroup) {
        altCharityGroup.style.display = 'block';
        
        // Make sure the charity list is visible
        const altCharitiesList = document.getElementById('alternativeCharitiesList');
        if (altCharitiesList) {
            altCharitiesList.style.display = 'block';
        }
        
        // Hide other persons section
        if (altOtherPersonsGroup) {
            altOtherPersonsGroup.style.display = 'none';
        }
    } else if (altCharityGroup) {
        altCharityGroup.style.display = 'none';
    }
}

function toggleAlternativeOtherPersonsDetails() {
    const altOtherPersons = document.getElementById('altOtherPersons').checked;
    const altOtherPersonsGroup = document.getElementById('alternativeOtherPersonsDetailsGroup');
    const altCharityGroup = document.getElementById('alternativeCharityDetailsGroup');
    
    if (altOtherPersons && altOtherPersonsGroup) {
        altOtherPersonsGroup.style.display = 'block';
        
        // Make sure the other persons list is visible
        const altOtherPersonsList = document.getElementById('alternativeOtherPersonsList');
        if (altOtherPersonsList) {
            altOtherPersonsList.style.display = 'block';
        }
        
        // Hide charity section
        if (altCharityGroup) {
            altCharityGroup.style.display = 'none';
        }
    } else if (altOtherPersonsGroup) {
        altOtherPersonsGroup.style.display = 'none';
    }
}

// Spouse distribution functions
function toggleChildrenDistribution() {
    const spouseDistribution = document.querySelector('input[name="spouseDistribution"]:checked')?.value;
    const childrenSection = document.getElementById('childrenDistributionSection');
    
    if (spouseDistribution === 'all') {
        childrenSection.style.display = 'block';
        const childrenLabel = childrenSection.querySelector('h3');
        childrenLabel.textContent = 'Distribution to Your Children (if spouse does not survive)';
    } else if (spouseDistribution === 'partial' || spouseDistribution === 'none') {
        childrenSection.style.display = 'block';
        const childrenLabel = childrenSection.querySelector('h3');
        childrenLabel.textContent = 'Distribution to Your Children';
    }
}

function toggleSpousePercentage() {
    const spousePartial = document.getElementById('spousePartial').checked;
    const percentageGroup = document.getElementById('spousePercentageGroup');
    
    if (spousePartial) {
        percentageGroup.style.display = 'block';
    } else {
        percentageGroup.style.display = 'none';
    }
}
// Toggle spouse percentage input for primary beneficiaries
function togglePrimarySpouseOptions() {
    const spousePartial = document.getElementById('primarySpousePartial').checked;
    const percentageGroup = document.getElementById('primarySpousePercentageGroup');
    
    // Hide all other detail sections when switching primary beneficiaries
    document.getElementById('primaryCharityDetailsForSingle').style.display = 'none';
    document.getElementById('primaryOtherPersonsDetailsForSingle').style.display = 'none';
    
    if (spousePartial) {
        percentageGroup.style.display = 'block';
    } else {
        percentageGroup.style.display = 'none';
    }
}
// Form validation (simplified)
function validateForm() {
    const errors = [];
    
    // Check primary distribution
    const primaryDistribution = document.querySelector('input[name="primaryDistribution"]:checked') ||
                               document.querySelector('input[name="primaryBeneficiaries"]:checked');
    if (!primaryDistribution) {
        errors.push('Please select how your primary beneficiaries should receive their share');
    }
    
    // Check alternative beneficiaries
    const alternativeBeneficiaries = document.querySelector('input[name="alternativeBeneficiaries"]:checked');
    if (!alternativeBeneficiaries) {
        errors.push('Please select alternative beneficiaries');
    }
    
    return { isValid: errors.length === 0, errors };
}

// Form submission (copied from gifts.js pattern)
document.getElementById('remainingEstateForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate form
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
    
    // Hide all messages initially
    loadingMessage.style.display = 'none';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Show loading message
    loadingMessage.style.display = 'block';
    
    // Collect form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    // Handle arrays for charity/other persons data
    const charityNames = formData.getAll('charityName[]').filter(name => name.trim());
    const charityPercentages = formData.getAll('charityPercentage[]').filter(pct => pct.trim());
    const otherPersonNames = formData.getAll('otherPersonName[]').filter(name => name.trim());
    const otherPersonPercentages = formData.getAll('otherPersonPercentage[]').filter(pct => pct.trim());
    const otherPersonAlternates = formData.getAll('otherPersonAlternate[]');
    
    // Build charity array
    data.charities = charityNames.map((name, index) => ({
        name: name,
        percentage: parseInt(charityPercentages[index]) || 0
    }));
    
    // Build other persons array
    data.otherPersons = otherPersonNames.map((name, index) => ({
        name: name,
        percentage: parseInt(otherPersonPercentages[index]) || 0,
        alternate: otherPersonAlternates[index] || ''
    }));
    
    // Add document type and section
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
});
// Function to continue to executors with URL parameters
function continueToExecutors() {
    const urlParams = new URLSearchParams(window.location.search);
    window.location.href = `executors.html?${urlParams.toString()}`;
}

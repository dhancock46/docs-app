// Initialize form when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Auto-populate data from previous sections
    const urlParams = new URLSearchParams(window.location.search);
    const testatorName = urlParams.get('testatorName');
    const email = urlParams.get('email');
    const maritalStatus = urlParams.get('maritalStatus');
    const hasChildren = urlParams.get('hasChildren');
    const childrenNames = urlParams.get('childrenNames');
    // ADD THESE 4 DEBUGGING LINES:
    console.log('Current URL:', window.location.href);
    console.log('URL Parameters:', urlParams.toString());
    console.log('testatorName from URL:', urlParams.get('testatorName'));
    console.log('email from URL:', urlParams.get('email'));
    
    if (testatorName) {
        document.getElementById('testatorName').value = decodeURIComponent(testatorName);
    }
    if (email) {
        document.getElementById('clientEmail').value = decodeURIComponent(email);
    }
    
    // Show appropriate sections based on user's situation
    if (maritalStatus === 'married') {
        document.getElementById('spouseDistributionSection').style.display = 'block';
    }
    
    if (hasChildren === 'yes') {
        document.getElementById('childrenDistributionSection').style.display = 'block';
        
        // Populate children names for custom shares if available
        if (childrenNames) {
            populateChildrenShares(decodeURIComponent(childrenNames));
        }
    }
    
  // Show primary beneficiaries for single users with no children
  if (maritalStatus === 'single' && hasChildren === 'no') {
    document.getElementById('primaryBeneficiariesSection').style.display = 'block';
    // Don't show alternatives yet - will be shown when primary is selected
  } else {
    // Hide primary beneficiaries for other users
    document.getElementById('primaryBeneficiariesSection').style.display = 'none';
    // Show alternative beneficiaries for married users or users with children
    document.getElementById('alternativeBeneficiariesSection').style.display = 'block';
  }
    
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

// Toggle children distribution based on spouse selection
function toggleChildrenDistribution() {
    const spouseDistribution = document.querySelector('input[name="spouseDistribution"]:checked')?.value;
    const childrenSection = document.getElementById('childrenDistributionSection');
    
    if (spouseDistribution === 'all') {
        // If spouse gets everything, children section becomes conditional
        childrenSection.style.display = 'block';
        const childrenLabel = childrenSection.querySelector('h3');
        childrenLabel.textContent = 'Distribution to Your Children (if spouse does not survive)';
    } else if (spouseDistribution === 'partial' || spouseDistribution === 'none') {
        // If spouse gets partial or none, children get the remainder
        childrenSection.style.display = 'block';
        const childrenLabel = childrenSection.querySelector('h3');
        childrenLabel.textContent = 'Distribution to Your Children';
    }
    
    updateDistributionSummary();
}

// Show/hide spouse percentage input
function toggleSpousePercentage() {
    const spousePartial = document.getElementById('spousePartial').checked;
    const percentageGroup = document.getElementById('spousePercentageGroup');
    
    if (spousePartial) {
        percentageGroup.style.display = 'block';
    } else {
        percentageGroup.style.display = 'none';
    }
}

// Add event listener for spouse partial selection
document.addEventListener('DOMContentLoaded', function() {
    const spousePartial = document.getElementById('spousePartial');
    if (spousePartial) {
        spousePartial.addEventListener('change', toggleSpousePercentage);
    }
});

// Toggle custom children shares
function toggleCustomChildrenShares() {
    const customChildren = document.getElementById('childrenCustom').checked;
    const customSharesGroup = document.getElementById('customChildrenSharesGroup');
    
    if (customChildren) {
        customSharesGroup.style.display = 'block';
    } else {
        customSharesGroup.style.display = 'none';
    }
}

// Populate children shares for custom distribution
function populateChildrenShares(childrenNamesString) {
    const childrenSharesList = document.getElementById('childrenSharesList');
    const childrenNames = childrenNamesString.split(',').map(name => name.trim());
    
    childrenSharesList.innerHTML = '';
    
    childrenNames.forEach((name, index) => {
        const shareDiv = document.createElement('div');
        shareDiv.className = 'form-group';
        shareDiv.innerHTML = `
            <label for="child${index + 1}Share">${name}</label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="number" id="child${index + 1}Share" name="childShare[]" min="0" max="100" placeholder="25" style="width: 80px;">
                <span>%</span>
                <input type="hidden" name="childName[]" value="${name}">
            </div>
        `;
        childrenSharesList.appendChild(shareDiv);
    });
}

// Toggle charity details
function toggleCharityDetails() {
    const altCharity = document.getElementById('altCharity').checked;
    const charityDetailsGroup = document.getElementById('charityDetailsGroup');
    
    if (altCharity) {
        charityDetailsGroup.style.display = 'block';
    } else {
        charityDetailsGroup.style.display = 'none';
    }
}

// Toggle custom alternatives
function toggleCustomAlternatives() {
    const altCustom = document.getElementById('altCustom').checked;
    const customAlternativesGroup = document.getElementById('customAlternativesGroup');
    
    if (altCustom) {
        customAlternativesGroup.style.display = 'block';
    } else {
        customAlternativesGroup.style.display = 'none';
    }
}
// Counter variables
let charityCount = 1;
let otherPersonCount = 1;

// Toggle primary charity details
function togglePrimaryCharityDetails() {
    const primaryCharity = document.getElementById('primaryCharity').checked;
    const charityDetailsGroup = document.getElementById('primaryCharityDetailsGroup');
    
    if (primaryCharity) {
        charityDetailsGroup.style.display = 'block';
    } else {
        charityDetailsGroup.style.display = 'none';
    }
}

// Toggle other persons details
function toggleOtherPersonsDetails() {
    const otherPersons = document.getElementById('primaryOtherPersons').checked;
    const otherPersonsGroup = document.getElementById('otherPersonsDetailsGroup');
    
    if (otherPersons) {
        otherPersonsGroup.style.display = 'block';
    } else {
        otherPersonsGroup.style.display = 'none';
    }
}

// Add another charity
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

// Add another other person
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

// Remove functions
function removeCharity(button) {
    button.parentElement.remove();
}

function removeOtherPerson(button) {
    button.parentElement.remove();
}

// Update alternative options based on primary selection
function updateAlternativeOptions() {
    const primarySelection = document.querySelector('input[name="primaryBeneficiaries"]:checked')?.value;
    const altSection = document.getElementById('alternativeBeneficiariesSection');
    
    console.log('updateAlternativeOptions called');
    console.log('primarySelection:', primarySelection);
    
    // Show alternatives section for single users with no children
    const urlParams = new URLSearchParams(window.location.search);
    const maritalStatus = urlParams.get('maritalStatus');
    const hasChildren = urlParams.get('hasChildren');
    
    console.log('maritalStatus:', maritalStatus);
    console.log('hasChildren:', hasChildren);
    
    if (maritalStatus === 'single' && hasChildren === 'no' && primarySelection) {
        console.log('Showing alternatives section');
        altSection.style.display = 'block';
        
        // Check if elements exist
        const altParents = document.getElementById('altParentsOption');
        const altSiblings = document.getElementById('altSiblingsOption');
        const altCharity = document.getElementById('altCharityOption');
        const altOtherPersons = document.getElementById('altOtherPersonsOption');
        
        console.log('altParentsOption found:', !!altParents);
        console.log('altSiblingsOption found:', !!altSiblings);
        console.log('altCharityOption found:', !!altCharity);
        console.log('altOtherPersonsOption found:', !!altOtherPersons);
        
        // Reset all options to visible first
        if (altParents) altParents.style.display = 'block';
        if (altSiblings) altSiblings.style.display = 'block';
        if (altCharity) altCharity.style.display = 'block';
        if (altOtherPersons) altOtherPersons.style.display = 'block';
        
        // Then hide the option that was selected as primary
        if (primarySelection === 'parents' && altParents) {
            console.log('Hiding parents option');
            altParents.style.display = 'none';
        } else if (primarySelection === 'siblings' && altSiblings) {
            console.log('Hiding siblings option');
            altSiblings.style.display = 'none';
        } else if (primarySelection === 'charity' && altCharity) {
            console.log('Hiding charity option');
            altCharity.style.display = 'none';
        } else if (primarySelection === 'otherPersons' && altOtherPersons) {
            console.log('Hiding other persons option');
            altOtherPersons.style.display = 'none';
        }
    }
}

// Alternative details toggles
function toggleAlternativeCharityDetails() {
    const altCharity = document.getElementById('altCharity').checked;
    const altCharityGroup = document.getElementById('alternativeCharityDetailsGroup');
    if (altCharity) {
        altCharityGroup.style.display = 'block';
    } else {
        altCharityGroup.style.display = 'none';
    }
}

function toggleAlternativeOtherPersonsDetails() {
    const altOtherPersons = document.getElementById('altOtherPersons').checked;
    const altOtherPersonsGroup = document.getElementById('alternativeOtherPersonsDetailsGroup');
    if (altOtherPersons) {
        altOtherPersonsGroup.style.display = 'block';
    } else {
        altOtherPersonsGroup.style.display = 'none';
    }
}

// Update distribution summary
function updateDistributionSummary() {
    const summarySection = document.getElementById('distributionSummary');
    const summaryContent = document.getElementById('summaryContent');
    
    const spouseDistribution = document.querySelector('input[name="spouseDistribution"]:checked')?.value;
    const spousePercentage = document.getElementById('spousePercentage')?.value;
    const childrenDistribution = document.querySelector('input[name="childrenDistribution"]:checked')?.value;
    const alternativeBeneficiaries = document.querySelector('input[name="alternativeBeneficiaries"]:checked')?.value;
    
    let summaryHTML = '<h4>Your Estate Distribution Plan:</h4>';
    
    // Spouse distribution
    if (spouseDistribution === 'all') {
        summaryHTML += '<p><strong>Spouse:</strong> 100% of remaining estate</p>';
    } else if (spouseDistribution === 'partial' && spousePercentage) {
        summaryHTML += `<p><strong>Spouse:</strong> ${spousePercentage}% of remaining estate</p>`;
    } else if (spouseDistribution === 'none') {
        summaryHTML += '<p><strong>Spouse:</strong> No share of remaining estate</p>';
    }
    
    // Children distribution
    if (childrenDistribution === 'equal') {
        const remainingPercent = spouseDistribution === 'partial' && spousePercentage ? 100 - parseInt(spousePercentage) : 100;
        if (spouseDistribution === 'all') {
            summaryHTML += '<p><strong>Children:</strong> Equal shares if spouse does not survive</p>';
        } else {
            summaryHTML += `<p><strong>Children:</strong> Equal shares of ${remainingPercent}% remaining</p>`;
        }
    } else if (childrenDistribution === 'custom') {
        summaryHTML += '<p><strong>Children:</strong> Custom percentages as specified</p>';
    } else if (childrenDistribution === 'none') {
        summaryHTML += '<p><strong>Children:</strong> No share of remaining estate</p>';
    }
    
    // Alternative beneficiaries
    if (alternativeBeneficiaries) {
        summaryHTML += `<p><strong>If primary beneficiaries cannot inherit:</strong> ${getAlternativeBeneficiaryText(alternativeBeneficiaries)}</p>`;
    }
    
    summaryContent.innerHTML = summaryHTML;
    summarySection.style.display = 'block';
}

// Get text for alternative beneficiary selection
function getAlternativeBeneficiaryText(value) {
    switch(value) {
        case 'parents': return 'Parents (or surviving parent)';
        case 'siblings': return 'Siblings equally';
        case 'charity': return 'Charitable organization';
        case 'custom': return 'Custom beneficiaries as specified';
        default: return '';
    }
}

// Form validation
function validateForm() {
    const errors = [];
    
    // Check spouse distribution for married users
    const spouseDistribution = document.querySelector('input[name="spouseDistribution"]:checked');
    if (document.getElementById('spouseDistributionSection').style.display !== 'none') {
        if (!spouseDistribution) {
            errors.push('Please select how much of your estate should go to your spouse');
        } else if (spouseDistribution.value === 'partial') {
            const spousePercentage = document.getElementById('spousePercentage').value;
            if (!spousePercentage || spousePercentage < 1 || spousePercentage > 100) {
                errors.push('Please enter a valid percentage for your spouse (1-100)');
            }
        }
    }
    
    // Check children distribution
    const childrenDistribution = document.querySelector('input[name="childrenDistribution"]:checked');
    if (document.getElementById('childrenDistributionSection').style.display !== 'none' && !childrenDistribution) {
        errors.push('Please select how your children should receive their share');
    }
    
    // Check custom children shares
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
        } else if (totalShares !== 100) {
            errors.push('Children\'s percentages must add up to 100%');
        }
    }
    
    // Check alternative beneficiaries
    const alternativeBeneficiaries = document.querySelector('input[name="alternativeBeneficiaries"]:checked');
    if (!alternativeBeneficiaries) {
        errors.push('Please select alternative beneficiaries');
    } else if (alternativeBeneficiaries.value === 'charity') {
        const charityName = document.getElementById('charityName').value.trim();
        if (!charityName) {
            errors.push('Please enter the charity name');
        }
    } else if (alternativeBeneficiaries.value === 'custom') {
        const customAlternatives = document.getElementById('customAlternatives').value.trim();
        if (!customAlternatives) {
            errors.push('Please specify your custom alternative beneficiaries');
        }
    }
    
    return { isValid: errors.length === 0, errors };
}

// Form submission
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
    
    // Handle arrays for custom child shares
    if (data.childShare) {
        const childShares = formData.getAll('childShare[]');
        const childNames = formData.getAll('childName[]');
        
        data.customChildShares = childShares.map((share, index) => ({
            name: childNames[index],
            percentage: parseInt(share)
        }));
    }
    
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

// Counter variables for dynamic entries
let charityCount = 1;
let otherPersonCount = 1;
let altCharityCount = 1;
let altOtherPersonCount = 1;

document.addEventListener('DOMContentLoaded', function() {
    // Auto-populate data from previous sections
    const urlParams = new URLSearchParams(window.location.search);
    const testatorName = urlParams.get('testatorName');
    const email = urlParams.get('email');
    const maritalStatus = urlParams.get('maritalStatus');
    const hasChildren = urlParams.get('hasChildren');
    const childrenNames = urlParams.get('childrenNames') || urlParams.get('priorChildrenNames');
    
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
    
    // Simple section display logic - show what's needed from the start
    if (maritalStatus === 'married') {
        console.log('Showing primary beneficiaries for married users');
        // Show primary beneficiaries for ALL married users (with or without children)
        document.getElementById('primaryBeneficiariesSection').style.display = 'block';
        
        // Show spouse options for married users
        document.getElementById('primarySpouseAllOption').style.display = 'block';
        document.getElementById('primarySpousePartialOption').style.display = 'block';
        
        // Show children option if they have children
        if (hasChildren === 'yes') {
            document.getElementById('primaryChildrenEqualOption').style.display = 'block';
        }
    } else if (maritalStatus === 'single' && hasChildren === 'no') {
        console.log('Showing primary beneficiaries for single with no children');
        // Show primary beneficiaries for single users with no children
        document.getElementById('primaryBeneficiariesSection').style.display = 'block';
    }
    
    // Always show alternative beneficiaries section
    document.getElementById('alternativeBeneficiariesSection').style.display = 'block';
    
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

// Percentage allocation management functions
function handlePrimaryBeneficiaryChange() {
    const spousePartial = document.getElementById('primarySpousePartial');
    const remainingDisplay = document.getElementById('remainingPercentageDisplay');
    
    if (spousePartial && spousePartial.checked) {
        // Show percentage tracking when partial spouse is selected
        remainingDisplay.style.display = 'block';
        enableMultipleSelections();
        showPercentageFields();
    } else {
        // Hide percentage tracking for other selections
        remainingDisplay.style.display = 'none';
        disableMultipleSelections();
        hidePercentageFields();
    }
    calculateRemainingPercentage();
}

function enableMultipleSelections() {
    // Allow multiple beneficiary types when partial spouse is selected
    const beneficiaryInputs = document.querySelectorAll('input[name="primaryBeneficiaries"]');
    beneficiaryInputs.forEach(input => {
        if (input.id !== 'primarySpousePartial' && input.id !== 'primarySpouseAll') {
            input.type = 'checkbox';
            input.name = 'primaryBeneficiariesMultiple';
        }
    });
}

function disableMultipleSelections() {
    // Return to single selection mode
    const beneficiaryInputs = document.querySelectorAll('input[name="primaryBeneficiariesMultiple"]');
    beneficiaryInputs.forEach(input => {
        input.type = 'radio';
        input.name = 'primaryBeneficiaries';
        input.checked = false;
    });
    hidePercentageFields();
}

function showPercentageFields() {
    // Show percentage inputs for children option
    const childrenPercentageGroup = document.getElementById('childrenPercentageGroup');
    if (childrenPercentageGroup) {
        childrenPercentageGroup.style.display = 'block';
    }
}

function hidePercentageFields() {
    // Hide percentage inputs
    const childrenPercentageGroup = document.getElementById('childrenPercentageGroup');
    if (childrenPercentageGroup) {
        childrenPercentageGroup.style.display = 'none';
    }
    
    // Clear percentage values
    const childrenPercentage = document.getElementById('childrenPercentage');
    if (childrenPercentage) {
        childrenPercentage.value = '';
    }
}

function calculateRemainingPercentage() {
    let totalAllocated = 0;
    let allocations = {};
    
    // Get spouse percentage
    const spousePercentage = document.getElementById('primarySpousePercentage');
    const spousePartial = document.getElementById('primarySpousePartial');
    
    if (spousePartial && spousePartial.checked && spousePercentage && spousePercentage.value) {
        const spouseValue = parseInt(spousePercentage.value) || 0;
        totalAllocated += spouseValue;
        allocations.spouse = spouseValue;
        
        // Show spouse allocation
        document.getElementById('spouseAllocation').style.display = 'block';
        document.getElementById('spousePercentageDisplay').textContent = spouseValue;
    } else {
        document.getElementById('spouseAllocation').style.display = 'none';
    }
    
    // Get children percentage
    const childrenCheckbox = document.getElementById('primaryChildrenEqual');
    const childrenPercentage = document.getElementById('childrenPercentage');
    
    if (childrenCheckbox && childrenCheckbox.checked && childrenPercentage && childrenPercentage.value) {
        const childrenValue = parseInt(childrenPercentage.value) || 0;
        totalAllocated += childrenValue;
        allocations.children = childrenValue;
        
        // Show children allocation
        document.getElementById('childrenAllocation').style.display = 'block';
        document.getElementById('childrenPercentageDisplay').textContent = childrenValue;
    } else {
        document.getElementById('childrenAllocation').style.display = 'none';
    }
    
    // Get charity percentages
    const charityCheckbox = document.getElementById('primaryCharity');
    if (charityCheckbox && charityCheckbox.checked) {
        const charityTotal = calculateCharityTotal();
        if (charityTotal > 0) {
            totalAllocated += charityTotal;
            allocations.charity = charityTotal;
            
            // Show charity allocation
            document.getElementById('charityAllocation').style.display = 'block';
            document.getElementById('charityPercentageDisplay').textContent = charityTotal;
        } else {
            document.getElementById('charityAllocation').style.display = 'none';
        }
    } else {
        document.getElementById('charityAllocation').style.display = 'none';
    }
    
    // Get other persons percentages
    const otherPersonsCheckbox = document.getElementById('primaryOtherPersons');
    if (otherPersonsCheckbox && otherPersonsCheckbox.checked) {
        const otherPersonsTotal = calculateOtherPersonsTotal();
        if (otherPersonsTotal > 0) {
            totalAllocated += otherPersonsTotal;
            allocations.otherPersons = otherPersonsTotal;
            
            // Show other persons allocation
            document.getElementById('otherPersonsAllocation').style.display = 'block';
            document.getElementById('otherPersonsPercentageDisplay').textContent = otherPersonsTotal;
        } else {
            document.getElementById('otherPersonsAllocation').style.display = 'none';
        }
    } else {
        document.getElementById('otherPersonsAllocation').style.display = 'none';
    }
    
    // Calculate and display remaining percentage
    const remaining = 100 - totalAllocated;
    const remainingSpan = document.getElementById('remainingPercentage');
    const validationMessage = document.getElementById('validationMessage');
    
    if (remainingSpan) {
        remainingSpan.textContent = remaining;
        
        // Color coding for remaining percentage
        if (remaining === 0) {
            remainingSpan.style.color = 'green';
            validationMessage.style.display = 'none';
        } else if (remaining > 0) {
            remainingSpan.style.color = 'orange';
            validationMessage.textContent = `You need to allocate the remaining ${remaining}%`;
            validationMessage.style.display = 'block';
        } else {
            remainingSpan.style.color = 'red';
            validationMessage.textContent = `You have over-allocated by ${Math.abs(remaining)}%. Total cannot exceed 100%.`;
            validationMessage.style.display = 'block';
        }
    }
}

function calculateCharityTotal() {
    let total = 0;
    const charityPercentages = document.querySelectorAll('input[name="charityPercentage[]"]');
    charityPercentages.forEach(input => {
        if (input.value) {
            total += parseInt(input.value) || 0;
        }
    });
    return total;
}

function calculateOtherPersonsTotal() {
    let total = 0;
    const otherPersonPercentages = document.querySelectorAll('input[name="otherPersonPercentage[]"]');
    otherPersonPercentages.forEach(input => {
        if (input.value) {
            total += parseInt(input.value) || 0;
        }
    });
    return total;
}

// Show primary charity details (use complex form for married users with no children)
function showPrimaryCharityDetails() {
    console.log('showPrimaryCharityDetails called!');
    const primaryCharityGroup = document.getElementById('primaryCharityDetailsGroup');
    const primaryOtherPersonsGroup = document.getElementById('otherPersonsDetailsGroup');
    
    if (primaryCharityGroup) {
        primaryCharityGroup.style.display = 'block';
        console.log('Primary charity section shown');
        
        // Target the charity list that exists in primaryBeneficiariesSection
        const charitiesList = document.getElementById('charitiesList');
        if (charitiesList) {
            charitiesList.style.display = 'block';
            console.log('Charities list shown');
        }
        
        // Only hide other persons if not in multi-selection mode
        const spousePartial = document.getElementById('primarySpousePartial');
        if (!spousePartial || !spousePartial.checked) {
            if (primaryOtherPersonsGroup) {
                primaryOtherPersonsGroup.style.display = 'none';
            }
        }
    }
    
    // Calculate percentages if in multi-selection mode
    calculateRemainingPercentage();
    updateAlternativeOptions();
}

// Show primary other persons details (use complex form for married users with no children)
function showPrimaryOtherPersonsDetails() {
    console.log('showPrimaryOtherPersonsDetails called!');
    const primaryOtherPersonsGroup = document.getElementById('otherPersonsDetailsGroup');
    const primaryCharityGroup = document.getElementById('primaryCharityDetailsGroup');
    
    if (primaryOtherPersonsGroup) {
        primaryOtherPersonsGroup.style.display = 'block';
        console.log('Primary other persons section shown');
        
        // Target the other persons list that exists in primaryBeneficiariesSection
        const otherPersonsList = document.getElementById('otherPersonsList');
        if (otherPersonsList) {
            otherPersonsList.style.display = 'block';
            console.log('Other persons list shown');
        }
        
        // Only hide charity if not in multi-selection mode
        const spousePartial = document.getElementById('primarySpousePartial');
        if (!spousePartial || !spousePartial.checked) {
            if (primaryCharityGroup) {
                primaryCharityGroup.style.display = 'none';
            }
        }
    }
    
    // Calculate percentages if in multi-selection mode
    calculateRemainingPercentage();
    updateAlternativeOptions();
}

// Hide charity and person sections when other options are selected
function hidePrimaryCharityAndPersonSections() {
    const primaryCharityGroup = document.getElementById('primaryCharityDetailsGroup');
    const primaryOtherPersonsGroup = document.getElementById('otherPersonsDetailsGroup');
    
    if (primaryCharityGroup) {
        primaryCharityGroup.style.display = 'none';
    }
    if (primaryOtherPersonsGroup) {
        primaryOtherPersonsGroup.style.display = 'none';
    }
}

function hideAlternativeCharityAndPersonSections() {
    const altCharityGroup = document.getElementById('alternativeCharityDetailsGroup');
    const altOtherPersonsGroup = document.getElementById('alternativeOtherPersonsDetailsGroup');
    
    if (altCharityGroup) {
        altCharityGroup.style.display = 'none';
    }
    if (altOtherPersonsGroup) {
        altOtherPersonsGroup.style.display = 'none';
    }
}

// Toggle primary spouse percentage input
function togglePrimarySpouseOptions() {
    const spousePartial = document.getElementById('primarySpousePartial');
    const percentageGroup = document.getElementById('primarySpousePercentageGroup');
    
    if (spousePartial && spousePartial.checked) {
        percentageGroup.style.display = 'block';
    } else {
        percentageGroup.style.display = 'none';
    }
}

// Add charity functions (following gifts.js pattern)
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
            <label for="charity${charityCount}Percentage">Percentage of Remaining Estate *</label>
            <input type="number" id="charity${charityCount}Percentage" name="charity
             <div class="form-group">
           <label for="charity${charityCount}Percentage">Percentage of Remaining Estate *</label>
           <input type="number" id="charity${charityCount}Percentage" name="charityPercentage[]" min="1" max="100" placeholder="50" step="1" onchange="calculateRemainingPercentage()">
           <span>%</span>
       </div>
       <button type="button" class="remove-btn" onclick="removeCharity(this)">Remove This Charity</button>
   `;
   charitiesList.appendChild(newCharityEntry);
   calculateRemainingPercentage();
}

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
           <label for="otherPerson${otherPersonCount}Percentage">Percentage of Remaining Estate *</label>
           <input type="number" id="otherPerson${otherPersonCount}Percentage" name="otherPersonPercentage[]" min="1" max="100" placeholder="50" step="1" onchange="calculateRemainingPercentage()">
           <span>%</span>
       </div>
       <button type="button" class="remove-btn" onclick="removeOtherPerson(this)">Remove This Person</button>
   `;
   otherPersonsList.appendChild(newPersonEntry);
   calculateRemainingPercentage();
}

// Alternative charity and person functions
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
           <input type="number" id="altCharity${altCharityCount}Percentage" name="altCharityPercentage[]" min="1" max="100" placeholder="50" step="1">
           <span>%</span>
       </div>
       <button type="button" class="remove-btn" onclick="removeAlternativeCharity(this)">Remove This Charity</button>
   `;
   charitiesList.appendChild(newCharityEntry);
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
           <label for="altOtherPerson${altOtherPersonCount}Percentage">Percentage of Remaining Estate *</label>
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

// Remove functions
function removeCharity(button) {
   button.parentElement.remove();
   calculateRemainingPercentage();
}

function removeOtherPerson(button) {
   button.parentElement.remove();
   calculateRemainingPercentage();
}

function removeAlternativeCharity(button) {
   button.parentElement.remove();
}

function removeAlternativeOtherPerson(button) {
   button.parentElement.remove();
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

// Update alternative options based on primary selection
function updateAlternativeOptions() {
   const primarySelection = document.querySelector('input[name="primaryBeneficiaries"]:checked')?.value;
   const altSection = document.getElementById('alternativeBeneficiariesSection');
   
   const urlParams = new URLSearchParams(window.location.search);
   const maritalStatus = urlParams.get('maritalStatus');
   const hasChildren = urlParams.get('hasChildren');
   
   if (maritalStatus === 'single' && hasChildren === 'no' && primarySelection) {
       altSection.style.display = 'block';
       
       const altParents = document.getElementById('altParentsOption');
       const altSiblings = document.getElementById('altSiblingsOption');
       const altCharity = document.getElementById('altCharityOption');
       const altOtherPersons = document.getElementById('altOtherPersonsOption');
       
       // Reset all options to visible first
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
}

// Summary and validation functions
function updateDistributionSummary() {
   const summarySection = document.getElementById('distributionSummary');
   const summaryContent = document.getElementById('summaryContent');
   
   const spouseAll = document.getElementById('primarySpouseAll')?.checked;
   const spousePartial = document.getElementById('primarySpousePartial')?.checked;
   const spousePercentage = document.getElementById('primarySpousePercentage')?.value;
   const alternativeBeneficiaries = document.querySelector('input[name="alternativeBeneficiaries"]:checked')?.value;
   
   let summaryHTML = '<h4>Your Estate Distribution Plan:</h4>';
   
   if (spouseAll) {
       summaryHTML += '<p><strong>Spouse:</strong> 100% of remaining estate</p>';
   } else if (spousePartial && spousePercentage) {
      summaryHTML += `<p><strong>Spouse:</strong> ${spousePercentage}% of remaining estate</p>`;
       
       // Add other allocations if any
       const childrenPercentage = document.getElementById('childrenPercentage')?.value;
       if (childrenPercentage) {
           summaryHTML += `<p><strong>Children:</strong> ${childrenPercentage}% of remaining estate</p>`;
       }
       
       const charityTotal = calculateCharityTotal();
       if (charityTotal > 0) {
           summaryHTML += `<p><strong>Charities:</strong> ${charityTotal}% of remaining estate</p>`;
       }
       
       const otherPersonsTotal = calculateOtherPersonsTotal();
       if (otherPersonsTotal > 0) {
           summaryHTML += `<p><strong>Other Persons:</strong> ${otherPersonsTotal}% of remaining estate</p>`;
       }
   }
   
   if (alternativeBeneficiaries) {
       summaryHTML += `<p><strong>If primary beneficiaries cannot inherit:</strong> ${getAlternativeBeneficiaryText(alternativeBeneficiaries)}</p>`;
   }
   
   summaryContent.innerHTML = summaryHTML;
   summarySection.style.display = 'block';
}

function getAlternativeBeneficiaryText(value) {
   switch(value) {
       case 'parents': return 'Parents (or surviving parent)';
       case 'siblings': return 'Siblings equally';
       case 'charity': return 'Charitable organization';
       case 'otherPersons': return 'Other persons as specified';
       default: return '';
   }
}

function validateForm() {
   const errors = [];
   
   // Check if partial spouse allocation adds up to 100%
   const spousePartial = document.getElementById('primarySpousePartial');
   if (spousePartial && spousePartial.checked) {
       const remaining = 100 - calculateTotalAllocation();
       if (remaining !== 0) {
           errors.push(`Estate allocation must equal 100%. Currently ${remaining}% ${remaining > 0 ? 'unallocated' : 'over-allocated'}.`);
       }
   }
   
   // Check alternative beneficiaries
   const alternativeBeneficiaries = document.querySelector('input[name="alternativeBeneficiaries"]:checked');
   if (!alternativeBeneficiaries) {
       errors.push('Please select alternative beneficiaries');
   }
   
   return { isValid: errors.length === 0, errors };
}

function calculateTotalAllocation() {
   let total = 0;
   
   // Spouse percentage
   const spousePercentage = document.getElementById('primarySpousePercentage');
   if (spousePercentage && spousePercentage.value) {
       total += parseInt(spousePercentage.value) || 0;
   }
   
   // Children percentage
   const childrenPercentage = document.getElementById('childrenPercentage');
   if (childrenPercentage && childrenPercentage.value) {
       total += parseInt(childrenPercentage.value) || 0;
   }
   
   // Charity total
   total += calculateCharityTotal();
   
   // Other persons total
   total += calculateOtherPersonsTotal();
   
   return total;
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
   
   const altCharityNames = formData.getAll('altCharityName[]').filter(name => name.trim());
   const altCharityPercentages = formData.getAll('altCharityPercentage[]').filter(pct => pct.trim());
   
   const altOtherPersonNames = formData.getAll('altOtherPersonName[]').filter(name => name.trim());
   const altOtherPersonPercentages = formData.getAll('altOtherPersonPercentage[]').filter(pct => pct.trim());
   const altOtherPersonAlternates = formData.getAll('altOtherPersonAlternate[]');
   
   // Build arrays
   data.charities = charityNames.map((name, index) => ({
       name: name,
       percentage: parseInt(charityPercentages[index]) || 0
   }));
   
   data.otherPersons = otherPersonNames.map((name, index) => ({
       name: name,
       percentage: parseInt(otherPersonPercentages[index]) || 0
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

// Counter variables for dynamic entries
let specificGiftCount = 1;
let charitableGiftCount = 1;

// Toggle retirement gift option based on spouse having retirement accounts
function toggleRetirementGiftOption() {
   const hasRetirement = document.querySelector('input[name="spouseHasRetirementPre"]:checked')?.value;
   const retirementOption = document.getElementById('spouseRetirementGiftOption');
   
   console.log('toggleRetirementGiftOption called, hasRetirement:', hasRetirement);
   
   if (retirementOption) {
      if (hasRetirement === 'yes') {
    retirementOption.style.display = 'block';
    retirementOption.style.visibility = 'visible';
    retirementOption.classList.remove('hidden');
    retirementOption.removeAttribute('hidden');
    console.log('Aggressively showing retirement option');
       } else {
           retirementOption.style.display = 'none';
           console.log('Hiding retirement option');
           
           // Safely uncheck the retirement gift option if it exists
           const retirementCheckbox = document.getElementById('spouseRetirementGift');
           if (retirementCheckbox) {
               retirementCheckbox.checked = false;
           }
           
           // Safely hide the retirement section if it exists
           const retirementSection = document.getElementById('spouseRetirementSection');
           if (retirementSection) {
               retirementSection.classList.add('hidden');
           }
       }
   } else {
       console.log('retirementOption element not found');
   }
}

// Handle "no specific gifts" option
function toggleNoGifts() {
   const noGifts = document.getElementById('noSpecificGifts').checked;
   
   if (noGifts) {
       // Uncheck all other gift options
       document.querySelectorAll('input[name="giftTypes"]:not(#noSpecificGifts)').forEach(checkbox => {
           checkbox.checked = false;
       });
       // Hide all gift sections
       document.getElementById('spouseRetirementSection').classList.add('hidden');
       document.getElementById('priorChildrenTrustSection').classList.add('hidden');
       document.getElementById('specificPersonGiftsSection').classList.add('hidden');
       document.getElementById('charitableGiftsSection').classList.add('hidden');
   }
}

// Toggle gift sections based on checkboxes
function toggleGiftSections() {
   // If "no gifts" is checked, don't show any sections
   if (document.getElementById('noSpecificGifts').checked) {
       return;
   }
   
   const spouseRetirement = document.getElementById('spouseRetirementGift').checked;
   const priorChildrenTrust = document.getElementById('priorChildrenTrust').checked;
   const specificPersonGifts = document.getElementById('specificPersonGifts').checked;
   const charitableGifts = document.getElementById('charitableGifts').checked;
   
   // Show/hide sections based on selections
   document.getElementById('spouseRetirementSection').classList.toggle('hidden', !spouseRetirement);
   document.getElementById('priorChildrenTrustSection').classList.toggle('hidden', !priorChildrenTrust);
   document.getElementById('specificPersonGiftsSection').classList.toggle('hidden', !specificPersonGifts);
   document.getElementById('charitableGiftsSection').classList.toggle('hidden', !charitableGifts);
   
   // If specific gifts is checked, make sure the gift list is visible
   if (specificPersonGifts) {
       document.getElementById('specificGiftsList').style.display = 'block';
   }
   
   // If charitable gifts is checked, make sure the gift list is visible
   if (charitableGifts) {
       document.getElementById('charitableGiftsList').style.display = 'block';
   }
}

// Add another specific gift entry
function addSpecificGift() {
   specificGiftCount++;
   const giftsList = document.getElementById('specificGiftsList');
   
   // Check if user is married to determine if survival condition should be shown
   const urlParams = new URLSearchParams(window.location.search);
   const maritalStatus = urlParams.get('maritalStatus');
   const isMarried = maritalStatus === 'married';
   const survivalConditionClass = isMarried ? '' : 'hidden';
   
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
       <div class="form-group ${survivalConditionClass}" id="giftSurvivalCondition${specificGiftCount}">
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
   
   // Check if user is married to determine if survival condition should be shown
   const urlParams = new URLSearchParams(window.location.search);
   const maritalStatus = urlParams.get('maritalStatus');
   const isMarried = maritalStatus === 'married';
   const survivalConditionClass = isMarried ? '' : 'hidden';
   
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
       <div class="form-group ${survivalConditionClass}" id="charitySurvivalCondition${charitableGiftCount}">
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

// Form validation function
function validateGiftsForm() {
   const selectedGiftTypes = Array.from(document.querySelectorAll('input[name="giftTypes"]:checked')).map(cb => cb.value);
   const errors = [];
   
   // If no gifts selected, that's valid
   if (selectedGiftTypes.length === 0 || selectedGiftTypes.includes('none')) {
       return { isValid: true, errors: [] };
   }
   
   // Validate spouse retirement gift
   if (selectedGiftTypes.includes('spouseRetirement')) {
       const hasRetirement = document.querySelector('input[name="spouseHasRetirementPre"]:checked');
       if (!hasRetirement) {
           errors.push('Please indicate if your spouse has retirement accounts');
       }
   }
   
   // Validate prior children trust
   if (selectedGiftTypes.includes('priorChildrenTrust')) {
       const priorChildrenNames = document.getElementById('priorChildrenNames').value.trim();
       const trustAmount = document.getElementById('trustAmount').value.trim();
       const trustName = document.getElementById('trustName').value.trim();
       const lifeInsuranceFunding = document.querySelector('input[name="lifeInsuranceFunding"]:checked');
       
       if (!priorChildrenNames) errors.push('Prior children names are required');
       if (!trustAmount) errors.push('Trust amount is required');
       if (!trustName) errors.push('Trust name is required');
       if (!lifeInsuranceFunding) errors.push('Life insurance funding selection is required');
   }
   
   // Validate specific gifts
   if (selectedGiftTypes.includes('specificPersonGifts')) {
       const specificGiftDescriptions = document.querySelectorAll('input[name="specificGiftDescription[]"]');
       let hasValidGift = false;
       
       specificGiftDescriptions.forEach((desc, index) => {
           const recipient = document.querySelector(`input[name="specificGiftRecipient[]"]:nth-of-type(${index + 1})`);
           if (desc.value.trim() && recipient && recipient.value.trim()) {
               hasValidGift = true;
           }
       });
       
       if (!hasValidGift) {
           errors.push('At least one complete specific gift is required (description and recipient)');
       }
   }
   
   // Validate charitable gifts
   if (selectedGiftTypes.includes('charitableGifts')) {
       const charitableGiftDescriptions = document.querySelectorAll('input[name="charitableGiftDescription[]"]');
       let hasValidGift = false;
       
       charitableGiftDescriptions.forEach((desc, index) => {
           const recipient = document.querySelector(`input[name="charitableGiftRecipient[]"]:nth-of-type(${index + 1})`);
           if (desc.value.trim() && recipient && recipient.value.trim()) {
               hasValidGift = true;
           }
       });
       
       if (!hasValidGift) {
           errors.push('At least one complete charitable gift is required (description and recipient)');
       }
   }
   
   return { isValid: errors.length === 0, errors };
}

// FIXED Form submission
document.getElementById('giftsForm').addEventListener('submit', async function(e) {
   e.preventDefault();
   
   // Validate form before processing
   const validation = validateGiftsForm();
   if (!validation.isValid) {
       const errorMessage = document.getElementById('errorMessage');
       const errorP = errorMessage.querySelector('p');
       errorP.textContent = 'Please fix the following issues:\n' + validation.errors.join('\n');
       errorMessage.style.display = 'block';
       errorMessage.scrollIntoView({ behavior: 'smooth' });
       return;
   }
   
   const selectedGiftTypes = Array.from(document.querySelectorAll('input[name="giftTypes"]:checked')).map(cb => cb.value);
   
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
   
   // FIXED: Build gift arrays with proper survival condition collection
   data.specificGifts = specificGiftDescriptions.map((desc, index) => {
       const giftNumber = index + 1;
       const survivalCondition = formData.get(`giftIfSpouseSurvives${giftNumber}`) || 'no';
       
       return {
           description: desc,
           recipient: specificGiftRecipients[index] || '',
           relationship: specificGiftRelationships[index] || '',
           survivalCondition: survivalCondition
       };
   });
   
   data.charitableGifts = charitableGiftDescriptions.map((desc, index) => {
       const giftNumber = index + 1;
       const survivalCondition = formData.get(`charityIfSpouseSurvives${giftNumber}`) || 'no';
       
       return {
           description: desc,
           recipient: charitableGiftRecipients[index] || '',
           survivalCondition: survivalCondition
       };
   });
   
   // Get selected gift types
   data.selectedGiftTypes = selectedGiftTypes;
   
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
       console.error('Gifts submission error:', error);
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
    const maritalStatus = urlParams.get('maritalStatus');
    const hasChildren = urlParams.get('hasChildren');
    const hasPriorChildren = urlParams.get('hasPriorChildren');
    
    // DEBUG: Check what parameters we're actually getting
    console.log('DEBUG - URL Parameters:');
    console.log('maritalStatus:', maritalStatus);
    console.log('hasPriorChildren:', hasPriorChildren);
    console.log('testatorName:', testatorName);
    console.log('email:', email); 
 // FORCE HIDE all spouse/marriage-related elements for single users
if (maritalStatus !== 'married') {
    console.log('DEBUG: Hiding spouse-related elements for non-married user');
    
    // CHECK if elements exist before hiding
    const spouseRetirementPreCheck = document.getElementById('spouseRetirementPreCheck');
    const spouseRetirementGiftOption = document.getElementById('spouseRetirementGiftOption');
    const priorChildrenTrustOption = document.getElementById('priorChildrenTrustOption');
    
    console.log('spouseRetirementPreCheck found:', !!spouseRetirementPreCheck);
    console.log('spouseRetirementGiftOption found:', !!spouseRetirementGiftOption);
    console.log('priorChildrenTrustOption found:', !!priorChildrenTrustOption);
    
    if (spouseRetirementPreCheck) spouseRetirementPreCheck.style.display = 'none';
    if (spouseRetirementGiftOption) spouseRetirementGiftOption.style.display = 'none';
    if (priorChildrenTrustOption) priorChildrenTrustOption.style.display = 'none';
}
   if (testatorName) {
       document.getElementById('testatorName').value = decodeURIComponent(testatorName);
   }
   if (email) {
       document.getElementById('clientEmail').value = decodeURIComponent(email);
   }
   
  // Show/hide prior children trust option - ONLY for married users with prior children
    if (maritalStatus === 'married' && hasPriorChildren === 'yes') {
        const priorChildrenOption = document.getElementById('priorChildrenTrustOption');
        if (priorChildrenOption) {
            priorChildrenOption.style.display = 'block';
        }
        
        // Auto-populate prior children trust information if available
        const priorChildrenNamesParam = urlParams.get('priorChildrenNames');
        if (priorChildrenNamesParam) {
            const priorChildrenNamesField = document.getElementById('priorChildrenNames');
            if (priorChildrenNamesField) {
                priorChildrenNamesField.value = decodeURIComponent(priorChildrenNamesParam);
            }
        }
    } else {
        // Hide prior children trust option for everyone else
        const priorChildrenOption = document.getElementById('priorChildrenTrustOption');
        if (priorChildrenOption) {
            priorChildrenOption.style.display = 'none';
        }
    }

    // Handle spouse-related sections ONLY for married users
    if (maritalStatus === 'married') {
        // Show the spouse retirement pre-check section
        const spouseRetirementPreCheck = document.getElementById('spouseRetirementPreCheck');
        if (spouseRetirementPreCheck) {
            spouseRetirementPreCheck.style.display = 'block';
        }
        
        // Auto-show survival condition fields since we know they're married
        document.querySelectorAll('[id^="giftSurvivalCondition"]').forEach(section => {
            section.classList.remove('hidden');
        });
        document.querySelectorAll('[id^="charitySurvivalCondition"]').forEach(section => {
            section.classList.remove('hidden');
        });
    } else {
        // Hide ALL spouse-related sections for non-married users
        const spouseRetirementPreCheck = document.getElementById('spouseRetirementPreCheck');
        if (spouseRetirementPreCheck) {
            spouseRetirementPreCheck.style.display = 'none';
        }
        
        // Hide spouse retirement gift option entirely
        const spouseRetirementGiftOption = document.getElementById('spouseRetirementGiftOption');
        if (spouseRetirementGiftOption) {
            spouseRetirementGiftOption.style.display = 'none';
        }
    }
   
  // Prevent Enter key submission in text fields
document.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
});

// FINAL FORCE HIDE - Run at the very end to override any other logic
if (maritalStatus !== 'married') {
    console.log('FINAL HIDE: Forcing spouse-related elements hidden for non-married user');
    
    // AGGRESSIVE HIDING - try multiple methods
    const elements = ['spouseRetirementPreCheck', 'spouseRetirementGiftOption', 'priorChildrenTrustOption'];
    
    elements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.classList.add('hidden');
            element.setAttribute('hidden', 'true');
            console.log(`Aggressively hid: ${elementId}`);
        }
    });
    
   // ALSO hide any parent containers that might contain these questions
    const giftTypeCheckboxes = document.querySelectorAll('input[name="giftTypes"]');
    giftTypeCheckboxes.forEach(checkbox => {
        if (checkbox.value === 'spouseRetirement' || checkbox.value === 'priorChildrenTrust') {
            const parentDiv = checkbox.closest('.checkbox-item');
            if (parentDiv) {
                parentDiv.style.display = 'none';
                console.log(`Hid parent container for: ${checkbox.value}`);
            }
        }
    });
}

// ADDITIONAL HIDING FOR MARRIED USERS
if (maritalStatus === 'married') {
    console.log('FINAL HIDE: Processing married user options');
    
    // Hide prior children trust if no prior children
    if (hasPriorChildren !== 'yes') {
        console.log('Should hide prior children trust - hasPriorChildren is:', hasPriorChildren);
        
        // Try multiple ways to find and hide prior children elements
        const priorChildrenOption = document.getElementById('priorChildrenTrustOption');
        console.log('priorChildrenOption found:', !!priorChildrenOption);
        if (priorChildrenOption) {
            priorChildrenOption.style.display = 'none';
            priorChildrenOption.style.visibility = 'hidden';
            priorChildrenOption.classList.add('hidden');
            console.log('Aggressively hid priorChildrenTrustOption');
        }
        
        // Find and hide the checkbox
        const priorChildrenCheckbox = document.querySelector('input[value="priorChildrenTrust"]');
        console.log('priorChildrenCheckbox found:', !!priorChildrenCheckbox);
        if (priorChildrenCheckbox) {
            const parentDiv = priorChildrenCheckbox.closest('.checkbox-item');
            console.log('parentDiv found:', !!parentDiv);
            if (parentDiv) {
                parentDiv.style.display = 'none';
                parentDiv.style.visibility = 'hidden';
                parentDiv.classList.add('hidden');
                console.log('Aggressively hid prior children checkbox container');
            }
        }
        
        // Also try to find by text content
        const allCheckboxItems = document.querySelectorAll('.checkbox-item');
        allCheckboxItems.forEach((item, index) => {
            if (item.textContent.includes('Trust for My Child/Children from a Prior Relationship')) {
                item.style.display = 'none';
                console.log(`Hid checkbox item ${index} by text content`);
            }
        });
    }
// ALWAYS hide spouse retirement gift by default for married users
    console.log('Hiding spouse retirement gift by default');
    const spouseRetirementGiftOption = document.getElementById('spouseRetirementGiftOption');
    if (spouseRetirementGiftOption) {
        spouseRetirementGiftOption.style.display = 'none';
        spouseRetirementGiftOption.style.visibility = 'hidden';
        spouseRetirementGiftOption.classList.add('hidden');
        console.log('Aggressively hid spouse retirement gift option by default');
    }
    
    const spouseRetirementCheckbox = document.querySelector('input[value="spouseRetirement"]');
    if (spouseRetirementCheckbox) {
        const parentDiv = spouseRetirementCheckbox.closest('.checkbox-item');
        if (parentDiv) {
            parentDiv.style.display = 'none';
            console.log('Hid spouse retirement checkbox container by default');
        }
    }
}
});
   

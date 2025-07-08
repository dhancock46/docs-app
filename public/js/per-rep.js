// Global variables
let alternateExecutorCount = 1;
let currentUserData = {};

document.addEventListener('DOMContentLoaded', function() {
    // Auto-populate data from previous sections
    const urlParams = new URLSearchParams(window.location.search);
    const testatorName = urlParams.get('testatorName');
    const email = urlParams.get('email');
    
    // Store user data globally
    currentUserData = {
        testatorName,
        email
    };
    
    // Populate hidden fields
    if (testatorName) {
        document.getElementById('testatorName').value = decodeURIComponent(testatorName);
    }
    if (email) {
        document.getElementById('clientEmail').value = decodeURIComponent(email);
    }
    
    // Add event listeners
    document.addEventListener('change', updateExecutorSummary);
    
    // Prevent Enter key submission
    document.querySelectorAll('input[type="text"], textarea').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    });
});

// Toggle executor type (single vs co-executors)
function toggleExecutorType() {
    const executorType = document.querySelector('input[name="executorType"]:checked')?.value;
    const primaryGroup = document.getElementById('primaryExecutorGroup');
    const coExecutorGroup = document.getElementById('coExecutorGroup');
    const alternateGroup = document.getElementById('alternateExecutorsGroup');
    const bondSection = document.getElementById('bondWaiverSection');
    
    if (executorType === 'single') {
        primaryGroup.style.display = 'block';
        coExecutorGroup.style.display = 'none';
        alternateGroup.style.display = 'block';
        bondSection.style.display = 'block';
        
        // Clear co-executor fields
        document.getElementById('coExecutorName').value = '';
        document.getElementById('coExecutorRelationship').value = '';
        document.getElementById('coExecutorAddress').value = '';
    } else if (executorType === 'co') {
        primaryGroup.style.display = 'block';
        coExecutorGroup.style.display = 'block';
        alternateGroup.style.display = 'block';
        bondSection.style.display = 'block';
    } else {
        primaryGroup.style.display = 'none';
        coExecutorGroup.style.display = 'none';
        alternateGroup.style.display = 'none';
        bondSection.style.display = 'none';
    }
    
    updateExecutorSummary();
}

// Add another alternate executor
function addAlternateExecutor() {
    alternateExecutorCount++;
    const alternatesList = document.getElementById('alternateExecutorsList');
    
    const newExecutorEntry = document.createElement('div');
    newExecutorEntry.className = 'executor-entry';
    newExecutorEntry.innerHTML = `
        <h4>Alternate Executor #${alternateExecutorCount}</h4>
        <div class="form-group">
            <label for="executor${alternateExecutorCount + 1}Name">Full Name *</label>
            <input type="text" id="executor${alternateExecutorCount + 1}Name" name="executor${alternateExecutorCount + 1}Name" placeholder="Full legal name">
        </div>
        <div class="form-group">
            <label for="executor${alternateExecutorCount + 1}Relationship">Relationship to You *</label>
            <input type="text" id="executor${alternateExecutorCount + 1}Relationship" name="executor${alternateExecutorCount + 1}Relationship" placeholder="e.g., my sister, my friend, my attorney">
        </div>
        <div class="form-group">
            <label for="executor${alternateExecutorCount + 1}Address">Address *</label>
            <textarea id="executor${alternateExecutorCount + 1}Address" name="executor${alternateExecutorCount + 1}Address" rows="3" placeholder="Full address including city, state, ZIP"></textarea>
        </div>
        <button type="button" class="remove-btn" onclick="removeAlternateExecutor(this)">Remove This Executor</button>
    `;
    alternatesList.appendChild(newExecutorEntry);
}

// Remove alternate executor
function removeAlternateExecutor(button) {
    button.parentElement.remove();
    updateExecutorSummary();
}

// Update executor summary
function updateExecutorSummary() {
    const summarySection = document.getElementById('executorSummary');
    const summaryContent = document.getElementById('summaryContent');
    
    const executorType = document.querySelector('input[name="executorType"]:checked')?.value;
    const executor1Name = document.getElementById('executor1Name')?.value;
    const coExecutorName = document.getElementById('coExecutorName')?.value;
    const executor2Name = document.getElementById('executor2Name')?.value;
    const waiveBond = document.querySelector('input[name="waiveBond"]:checked')?.value;
    
    let summaryHTML = '<h4>Your Personal Representatives:</h4>';
    
    if (executorType === 'single' && executor1Name) {
        summaryHTML += `<p><strong>Primary Executor:</strong> ${executor1Name}</p>`;
        if (executor2Name) {
            summaryHTML += `<p><strong>First Alternate:</strong> ${executor2Name}</p>`;
        }
    } else if (executorType === 'co' && executor1Name && coExecutorName) {
        summaryHTML += `<p><strong>Co-Executors:</strong> ${executor1Name} and ${coExecutorName}</p>`;
        if (executor2Name) {
            summaryHTML += `<p><strong>First Alternate:</strong> ${executor2Name}</p>`;
        }
    }
    
    if (waiveBond) {
        summaryHTML += `<p><strong>Bond Requirement:</strong> ${waiveBond === 'yes' ? 'Waived' : 'Required'}</p>`;
    }
    
    summaryContent.innerHTML = summaryHTML;
    
    // Show summary if we have some executor information
    if (executorType && executor1Name) {
        summarySection.style.display = 'block';
    } else {
        summarySection.style.display = 'none';
    }
}

// Form validation
function validateForm() {
    const errors = [];
    
    // Check executor type selection
    const executorType = document.querySelector('input[name="executorType"]:checked');
    if (!executorType) {
        errors.push('Please select how many primary executors you want');
        return { isValid: false, errors };
    }
    
    // Check primary executor
    const executor1Name = document.getElementById('executor1Name').value.trim();
    const executor1Relationship = document.getElementById('executor1Relationship').value.trim();
    const executor1Address = document.getElementById('executor1Address').value.trim();
    
    if (!executor1Name) {
        errors.push('Please enter the primary executor\'s full name');
    }
    if (!executor1Relationship) {
        errors.push('Please enter the primary executor\'s relationship to you');
    }
    if (!executor1Address) {
        errors.push('Please enter the primary executor\'s address');
    }
    
    // Check co-executor if selected
    if (executorType.value === 'co') {
        const coExecutorName = document.getElementById('coExecutorName').value.trim();
        const coExecutorRelationship = document.getElementById('coExecutorRelationship').value.trim();
        const coExecutorAddress = document.getElementById('coExecutorAddress').value.trim();
        
        if (!coExecutorName) {
            errors.push('Please enter the co-executor\'s full name');
        }
        if (!coExecutorRelationship) {
            errors.push('Please enter the co-executor\'s relationship to you');
        }
        if (!coExecutorAddress) {
            errors.push('Please enter the co-executor\'s address');
        }
    }
    
    // Check first alternate executor
    const executor2Name = document.getElementById('executor2Name').value.trim();
    const executor2Relationship = document.getElementById('executor2Relationship').value.trim();
    const executor2Address = document.getElementById('executor2Address').value.trim();
    
    if (!executor2Name) {
        errors.push('Please enter the first alternate executor\'s full name');
    }
    if (!executor2Relationship) {
        errors.push('Please enter the first alternate executor\'s relationship to you');
    }
    if (!executor2Address) {
        errors.push('Please enter the first alternate executor\'s address');
    }
    
    // Check bond waiver
    const waiveBond = document.querySelector('input[name="waiveBond"]:checked');
    if (!waiveBond) {
        errors.push('Please select whether to waive the bond requirement');
    }
    
    return { isValid: errors.length === 0, errors };
}

// Form submission
document.getElementById('personalRepForm').addEventListener('submit', async function(e) {
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
    
    // Add document type and section
    data.documentType = 'will';
    data.section = 'personalRepresentatives';
    
    try {
        const response = await fetch('/submit', {
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
        console.error('Personal representatives submission error:', error);
        loadingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth' });
    }
});

function continueToReview() {
    const urlParams = new URLSearchParams(window.location.search);
    window.location.href = `final-review.html?${urlParams.toString()}`;
}

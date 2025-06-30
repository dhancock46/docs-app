// Form submission
document.getElementById('willForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
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
    
    // Handle arrays for children data
    const singleChildNames = formData.getAll('singleChildName[]').filter(name => name.trim());
    const singleChildBirthdays = formData.getAll('singleChildBirthday[]').filter(birthday => birthday.trim());
    const currentMarriageChildNames = formData.getAll('currentMarriageChildName[]').filter(name => name.trim());
    const currentMarriageChildBirthdays = formData.getAll('currentMarriageChildBirthday[]').filter(birthday => birthday.trim());
    const priorChildNames = formData.getAll('priorChildName[]').filter(name => name.trim());
    const priorChildBirthdays = formData.getAll('priorChildBirthday[]').filter(birthday => birthday.trim());
    const spousePriorChildNames = formData.getAll('spousePriorChildName[]').filter(name => name.trim());
    const spousePriorChildBirthdays = formData.getAll('spousePriorChildBirthday[]').filter(birthday => birthday.trim());
    
    // Build children arrays
    data.singleChildren = singleChildNames.map((name, index) => ({
        name: name,
        birthday: singleChildBirthdays[index] || ''
    }));
    
    data.currentMarriageChildren = currentMarriageChildNames.map((name, index) => ({
        name: name,
        birthday: currentMarriageChildBirthdays[index] || ''
    }));
    
    data.priorChildren = priorChildNames.map((name, index) => ({
        name: name,
        birthday: priorChildBirthdays[index] || ''
    }));
    
    data.spousePriorChildren = spousePriorChildNames.map((name, index) => ({
        name: name,
        birthday: spousePriorChildBirthdays[index] || ''
    }));
    
    // Add document type
    data.documentType = 'will';
    data.section = 'personal-info';
    
    try {
        const response = await fetch('/submit/will', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        loadingMessage.style.display = 'none';
        
        if (result.success) {
            // Redirect to gifts section with user data
            const testatorName = encodeURIComponent(data.testatorName);
            const email = encodeURIComponent(data.clientEmail);
            window.location.href = `gifts.html?testatorName=${testatorName}&email=${email}`;
        } else {
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error:', error);
        loadingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth' });
    }
});

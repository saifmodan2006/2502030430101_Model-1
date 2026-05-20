// Form submission handler
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate form
    if (validateForm()) {
        // Collect form data
        const formData = collectFormData();
        
        // Read PDF file and convert to base64
        const pdfFile = document.getElementById('resumePdf').files[0];
        if (pdfFile) {
            await readPdfFile(pdfFile, formData);
        }
        
        // Save to localStorage
        saveToLocalStorage(formData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('registrationForm').style.display = 'none';
    }
});

// Read PDF file and convert to base64
function readPdfFile(file, formData) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            formData.personal.resumeFile.base64 = e.target.result;
            resolve();
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

// Collect form data
function collectFormData() {
    return {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        
        // Personal Information
        personal: {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            location: document.getElementById('location').value,
            bio: document.getElementById('bio').value,
            resumeFile: {
                name: document.getElementById('resumePdf').files[0]?.name || '',
                size: document.getElementById('resumePdf').files[0]?.size || 0,
                type: document.getElementById('resumePdf').files[0]?.type || '',
                base64: '' // Will be filled asynchronously
            }
        },
        
        // Education Information
        education: {
            educationLevel: document.getElementById('educationLevel').value,
            fieldOfStudy: document.getElementById('fieldOfStudy').value,
            institute: document.getElementById('institute').value,
            graduationYear: document.getElementById('graduationYear').value,
            certifications: document.getElementById('certifications').value
        },
        
        // Occupation Information
        occupation: {
            jobTitle: document.getElementById('jobTitle').value,
            company: document.getElementById('company').value,
            industry: document.getElementById('industry').value,
            yearsExperience: document.getElementById('yearsExperience').value,
            employmentType: document.querySelector('input[name="employmentType"]:checked').value,
            workExperience: document.getElementById('workExperience').value
        },
        
        // Social & Professional Profiles
        profiles: {
            linkedin: document.getElementById('linkedIn').value,
            github: document.getElementById('github').value,
            portfolio: document.getElementById('portfolio').value,
            twitter: document.getElementById('twitter').value
        },
        
        // Agreements
        agreements: {
            termsAndConditions: document.getElementById('termsAgree').checked,
            privacyPolicy: document.getElementById('privacyAgree').checked,
            marketingCommunications: document.getElementById('marketingAgree').checked
        }
    };
}

// Generate unique ID
function generateUniqueId() {
    return 'REG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Validate entire form
function validateForm() {
    let isValid = true;
    const errors = {};
    
    // Personal Information Validation
    if (!validateFullName()) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!validatePhone()) isValid = false;
    if (!validatePassword()) isValid = false;
    if (!validateConfirmPassword()) isValid = false;
    if (!validateDOB()) isValid = false;
    if (!validateSelect('gender', 'genderError', 'Gender')) isValid = false;
    if (!validateLocation()) isValid = false;
    
    // File Upload Validation
    if (!validateResumePdf()) isValid = false;
    
    // Education Validation
    if (!validateSelect('educationLevel', 'educationLevelError', 'Education Level')) isValid = false;
    if (!validateSelect('fieldOfStudy', 'fieldOfStudyError', 'Field of Study')) isValid = false;
    if (!validateInstitute()) isValid = false;
    if (!validateGraduationYear()) isValid = false;
    
    // Occupation Validation
    if (!validateJobTitle()) isValid = false;
    if (!validateCompany()) isValid = false;
    if (!validateSelect('industry', 'industryError', 'Industry')) isValid = false;
    if (!validateSelect('yearsExperience', 'yearsExperienceError', 'Years of Experience')) isValid = false;
    if (!validateEmploymentType()) isValid = false;
    
    // Social Profiles Validation
    if (!validateLinkedIn()) isValid = false;
    if (!validateGitHub()) isValid = false;
    if (!validatePortfolio()) isValid = false;
    if (!validateTwitter()) isValid = false;
    
    // Agreements Validation
    if (!validateTermsAgree()) isValid = false;
    if (!validatePrivacyAgree()) isValid = false;
    
    return isValid;
}

// Validation Functions
function validateFullName() {
    const fullName = document.getElementById('fullName').value.trim();
    const error = document.getElementById('fullNameError');
    
    if (!fullName) {
        error.textContent = 'Full name is required';
        return false;
    }
    if (fullName.length < 3) {
        error.textContent = 'Full name must be at least 3 characters';
        return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(fullName)) {
        error.textContent = 'Full name can only contain letters, spaces, hyphens, and apostrophes';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateEmail() {
    const email = document.getElementById('email').value.trim();
    const error = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        error.textContent = 'Email is required';
        return false;
    }
    if (!emailRegex.test(email)) {
        error.textContent = 'Please enter a valid email address';
        return false;
    }
    error.textContent = '';
    return true;
}

function validatePhone() {
    const phone = document.getElementById('phone').value.trim();
    const error = document.getElementById('phoneError');
    const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
    
    if (!phone) {
        error.textContent = 'Phone number is required';
        return false;
    }
    if (!phoneRegex.test(phone)) {
        error.textContent = 'Please enter a valid phone number';
        return false;
    }
    error.textContent = '';
    return true;
}

function validatePassword() {
    const password = document.getElementById('password').value;
    const error = document.getElementById('passwordError');
    
    if (!password) {
        error.textContent = 'Password is required';
        return false;
    }
    if (password.length < 8) {
        error.textContent = 'Password must be at least 8 characters';
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        error.textContent = 'Password must contain at least one uppercase letter';
        return false;
    }
    if (!/[a-z]/.test(password)) {
        error.textContent = 'Password must contain at least one lowercase letter';
        return false;
    }
    if (!/[0-9]/.test(password)) {
        error.textContent = 'Password must contain at least one number';
        return false;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        error.textContent = 'Password must contain at least one special character (!@#$%^&*, etc.)';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateConfirmPassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const error = document.getElementById('confirmPasswordError');
    
    if (!confirmPassword) {
        error.textContent = 'Please confirm your password';
        return false;
    }
    if (password !== confirmPassword) {
        error.textContent = 'Passwords do not match';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateDOB() {
    const dob = document.getElementById('dob').value;
    const error = document.getElementById('dobError');
    
    if (!dob) {
        error.textContent = 'Date of birth is required';
        return false;
    }
    
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age < 13) {
        error.textContent = 'You must be at least 13 years old';
        return false;
    }
    if (age > 120) {
        error.textContent = 'Please enter a valid date of birth';
        return false;
    }
    
    error.textContent = '';
    return true;
}

function validateLocation() {
    const location = document.getElementById('location').value.trim();
    const error = document.getElementById('locationError');
    
    if (!location) {
        error.textContent = 'Location is required';
        return false;
    }
    if (location.length < 2) {
        error.textContent = 'Please enter a valid location';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateResumePdf() {
    const fileInput = document.getElementById('resumePdf');
    const file = fileInput.files[0];
    const error = document.getElementById('resumePdfError');
    
    if (!file) {
        error.textContent = 'PDF file is required';
        return false;
    }
    
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
        error.textContent = 'Only PDF files are accepted';
        return false;
    }
    
    // Check file size (5MB = 5242880 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        error.textContent = 'File size must be less than 5MB';
        return false;
    }
    
    error.textContent = '';
    return true;
}

function validateInstitute() {
    const institute = document.getElementById('institute').value.trim();
    const error = document.getElementById('instituteError');
    
    if (!institute) {
        error.textContent = 'Institute/University is required';
        return false;
    }
    if (institute.length < 2) {
        error.textContent = 'Please enter a valid institute name';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateGraduationYear() {
    const year = document.getElementById('graduationYear').value;
    const error = document.getElementById('graduationYearError');
    
    if (!year) {
        error.textContent = 'Graduation year is required';
        return false;
    }
    
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    
    if (yearNum < 1980 || yearNum > currentYear + 10) {
        error.textContent = 'Please enter a valid graduation year';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateJobTitle() {
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const error = document.getElementById('jobTitleError');
    
    if (!jobTitle) {
        error.textContent = 'Job title is required';
        return false;
    }
    if (jobTitle.length < 2) {
        error.textContent = 'Please enter a valid job title';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateCompany() {
    const company = document.getElementById('company').value.trim();
    const error = document.getElementById('companyError');
    
    if (!company) {
        error.textContent = 'Company name is required';
        return false;
    }
    if (company.length < 2) {
        error.textContent = 'Please enter a valid company name';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateEmploymentType() {
    const selected = document.querySelector('input[name="employmentType"]:checked');
    const error = document.getElementById('employmentTypeError');
    
    if (!selected) {
        error.textContent = 'Employment type is required';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateLinkedIn() {
    const linkedin = document.getElementById('linkedIn').value.trim();
    const error = document.getElementById('linkedInError');
    
    if (linkedin && !isValidUrl(linkedin)) {
        error.textContent = 'Please enter a valid LinkedIn URL';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateGitHub() {
    const github = document.getElementById('github').value.trim();
    const error = document.getElementById('githubError');
    
    if (github && !isValidUrl(github)) {
        error.textContent = 'Please enter a valid GitHub URL';
        return false;
    }
    error.textContent = '';
    return true;
}

function validatePortfolio() {
    const portfolio = document.getElementById('portfolio').value.trim();
    const error = document.getElementById('portfolioError');
    
    if (portfolio && !isValidUrl(portfolio)) {
        error.textContent = 'Please enter a valid portfolio URL';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateTwitter() {
    const twitter = document.getElementById('twitter').value.trim();
    const error = document.getElementById('twitterError');
    
    if (twitter && !isValidUrl(twitter)) {
        error.textContent = 'Please enter a valid Twitter URL';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateTermsAgree() {
    const termsAgree = document.getElementById('termsAgree').checked;
    const error = document.getElementById('termsAgreeError');
    
    if (!termsAgree) {
        error.textContent = 'You must agree to Terms & Conditions';
        return false;
    }
    error.textContent = '';
    return true;
}

function validatePrivacyAgree() {
    const privacyAgree = document.getElementById('privacyAgree').checked;
    const error = document.getElementById('privacyAgreeError');
    
    if (!privacyAgree) {
        error.textContent = 'You must agree to Privacy Policy';
        return false;
    }
    error.textContent = '';
    return true;
}

function validateSelect(selectId, errorId, fieldName) {
    const value = document.getElementById(selectId).value;
    const error = document.getElementById(errorId);
    
    if (!value) {
        error.textContent = `${fieldName} is required`;
        return false;
    }
    error.textContent = '';
    return true;
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Local Storage Functions
function saveToLocalStorage(formData) {
    let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    registrations.push(formData);
    localStorage.setItem('registrations', JSON.stringify(registrations));
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem('registrations')) || [];
}

// Display Success Message
function showSuccessMessage() {
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    displayRegistrations();
}

// Display all registrations
function displayRegistrations() {
    const registrations = getFromLocalStorage();
    const dataListSection = document.getElementById('dataListSection');
    const dataList = document.getElementById('dataList');
    
    if (registrations.length === 0) {
        dataListSection.style.display = 'none';
        return;
    }
    
    dataListSection.style.display = 'block';
    dataList.innerHTML = '';
    
    registrations.forEach((reg, index) => {
        const item = document.createElement('div');
        item.className = 'data-item';
        const resumeFile = reg.personal.resumeFile;
        const fileInfo = resumeFile.name ? `📄 ${resumeFile.name}` : 'No file';
        item.innerHTML = `
            <h3>Registration #${registrations.length - index}</h3>
            <p><strong>Name:</strong> ${reg.personal.fullName}</p>
            <p><strong>Email:</strong> ${reg.personal.email}</p>
            <p><strong>Job Title:</strong> ${reg.occupation.jobTitle}</p>
            <p><strong>Company:</strong> ${reg.occupation.company}</p>
            <p><strong>Resume:</strong> ${fileInfo}</p>
            <p><strong>Registered:</strong> ${new Date(reg.timestamp).toLocaleString()}</p>
            <button onclick="viewSingleRegistration('${reg.id}')" class="btn btn-secondary" style="margin-top: 10px;">View Details</button>
        `;
        dataList.appendChild(item);
    });
}

// Download JSON file
function downloadJSON() {
    const registrations = getFromLocalStorage();
    const dataStr = JSON.stringify(registrations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registrations_${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// View JSON
function viewJSON() {
    const registrations = getFromLocalStorage();
    const jsonContent = document.getElementById('jsonContent');
    jsonContent.textContent = JSON.stringify(registrations, null, 2);
    document.getElementById('jsonModal').style.display = 'block';
}

// View single registration
function viewSingleRegistration(id) {
    const registrations = getFromLocalStorage();
    const registration = registrations.find(r => r.id === id);
    if (registration) {
        const jsonContent = document.getElementById('jsonContent');
        jsonContent.textContent = JSON.stringify(registration, null, 2);
        
        // Update modal footer with download option if PDF exists
        const modal = document.getElementById('jsonModal');
        const footer = modal.querySelector('.modal-footer');
        if (footer) {
            footer.remove();
        }
        
        if (registration.personal.resumeFile.base64) {
            const newFooter = document.createElement('div');
            newFooter.className = 'modal-footer';
            newFooter.innerHTML = `
                <button onclick="copyToClipboard()" class="btn btn-primary">Copy JSON</button>
                <button onclick="downloadPdfFromRegistration('${registration.id}')" class="btn btn-secondary">Download PDF</button>
            `;
            modal.querySelector('.modal-content').appendChild(newFooter);
        }
        
        document.getElementById('jsonModal').style.display = 'block';
    }
}

// Copy to clipboard
function copyToClipboard() {
    const jsonContent = document.getElementById('jsonContent');
    const text = jsonContent.textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('JSON copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy to clipboard');
    });
}

// Download PDF from registration
function downloadPdfFromRegistration(registrationId) {
    const registrations = getFromLocalStorage();
    const registration = registrations.find(r => r.id === registrationId);
    
    if (registration && registration.personal.resumeFile.base64) {
        const link = document.createElement('a');
        link.href = registration.personal.resumeFile.base64;
        link.download = registration.personal.resumeFile.name || 'resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('No PDF file found for this registration');
    }
}

// Close modal
function closeModal() {
    document.getElementById('jsonModal').style.display = 'none';
}

// New registration
function newRegistration() {
    document.getElementById('registrationForm').reset();
    document.getElementById('registrationForm').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('dataListSection').style.display = 'none';
    window.scrollTo(0, 0);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('jsonModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Real-time validation
document.getElementById('fullName').addEventListener('blur', validateFullName);
document.getElementById('email').addEventListener('blur', validateEmail);
document.getElementById('phone').addEventListener('blur', validatePhone);
document.getElementById('password').addEventListener('blur', validatePassword);
document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);
document.getElementById('dob').addEventListener('blur', validateDOB);
document.getElementById('location').addEventListener('blur', validateLocation);
document.getElementById('institute').addEventListener('blur', validateInstitute);
document.getElementById('graduationYear').addEventListener('blur', validateGraduationYear);
document.getElementById('jobTitle').addEventListener('blur', validateJobTitle);
document.getElementById('company').addEventListener('blur', validateCompany);
document.getElementById('linkedIn').addEventListener('blur', validateLinkedIn);
document.getElementById('github').addEventListener('blur', validateGitHub);
document.getElementById('portfolio').addEventListener('blur', validatePortfolio);
document.getElementById('twitter').addEventListener('blur', validateTwitter);

// File input change event
document.getElementById('resumePdf').addEventListener('change', function() {
    const file = this.files[0];
    const fileNameDisplay = document.getElementById('fileName');
    
    if (file) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        fileNameDisplay.textContent = `✓ ${file.name} (${sizeMB} MB)`;
        fileNameDisplay.style.color = '#27ae60';
    } else {
        fileNameDisplay.textContent = 'No file chosen';
        fileNameDisplay.style.color = '#999';
    }
    
    validateResumePdf();
});

// Display saved registrations on page load
window.addEventListener('load', function() {
    const registrations = getFromLocalStorage();
    if (registrations.length > 0) {
        const info = document.createElement('div');
        info.style.cssText = 'background: #e8f4f8; padding: 15px; margin-bottom: 20px; border-radius: 6px; border-left: 4px solid #3498db;';
        info.innerHTML = `<strong>📊 Found ${registrations.length} saved registration(s)</strong><br>
        <small>View or download them anytime using the buttons below</small>`;
        document.querySelector('.form-wrapper').insertBefore(info, document.getElementById('registrationForm'));
    }
});

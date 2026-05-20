# Registration Form with Validation

A comprehensive registration form with extensive validation and JSON data storage capabilities.

## Features

### Form Sections

#### 1. **Personal Information**
- Full Name (with validation)
- Email Address (email format validation)
- Phone Number (phone format validation)
- Password (strong password requirements)
- Confirm Password (password match validation)
- Date of Birth (age verification)
- Gender (dropdown selection)
- Location/City (required field)
- Bio/About You (optional textarea)
- Resume/CV PDF Upload (required, max 5MB)

#### 2. **Education Information**
- Education Level (dropdown: High School, Bachelor's, Master's, PhD, etc.)
- Field of Study (dropdown: Computer Science, Engineering, Medicine, etc.)
- Institute/University Name
- Graduation Year (numeric with range validation)
- Certifications/Licenses (optional textarea)

#### 3. **Occupation Information**
- Job Title
- Company Name
- Industry (dropdown: Technology, Healthcare, Finance, etc.)
- Years of Experience (dropdown: 0-1, 1-3, 3-5, 5-10, 10-15, 15+)
- Employment Type (radio buttons: Full-time, Part-time, Freelance, Self-employed)
- Work Experience/Summary (optional textarea)

#### 4. **Social & Professional Profiles**
- LinkedIn Profile URL
- GitHub Profile URL
- Portfolio Website URL
- Twitter Profile URL

#### 5. **Agreements**
- Terms & Conditions (required checkbox)
- Privacy Policy (required checkbox)
- Marketing Communications (optional checkbox)

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*, etc.)

### PDF File Upload Validation
- File type: PDF only (.pdf extension)
- Maximum file size: 5MB
- Required field
- File is converted to Base64 for storage

### Email Validation
- Valid email format check

### Phone Number Validation
- International phone format support

### URL Validation
- Valid URL format for all profile links

### Date of Birth Validation
- Age must be 13 or older
- Age must be 120 or younger

### Other Validations
- Full Name: minimum 3 characters, letters/spaces/hyphens/apostrophes only
- Location: minimum 2 characters
- Institute: minimum 2 characters
- Job Title: minimum 2 characters
- Company: minimum 2 characters
- Graduation Year: 1980-2050 range

## Data Structure

The form collects data in the following JSON structure:

```json
{
  "id": "REG_1234567890_abc123def",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "personal": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "dob": "1990-05-15",
    "gender": "Male",
    "location": "New York, USA",
    "bio": "Passionate developer and tech enthusiast",
    "resumeFile": {
      "name": "JohnDoe_Resume.pdf",
      "size": 245832,
      "type": "application/pdf",
      "base64": "data:application/pdf;base64,JVBERi0xLjQKJeLj..."
    }
  },
  "education": {
    "educationLevel": "Master's Degree",
    "fieldOfStudy": "Computer Science",
    "institute": "Stanford University",
    "graduationYear": "2018",
    "certifications": "AWS Certified Solutions Architect, Google Cloud Associate"
  },
  "occupation": {
    "jobTitle": "Senior Software Engineer",
    "company": "Tech Company Inc",
    "industry": "Technology",
    "yearsExperience": "5-10",
    "employmentType": "Full-time",
    "workExperience": "10+ years in full-stack development"
  },
  "profiles": {
    "linkedin": "https://www.linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "portfolio": "https://johndoe.com",
    "twitter": "https://twitter.com/johndoe"
  },
  "agreements": {
    "termsAndConditions": true,
    "privacyPolicy": true,
    "marketingCommunications": true
  }
}
```

## Storage

### Browser Local Storage
- All registrations are stored in browser's localStorage
- Data persists across browser sessions
- Key: `registrations` (contains an array of all registrations)

### JSON Download
- Users can download registration data as a JSON file
- File naming: `registrations_[timestamp].json`
- Multiple registrations can be downloaded together

## How to Use

1. **Open the Form**
   - Open `index.html` in a web browser

2. **Fill in the Form**
   - Complete all required fields (marked with *)
   - Optional fields can be left blank
   - Real-time validation provides immediate feedback

3. **Submit**
   - Click "Register" button to submit
   - Form validates all data before submission

4. **View Results**
   - Success message displays after submission
   - View all previous registrations
   - Download data as JSON file
   - View individual registration details

5. **New Registration**
   - Click "New Registration" to fill another form
   - All previous data remains saved

## Features

### Real-Time Validation
- Validation runs as you leave each field (blur event)
- Error messages appear immediately
- Visual feedback with colored borders (red for invalid, green for valid)

### Responsive Design
- Mobile-friendly layout
- Adapts to different screen sizes
- Touch-friendly buttons and form elements

### User Experience
- Clean and modern interface
- Gradient background and themed colors
- Smooth transitions and animations
- Clear error messages and instructions

### Data Management
- Unique ID for each registration
- Timestamp for tracking
- View all registrations
- Search and filter capabilities
- Download as JSON
- **Download PDF files** from individual registrations
- Copy data to clipboard

## Files

- **index.html** - Main form structure
- **style.css** - Styling and responsive design
- **script.js** - Validation logic and data storage
- **README.md** - Documentation

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

⚠️ **Important**: This form stores data in browser's localStorage, which is not encrypted. For production use:
- Implement server-side validation
- Use HTTPS for data transmission
- Store passwords securely (never store plain text)
- Implement proper authentication
- Use database backend for persistence

## Customization

### Adding New Fields
1. Add input element to HTML in appropriate fieldset
2. Add validation function in script.js
3. Add error span element
4. Add field to collectFormData() function
5. Add blur event listener for real-time validation

### Changing Validation Rules
- Modify regex patterns in validation functions
- Update error messages as needed
- Adjust field lengths and ranges

### Styling Changes
- Edit color schemes in style.css
- Modify gradient backgrounds
- Adjust spacing and sizing

## License

Free to use and modify for educational purposes.

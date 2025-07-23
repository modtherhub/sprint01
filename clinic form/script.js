// ======================
// Global Counters
// ======================

// Track the number of dynamic fields for different categories (phones, emails, admins, etc.)
let phoneCounter = 0;
let emailCounter = 1;
let adminCounter = 1;
let clinicEmailCounter = 1;
let clinicPhoneCounter = 0;
let deliveryCounter = 0;

// ========================================
// Function to Dynamically Create Input Fields
// ========================================

/**
 * Creates and appends a new input field inside the specified container.
 * Used for adding phone numbers, emails, etc. dynamically.
 * @param {string} containerId - The container element's ID.
 * @param {string} type - Input type (e.g., 'email', 'tel', 'text').
 * @param {string} labelText - Label text for the field.
 * @param {string} placeholder - Placeholder text for the field.
 * @param {boolean} isRequired - Whether the field is required.
 * @param {number} counter - Counter for unique field id/naming.
 */
function createInputField(containerId, type, labelText, placeholder, isRequired, counter) {
  const container = document.getElementById(containerId);
  const fieldId = `${type}${counter}`;
  const fieldWrapper = document.createElement('div');
  fieldWrapper.classList.add('field-entry');
  
  // Structure of the input field (label, input, remove button)
  fieldWrapper.innerHTML = `
    <label for="${fieldId}">${labelText} ${counter}</label>
    <input 
      type="${type}" 
      id="${fieldId}" 
      name="${type}" 
      placeholder="${placeholder}"
      ${isRequired ? 'required' : ''} />
    <button type="button" class="removeBtn" onclick="this.parentNode.remove()">Remove</button>
  `;
  container.appendChild(fieldWrapper);
}

// ======================
// DOMContentLoaded Event Handler
// ======================
document.addEventListener('DOMContentLoaded', () => {

  // Main Application Form
  const form = document.getElementById('Application');
  if (!form) {
    console.error('Form element not found!');
    return;
  }

  // Select input and error elements for Owner, Clinic, Admin, etc.
  const ownerEmail = document.getElementById('ownerEmail');
  const ownerEmailError = document.getElementById('ownerEmailError');
  const clinicEmail = document.getElementById('clinicEmail');
  const clinicEmailError = document.getElementById('clinicEmailError');
  const adminEmail = document.getElementById('adminEmail');
  const adminEmailError = document.getElementById('adminEmailError');
  const genderSelect = document.getElementById('gender');
  const genderError = document.getElementById('genderError');
  const ownershipSelect = document.querySelector('select[name=""]');
  const ownershipError = document.getElementById('ownershipError');
  
  // List of all fields requiring validation
  const fields = [
    { id: 'ownerName', name: 'Full Name' },
    { id: 'ownerBirthDate', name: 'Date of Birth' },
    { id: 'clinicName', name: 'Clicic Name' },
    { id: 'license', name: 'License Number' },
    { id: 'address', name: 'Address' },
    { id: 'workingHours', name: 'Working Hours' },
    { id: 'ownerAddress', name: 'Owner Address'}
  ];

  // ==================================
  // Restore Previous Form Data from Local Storage
  // ==================================
  const savedData = JSON.parse(localStorage.getItem('clinicFormData')) || {};
  for (const [key, value] of Object.entries(savedData)) {
    const field = document.getElementById(key);
    if (field) field.value = value;
  }

  // Save field data to local storage on each input/change event
  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
      const currentData = JSON.parse(localStorage.getItem('clinicFormData')) || {};
      currentData[input.id] = input.value;
      localStorage.setItem('clinicFormData', JSON.stringify(currentData));
    });
  });

  // Remove saved data from localStorage upon form submission
  form.addEventListener('submit', () => {
    localStorage.removeItem('clinicFormData');
  });

  // ==================================
  // Validation Functions
  // ==================================

  /**
   * General field validation for required fields.
   */
  function validateField(input, errorEl, fieldName = 'This field') {
    if (!input || !errorEl) {
      console.error(`Validation elements not found for ${fieldName}`);
      return false;
    }
    const value = input.value.trim();
    if (!value) {
      showError(input, errorEl, `${fieldName} cannot be empty`);
      return false;
    }
    hideError(input, errorEl);
    return true;
  }

  /**
   * Validates email format and presence.
   */
  function validateEmail(inputEl, errorEl) {
    if (!inputEl || !errorEl) {
      console.error('Email validation elements not found');
      return false;
    }
    const value = inputEl.value.trim();
    if (!value) return showError(inputEl, errorEl, 'Email cannot be empty');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return showError(inputEl, errorEl, 'Invalid email format');
    }
    hideError(inputEl, errorEl);
    return true;
  }

  /**
   * Validates that a select field was chosen.
   */
  function validateSelect(select, errorEl, fieldName = 'This field') {
    if (!select || !errorEl) {
      console.error(`Validation elements not found for ${fieldName}`);
      return false;
    }
    if (!select.value || select.value === "") {
      showError(select, errorEl, `Please select ${fieldName}`);
      return false;
    }
    hideError(select, errorEl);
    return true;
  }

  /**
   * Shows validation error message for a given field.
   */
  function showError(input, errorEl, message) {
    if (!errorEl) {
      console.error('Error element not found for:', input);
      return false;
    }
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    input?.classList.add('invalid');
    return false;
  }

  /**
   * Hides error message and styling for a field.
   */
  function hideError(input, errorEl) {
    if (!errorEl) return;
    errorEl.textContent = '';
    errorEl.style.display = 'none';
    input?.classList.remove('invalid');
  }

  // ==========================
  // Set Up Validation Events
  // ==========================
  // Add validation event listeners for all key fields
  fields.forEach(({ id, name }) => {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(id + 'Error');
    if (input && errorEl) {
      input.addEventListener('blur', () => validateField(input, errorEl, name));
      input.addEventListener('input', () => validateField(input, errorEl, name));
    }
  });

  // Specific validators for emails
  if (ownerEmail && ownerEmailError) {
    ownerEmail.addEventListener('blur', () => validateEmail(ownerEmail, ownerEmailError));
    ownerEmail.addEventListener('input', () => validateEmail(ownerEmail, ownerEmailError));
  }
  if (clinicEmail && clinicEmailError) {
    clinicEmail.addEventListener('blur', () => validateEmail(clinicEmail, clinicEmailError));
    clinicEmail.addEventListener('input', () => validateEmail(clinicEmail, clinicEmailError));
  }
  if (adminEmail && adminEmailError) {
    adminEmail.addEventListener('blur', () => validateEmail(adminEmail, adminEmailError));
    adminEmail.addEventListener('input', () => validateEmail(adminEmail, adminEmailError));
  }

  // Select field validation for Gender and Ownership Type
  if (genderSelect && genderError) {
    genderSelect.addEventListener('change', () => validateSelect(genderSelect, genderError, 'Gender'));
  }
  if (ownershipSelect && ownershipError) {
    ownershipSelect.addEventListener('change', () => validateSelect(ownershipSelect, ownershipError, 'Ownership Type'));
  }

  // ============================
  // Form Submission Handling
  // ============================

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent actual form submission

    let isValid = true;

    // Validate all required fields
    fields.forEach(({ id, name }) => {
      const input = document.getElementById(id);
      const errorEl = document.getElementById(id + 'Error');
      if (input && errorEl) {
        isValid = validateField(input, errorEl, name) && isValid;
      }
    });

    // Email validation
    if (ownerEmail && ownerEmailError) {
      isValid = validateEmail(ownerEmail, ownerEmailError) && isValid;
    }
    if (clinicEmail && clinicEmailError) {
      isValid = validateEmail(clinicEmail, clinicEmailError) && isValid;
    }
    if (adminEmail && adminEmailError) {
      isValid = validateEmail(adminEmail, adminEmailError) && isValid;
    }

    // Select dropdowns validation
    if (genderSelect && genderError) {
      isValid = validateSelect(genderSelect, genderError, 'Gender') && isValid;
    }
    if (ownershipSelect && ownershipError) {
      isValid = validateSelect(ownershipSelect, ownershipError, 'Ownership Type') && isValid;
    }

    // If invalid, inform the user and scroll to the first error
    if (!isValid) {
      alert('Please correct the errors in the form');
      const firstError = form.querySelector('.invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // =======================================
    // Prepare Form Data for Submission
    // =======================================
    const clinicData = {
      clinic: {
        owner: {
          fullName: document.getElementById('ownerName')?.value || '',
          gender: genderSelect?.value || '',
          dateOfBirth: document.getElementById('ownerBirthDate')?.value || '',
          address: document.getElementById('ownerAddress')?.value || '',
          contactInformation: {
            email: ownerEmail?.value || '',
            phones: arrayToObject(getDynamicFieldValues('contactFieldsContainer', 'tel')),
            additionalEmails: arrayToObject(getDynamicFieldValues('contactFieldsContainer', 'email'))
          },
          ownershipType: ownershipSelect?.value || '',
          admins: arrayToObject(getDynamicFieldValues('adminFieldsContainer', 'email'))
        },
        name: document.getElementById('clinicName')?.value || '',
        licenseNumber: document.getElementById('license')?.value || '',
        address: document.getElementById('address')?.value || '',
        contactInfo: {
          email: clinicEmail?.value || '',
          phones: arrayToObject(getDynamicFieldValues('clinicContactInformation', 'tel')),
          additionalEmails: arrayToObject(getDynamicFieldValues('clinicContactInformation', 'email'))
        },
        workingHours: document.getElementById('workingHours')?.value || '',
        deliveryOptions: arrayToObject(getDynamicFieldValues('deliveryFieldsContainer', 'text'))
      }
    };

    // Helper: Convert array of input values to object indexed by their order
    function arrayToObject(arr) {
      return arr.reduce((obj, item, index) => {
        obj[index] = item;
        return obj;
      }, {});
    }

    // Display the prepared data for debugging
    console.log("✅ Clinic Data:", JSON.stringify(clinicData, null, 2));

    // Reset form and dynamic fields after successful submission
    form.reset();
    clearDynamicFields();
    clearValidationStyles();

    alert("✅ Form submitted successfully! (Check console for data)");
  });

  // ======================
  // Utility Functions
  // ======================

  /**
   * Retrieves all non-empty values from dynamic input fields in a container.
   */
  function getDynamicFieldValues(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    return Array.from(container.querySelectorAll(`input[type="${type}"]`))
      .map(input => input.value.trim())
      .filter(value => value);
  }

  /**
   * Removes all dynamic fields from their containers.
   */
  function clearDynamicFields() {
    const containers = [
      'contactFieldsContainer',
      'adminFieldsContainer',
      'clinicContactInformation',
      'deliveryFieldsContainer'
    ];
    containers.forEach(id => {
      const container = document.getElementById(id);
      if (container) container.innerHTML = '';
    });
  }

  /**
   * Clears all field validation styles and error messages.
   */
  function clearValidationStyles() {
    form.querySelectorAll('.invalid').forEach(el => {
      el.classList.remove('invalid');
    });
    form.querySelectorAll('.error').forEach(el => {
      if (el) {
        el.textContent = '';
        el.style.display = 'none';
      }
    });
  }

}); // End of DOMContentLoaded event
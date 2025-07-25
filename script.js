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
let departmentCounter = 1;
let staffCounter = 1; 
let affiliatedDoctorsCounter = 1;

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
    <label for="${fieldId}">${labelText}</label>
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






document.addEventListener('DOMContentLoaded', () => {

  // Main Application Form
  const form = document.getElementById('Application');
  if (!form) {
    console.error('Form element not found!');
    return;
  }

 
  const fields = [
    { id: 'ownerName', name: 'Full Name' },
    { id: 'ownerBirthDate', name: 'Date of Birth' },
    { id: 'ownerAddress', name: 'Owner Address' },
    { id: 'centerName', name: 'Center Name' },
    { id: 'license', name: 'License Number' },
    { id: 'centerAddress', name: 'Address' },
    { id: 'workingHours', name: 'Working Hours' }
  ];

  // ==================================
  // Restore Previous Form Data from Local Storage
  // ==================================
  const savedData = JSON.parse(localStorage.getItem('mCenterFormData')) || {};
  for (const [key, value] of Object.entries(savedData)) {
    const field = document.getElementById(key);
    if (field) field.value = value;
  }

  // Save field data to local storage on each input/change event
  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
      const currentData = JSON.parse(localStorage.getItem('mCenterFormData')) || {};
      currentData[input.id] = input.value;
      localStorage.setItem('mCenterFormData', JSON.stringify(currentData));
    });
  });

  // Remove saved data from localStorage upon form submission
  form.addEventListener('submit', () => {
    localStorage.removeItem('mCenterFormData');
  });
  // ==================================
  // Restore Previous Form Data from Local Storage
  // ==================================


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

  function hideError(input, errorEl) {
    if (!errorEl) return;
    errorEl.textContent = '';
    errorEl.style.display = 'none';
    input?.classList.remove('invalid');
  }

  fields.forEach(({ id, name }) => {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(id + 'Error');
    if (input && errorEl) {
      input.addEventListener('blur', () => validateField(input, errorEl, name));
      input.addEventListener('input', () => validateField(input, errorEl, name));
    }
  });


  /* Email VAlidation */
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

  function setupEmailValidation() {
  const emailInputs = document.querySelectorAll('[data-email]');

  emailInputs.forEach((inputEl) => {
    const errorId = inputEl.dataset.error;
    const errorEl = document.getElementById(errorId);

    if (!errorEl) {
      console.warn(`Error element with ID "${errorId}" not found`);
      return;
    }

    const validate = () => validateEmail(inputEl, errorEl);

    inputEl.addEventListener('blur', validate);
    inputEl.addEventListener('input', validate);
  });
  }

  setupEmailValidation();


    const genderSelect = document.getElementById('gender');
  const genderError = document.getElementById('genderError');



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

  
function setupSelectValidation() {
  const selectInputs = document.querySelectorAll('[data-select]');
  
  selectInputs.forEach((selectEl) => {
    const errorId = selectEl.dataset.error;
    const fieldName = selectEl.dataset.label || 'This field'; // Optional: custom label
    const errorEl = document.getElementById(errorId);

    if (!errorEl) {
      console.warn(`Error element with ID "${errorId}" not found`);
      return;
    }

    const validate = () => validateSelect(selectEl, errorEl, fieldName);

    selectEl.addEventListener('change', validate);
    selectEl.addEventListener('blur', validate);
  });
}
setupSelectValidation();
setupEmailValidation();

// في جزء التحقق من الصحة في حدث submit:
form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    // 1. تحقق من الحقول الأساسية (تم تحديث القائمة)
    const fieldsToValidate = [
        { id: 'ownerName', name: 'Full Name' },
        { id: 'ownerBirthDate', name: 'Date of Birth' },
        { id: 'ownerAddress', name: 'Owner Address' },
        { id: 'centerName', name: 'Center Name' },
        { id: 'license', name: 'License Number' },
        { id: 'centerAddress', name: 'Address' },
        { id: 'workingHours', name: 'Working Hours' },
        { id: 'department', name: 'Department Name' },
        { id: 'staffRole', name: 'Staff Role' },
        { id: 'employees', name: 'Employee Number' },
        { id: 'servicePricing', name: 'Service Pricing' },
        { id: 'serviceFlowMetrics', name: 'Flow Metrics' }
    ];

    fieldsToValidate.forEach(({ id, name }) => {
        const input = document.getElementById(id);
        const errorEl = document.getElementById(id + 'Error');
        if (input && errorEl) {
            isValid = validateField(input, errorEl, name) && isValid;
        }
    });

    // 2. تحقق من حقول البريد الإلكتروني (تم تحديثها)
    const emailFields = [
        { inputId: 'ownerEmail', errorId: 'ownerEmailError' },
        { inputId: 'adminEmail', errorId: 'adminEmailError' },
        { inputId: 'centerEmail', errorId: 'centerEmailError' }
    ];

    emailFields.forEach(({ inputId, errorId }) => {
        const inputEl = document.getElementById(inputId);
        const errorEl = document.getElementById(errorId);
        if (inputEl && errorEl) {
            isValid = validateEmail(inputEl, errorEl) && isValid;
        }
    });

    // 3. تحقق من حقول select (تم تحديثها)
    const selectFields = [
        { selectId: 'gender', errorId: 'genderError', label: 'Gender' },
        { selectId: 'onwershipType', errorId: 'ownershipError', label: 'Ownership Type' }
    ];

    selectFields.forEach(({ selectId, errorId, label }) => {
        const selectEl = document.getElementById(selectId);
        const errorEl = document.getElementById(errorId);
        if (selectEl && errorEl) {
            isValid = validateSelect(selectEl, errorEl, label) && isValid;
        }
    });

    if (!isValid) {
        const firstError = document.querySelector('.invalid');
        if (firstError) {
            firstError.scrollIntoView({behavior: 'smooth', block: 'center'});
            firstError.focus();
        }
        alert("⚠️ يوجد أخطاء في تعبئة البيانات — يرجى مراجعة الحقول باللون الأحمر.");
        return;
    }

    // 4. تجهيز البيانات (تم تصحيح المتغيرات غير المعرفة)
    const centerData = {
        clinic: {
            owner: {
                fullName: document.getElementById('ownerName')?.value || '',
                gender: document.getElementById('gender')?.value || '',
                dateOfBirth: document.getElementById('ownerBirthDate')?.value || '',
                address: document.getElementById('ownerAddress')?.value || '',
                contactInformation: {
                    email: document.getElementById('ownerEmail')?.value || '',
                    phones: arrayToObject(getDynamicFieldValues('contactFieldsContainer', 'tel')),
                    additionalEmails: arrayToObject(getDynamicFieldValues('contactFieldsContainer', 'email'))
                },
                ownershipType: document.getElementById('onwershipType')?.value || '',
                admins: arrayToObject(getDynamicFieldValues('adminFieldsContainer', 'email'))
            },
            name: document.getElementById('centerName')?.value || '',
            licenseNumber: document.getElementById('license')?.value || '',
            address: document.getElementById('centerAddress')?.value || '',
            contactInfo: {
                email: document.getElementById('centerEmail')?.value || '',
                phones: arrayToObject(getDynamicFieldValues('centerContactInformation', 'tel')),
                additionalEmails: arrayToObject(getDynamicFieldValues('centerContactInformation', 'email'))
            },
            workingHours: document.getElementById('workingHours')?.value || '',
            departments: arrayToObject(getDynamicFieldValues('departmentFields', 'text')),
            staff: arrayToObject(getDynamicFieldValues('staffRoleFields', 'text')),
            afiliatedDoctors: arrayToObject(getDynamicFieldValues('affiliatedDoctorsFields', 'text')),
            operationalData: {
                employees: document.getElementById('employees')?.value || '',
                servicePricing: document.getElementById('servicePricing')?.value || '',
                serviceFlowMetrics: document.getElementById('serviceFlowMetrics')?.value || ''
            }
        }
    };

    console.log("✅ Clinic Data:", JSON.stringify(centerData, null, 2));
    
    // 5. تنظيف النموذج بعد الإرسال (تم نقل حذف localStorage هنا)
    form.reset();
    clearDynamicFields();
    clearValidationStyles();
    localStorage.removeItem('mCenterFormData'); // تم نقلها هنا بعد التأكد من الإرسال
    alert("✅ تم إرسال النموذج بنجاح! (راجع الكونسول)");
});

phones: arrayToObject(getDynamicFieldValues('contactFieldsContainer', 'tel')),

function getDynamicFieldValues(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    return Array.from(container.querySelectorAll(`input[type="${type}"]`))
      .map(input => input.value.trim())
      .filter(value => value);
  }
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

})

/* 
setupFileValidation(); */

/* 
function validateFile(inputEl, errorEl, allowedExts = [], fieldName = 'This field') {
  if (!inputEl || !errorEl) return false;

  const files = inputEl.files;
  if (files.length === 0) {
    showError(inputEl, errorEl, `${fieldName} is required`);
    return false;
  }

  const file = files[0];
  const ext = file.name.split('.').pop().toLowerCase();

  if (!allowedExts.includes(ext)) {
    showError(inputEl, errorEl, `Please upload a valid ${fieldName} (${allowedExts.join(', ').toUpperCase()}).`);
    return false;
  }

  hideError(inputEl, errorEl);
  return true;
}

function setupFileValidation() {
  const fileInputs = document.querySelectorAll('[data-file]');

  fileInputs.forEach((inputEl) => {
    const errorId = inputEl.dataset.error;
    const fieldName = inputEl.dataset.label || 'This field';
    const allowedExts = (inputEl.dataset.allowed || '').split(',').map(e => e.trim().toLowerCase());
    const errorEl = document.getElementById(errorId);

    if (!errorEl) {
      console.warn(`Error element with ID "${errorId}" not found`);
      return;
    }

    const validate = () => validateFile(inputEl, errorEl, allowedExts, fieldName);

    inputEl.addEventListener('change', validate);
    inputEl.addEventListener('blur', validate); // optional
  });
}

 */
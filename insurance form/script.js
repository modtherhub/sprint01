let phoneCounter = 0;
let emailCounter = 1;
let adminCounter = 1;
let departmentCounter = 1;
let staffCounter = 1; 
let affiliatedDoctorsCounter = 1;
let insuranceEmailCounter = 0;
let insurancePhoneCounter = 1;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('Application');
  if (!form) {
    console.error('Form element not found!');
    return;
  }
    const fields = [
    { id: 'ownerName', name: 'Full Name' },
    { id: 'ownerBirthDate', name: 'Date of Birth' },
    { id: 'ownerAddress', name: 'Owner Address' },

    { id: 'insuranceName', name: 'hospital Name' },
    { id: 'license', name: 'License Number' },

    { id: 'insuranceAddress', name: 'Address' },
    { id: 'workingHours', name: 'Working Hours' },
    { id: 'companyProfile', name: 'Company Profile' },
    { id: 'policies', name: 'policies' },
    { id: 'enrolmentMethods', name: 'Enrolment Methods' },
    { id: 'clamManagement', name: 'Clam Management' },
    { id: 'contractedFacilities', name: 'Contracted Facilities' },
  ];

  
    const savedData = JSON.parse(localStorage.getItem('insuranceFormData')) || {};
    for (const [key, value] of Object.entries(savedData)) {
        const field = document.getElementById(key);
        if (field) field.value = value;
    }

  // Save form data to localStorage
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
          const currentData = JSON.parse(localStorage.getItem('insuranceFormData')) || {};
          currentData[input.id] = input.value;
          localStorage.setItem('insuranceFormData', JSON.stringify(currentData));
        });
    });

   fields.forEach(({ id, name }) => {
        const input = document.getElementById(id);
        const errorEl = document.getElementById(id + 'Error');
        if (input && errorEl) {
          input.addEventListener('blur', () => validateField(input, errorEl, name));
          input.addEventListener('input', () => validateField(input, errorEl, name));
        }
    });

    setupEmailValidation();
    setupSelectValidation();

    form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    // Validate all fields
    fields.forEach(({ id, name }) => {
      const input = document.getElementById(id);
      const errorEl = document.getElementById(id + 'Error');
      if (input && errorEl) {
        isValid = validateField(input, errorEl, name) && isValid;
      }
    });

    // Validate all email fields
    document.querySelectorAll('[data-email]').forEach(inputEl => {
      const errorId = inputEl.dataset.error;
      const errorEl = document.getElementById(errorId);
      if (inputEl && errorEl) {
        isValid = validateEmail(inputEl, errorEl) && isValid;
      }
    });

    // Validate all select fields
    document.querySelectorAll('[data-select]').forEach(selectEl => {
      const errorId = selectEl.dataset.error;
      const fieldName = selectEl.dataset.label || 'This field';
      const errorEl = document.getElementById(errorId);
      if (selectEl && errorEl) {
        isValid = validateSelect(selectEl, errorEl, fieldName) && isValid;
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


    const insuranceCompanyData = {
  insurance: {
    owner: {
      fullName: document.getElementById('ownerName')?.value || '',
      gender: document.getElementById('gender')?.value || '',
      dateOfBirth: document.getElementById('ownerBirthDate')?.value || '',
      address: document.getElementById('ownerAddress')?.value || '',
      contactInformation: {
        email: document.getElementById('ownerEmail')?.value || '',
        phones: arrayToObject(getDynamicFieldValues('contactFieldsContainer', 'tel')),
        additionalEmails: arrayToObject(getDynamicFieldValues('contactFieldsContainer', 'email')),
      },
      ownershipType: document.getElementById('onwershipType')?.value || '',
      admins: {
        adminEmail: document.getElementById('adminEmail')?.value || '',
        additionalAdmin: arrayToObject(getDynamicFieldValues('adminFieldsContainer', 'email')),
      }
    },
    name: document.getElementById('insuranceName')?.value || '',
    licenseNumber: document.getElementById('license')?.value || '',
    address: document.getElementById('insuranceAddress')?.value || '',
    contactInfo: {
      email: document.getElementById('insuranceEmail')?.value || '',
      phones: arrayToObject(getDynamicFieldValues('insuranceContactInformation', 'tel')),
      additionalEmails: arrayToObject(getDynamicFieldValues('insuranceContactInformation', 'email')),
    },
    workingHours: document.getElementById('workingHours')?.value || '',
    companyProfile: document.getElementById('companyProfile')?.value || '',
    policies: document.getElementById('policies')?.value || '',
    patientEnrolmentMethods: {
      method: document.getElementById('enrolmentMethods')?.value || '',
      additionalMethods: arrayToObject(getDynamicFieldValues('enrolmentMethodsFields', 'text')),
    },
    clamManagement: document.getElementById('clamManagement')?.value || '',
    contractedFacilities: {
      facility: document.getElementById('contractedFacilities')?.value || '',
      additionalFacilities: arrayToObject(getDynamicFieldValues('contractedFacilitiesFields', 'text')),
    },
    digitalCard: document.getElementById('digitalCard')?.value || 'false'
  }
};


     console.log("✅ hospital Data:", JSON.stringify(insuranceCompanyData, null, 2));
    
    // Clean up after submission
    form.reset();
    clearDynamicFields();
    clearValidationStyles();
    localStorage.removeItem('insuranceFormData');
    alert("✅ تم إرسال النموذج بنجاح! (راجع الكونسول)");
  });

});
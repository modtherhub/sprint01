let phoneCounter = 0;
let emailCounter = 1;
let adminCounter = 1;
let deliveryCounter = 0;
let departmentCounter = 1;
let staffCounter = 1; 
let affiliatedDoctorsCounter = 1;
let hospitalEmailCounter = 0;
let hospitalPhoneCounter = 1;
let equipmentCounter = 1;




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
    { id: 'hospitalName', name: 'hospital Name' },
    { id: 'license', name: 'License Number' },
    { id: 'hospitalAddress', name: 'Address' },
    { id: 'workingHours', name: 'Working Hours' },
    { id: 'employees', name: 'Employee Number' },
    { id: 'servicePricing', name: 'Service Pricing' },
    { id: 'serviceFlowMetrics', name: 'Flow Metrics' },
    { id: 'department', name: 'Department Name' },
    { id: 'staffRole', name: 'Staff Role' },
    { id: 'equipments', name: 'Equipments' },
    { id: 'beds', name: 'Beds Number' },
  ];

  // Restore form data from localStorage
  const savedData = JSON.parse(localStorage.getItem('hospitalFormData')) || {};
  for (const [key, value] of Object.entries(savedData)) {
    const field = document.getElementById(key);
    if (field && field.type !== 'file') { // تخطي حقول الملفات
    field.value = value;
  }
  }

  // Save form data to localStorage
  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
      const currentData = JSON.parse(localStorage.getItem('hospitalFormData')) || {};
      currentData[input.id] = input.value;
      localStorage.setItem('hospitalFormData', JSON.stringify(currentData));
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
    setupFileValidation();

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


  const fileFields = [
    { 
        inputId: 'facilityAccreditationDoc', 
        errorId: 'docError',
        allowed: ['pdf', 'doc', 'docx']
    },
    { 
        inputId: 'safetyAndQuslityCertificate', 
        errorId: 'imgError',
        allowed: ['jpg', 'jpeg', 'png']
    }
];

  fileFields.forEach(({ inputId, errorId, allowed }) => {
    const inputEl = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
            if (inputEl && errorEl) {
                isValid = validateFile(inputEl, errorEl, allowed) && isValid;
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


    const hospitalData = {
  hospital: {
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
      admins: {
        adminEmail: document.getElementById('adminEmail')?.value || '',
        additionalAdmin: arrayToObject(getDynamicFieldValues('adminFieldsContainer', 'email'))
      }
    },
    name: document.getElementById('hospitalName')?.value || '',
    licenseNumber: document.getElementById('license')?.value || '',
    address: document.getElementById('hospitalAddress')?.value || '',
    contactInfo: {
      email: document.getElementById('hospitalEmail')?.value || '',
      phones: arrayToObject(getDynamicFieldValues('hospitalContactInformation', 'tel')),
      additionalEmails: arrayToObject(getDynamicFieldValues('hospitalContactInformation', 'email'))
    },
    workingHours: document.getElementById('workingHours')?.value || '',
    departments: {
        department : document.getElementById('department')?.value || '',
        additionaldepartments: arrayToObject(getDynamicFieldValues('departmentFields', 'text')),
    },
    staff: {
        staff : document.getElementById('staffRole')?.value || '',
        additionalStaff: arrayToObject(getDynamicFieldValues('staffRoleFields', 'text')),
    },
    afiliatedDoctors: {
        doctor : document.getElementById('affiliatedDoctor')?.value || '',
        additionalAfiliatedDoctors: arrayToObject(getDynamicFieldValues('affiliatedDoctorsFields', 'text')),
    },
    operationalData: {
      employees: document.getElementById('employees')?.value || '',
      servicePricing: document.getElementById('servicePricing')?.value || '',
      serviceFlowMetrics: document.getElementById('serviceFlowMetrics')?.value || ''
    },
    documents: {
      accreditationDoc: document.getElementById('facilityAccreditationDoc')?.files[0] ? {
        name: document.getElementById('facilityAccreditationDoc').files[0].name,
        type: document.getElementById('facilityAccreditationDoc').files[0].type,
        size: document.getElementById('facilityAccreditationDoc').files[0].size,
        lastModified: document.getElementById('facilityAccreditationDoc').files[0].lastModified
      } : null,
      qualityCertificate: document.getElementById('safetyAndQuslityCertificate')?.files[0] ? {
        name: document.getElementById('safetyAndQuslityCertificate').files[0].name,
        type: document.getElementById('safetyAndQuslityCertificate').files[0].type,
        size: document.getElementById('safetyAndQuslityCertificate').files[0].size,
        lastModified: document.getElementById('safetyAndQuslityCertificate').files[0].lastModified
      } : null
    },
    resourceInventory: {
        equipments: { equipment : document.getElementById('equipments')?.value || '',
            additionalEquipment : arrayToObject(getDynamicFieldValues('equipmentsFields', 'text')),
        },
        Beds: document.getElementById('beds')?.value || ''
      }
  }
    };

     console.log("✅ hospital Data:", JSON.stringify(hospitalData, null, 2));
    
    // Clean up after submission
    form.reset();
    clearDynamicFields();
    clearValidationStyles();
    localStorage.removeItem('hospitalFormData');
    alert("✅ تم إرسال النموذج بنجاح! (راجع الكونسول)");
  });
});
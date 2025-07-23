let phoneCounter = 0;
let emailCounter = 1;
let adminCounter = 1;
let pharmacyEmailCounter = 1;
let pharmacyPhoneCounter = 0;
let deliveryCounter = 0;

function createInputField(containerId, type, labelText, placeholder, isRequired, counter) {
  const container = document.getElementById(containerId);
  const fieldId = `${type}${counter}`;
  
  const fieldWrapper = document.createElement('div');
  fieldWrapper.classList.add('field-entry');
  
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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('Application');
  if (!form) {
    console.error('Form element not found!');
    return;
  }

  // عناصر DOM الأساسية
  const ownerEmail = document.getElementById('ownerEmail');
  const ownerEmailError = document.getElementById('ownerEmailError');
  const pharmacyEmail = document.getElementById('pharmacyEmail');
  const pharmacyEmailError = document.getElementById('pharmacyEmailError');
  const adminEmail = document.getElementById('adminEmail');
  const adminEmailError = document.getElementById('adminEmailError');
  const genderSelect = document.getElementById('gender');
  const genderError = document.getElementById('genderError');
  const ownershipSelect = document.querySelector('select[id=""]'); // تم التصحيح هنا
  const ownershipError = document.getElementById('ownershipError');

  // تعريف الحقول مع أسمائها لأغراض التحقق
  const fields = [
    { id: 'ownerName', name: 'Full Name' },
    { id: 'ownerBirthDate', name: 'Date of Birth' }, // تم التصحيح هنا
    { id: 'pharmacyName', name: 'Pharmacy Name' },
    { id: 'license', name: 'License Number' },
    { id: 'address', name: 'Address' },
    { id: 'workingHours', name: 'Working Hours' }
  ];

  // 🟢 إعادة تحميل البيانات من التخزين المحلي
  const savedData = JSON.parse(localStorage.getItem('pharmacyFormData')) || {};
  for (const [key, value] of Object.entries(savedData)) {
    const field = document.getElementById(key);
    if (field) field.value = value;
  }

  // 🟡 حفظ البيانات إلى localStorage عند الكتابة
  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
      const currentData = JSON.parse(localStorage.getItem('pharmacyFormData')) || {};
      currentData[input.id] = input.value;
      localStorage.setItem('pharmacyFormData', JSON.stringify(currentData));
    });
  });

  // 🧹 حذف البيانات عند إرسال الفورم
  form.addEventListener('submit', () => {
    localStorage.removeItem('pharmacyFormData');
  });

  // ========== وظائف التحقق ==========
  function validateField(input, errorEl, fieldName = 'This field') {
    const value = input.value.trim();
    if (!value) {
      showError(input, errorEl, `${fieldName} cannot be empty`);
      return false;
    }
    hideError(input, errorEl);
    return true;
  }

  function validateEmail(inputEl, errorEl) {
    const value = inputEl.value.trim();
    if (!value) return showError(inputEl, errorEl, 'Email cannot be empty');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return showError(inputEl, errorEl, 'Invalid email format');
    hideError(inputEl, errorEl);
    return true;
  }

  function validateSelect(select, errorEl, fieldName = 'This field') {
    try {
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
    } catch (error) {
      console.error(`Error validating ${fieldName}:`, error);
      return false;
    }
  }

  function showError(input, errorEl, message) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    input.classList.add('invalid');
    return false;
  }

  function hideError(input, errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
    input.classList.remove('invalid');
  }

  // ⚙️ تفعيل التحقق عند الكتابة أو فقدان التركيز
  fields.forEach(({ id, name }) => {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(id + 'Error');
    if (input && errorEl) {
      input.addEventListener('blur', () => validateField(input, errorEl, name));
      input.addEventListener('input', () => validateField(input, errorEl, name));
    }
  });

  if (ownerEmail && ownerEmailError) {
    ownerEmail.addEventListener('blur', () => validateEmail(ownerEmail, ownerEmailError));
    ownerEmail.addEventListener('input', () => validateEmail(ownerEmail, ownerEmailError));
  }

  if (pharmacyEmail && pharmacyEmailError) {
    pharmacyEmail.addEventListener('blur', () => validateEmail(pharmacyEmail, pharmacyEmailError));
    pharmacyEmail.addEventListener('input', () => validateEmail(pharmacyEmail, pharmacyEmailError));
  }

  if (adminEmail && adminEmailError) {
    adminEmail.addEventListener('blur', () => validateEmail(adminEmail, adminEmailError));
    adminEmail.addEventListener('input', () => validateEmail(adminEmail, adminEmailError));
  }

  if (genderSelect && genderError) {
    genderSelect.addEventListener('change', () => validateSelect(genderSelect, genderError, 'Gender'));
  }

  if (ownershipSelect && ownershipError) {
    ownershipSelect.addEventListener('change', () => validateSelect(ownershipSelect, ownershipError, 'Ownership Type'));
  }

  // ========== معالجة الإرسال ==========
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    
    // التحقق من الحقول الأساسية
    fields.forEach(({ id, name }) => {
      const input = document.getElementById(id);
      const errorEl = document.getElementById(id + 'Error');
      if (input && errorEl) {
        isValid = validateField(input, errorEl, name) && isValid;
      }
    });
    
    // التحقق من حقول الإيميل
    if (ownerEmail && ownerEmailError) {
      isValid = validateEmail(ownerEmail, ownerEmailError) && isValid;
    }
    
    if (pharmacyEmail && pharmacyEmailError) {
      isValid = validateEmail(pharmacyEmail, pharmacyEmailError) && isValid;
    }
    
    if (adminEmail && adminEmailError) {
      isValid = validateEmail(adminEmail, adminEmailError) && isValid;
    }

    // التحقق من القوائم المنسدلة
    if (genderSelect && genderError) {
      isValid = validateSelect(genderSelect, genderError, 'Gender') && isValid;
    }
    
    if (ownershipSelect && ownershipError) {
      isValid = validateSelect(ownershipSelect, ownershipError, 'Ownership Type') && isValid;
    }

    if (!isValid) {
      alert('Please correct the errors in the form');
      return;
    }

    // جمع بيانات الصيدلية
    const pharmacyData = {
      owner: {
        fullName: document.getElementById('ownerName').value,
        gender: genderSelect.value,
        dateOfBirth: document.getElementById('ownerBirthDate').value,
        address: document.getElementById('address').value,
        contactInformation: {
          email: ownerEmail.value,
          phones: getDynamicFieldValues('contactFieldsContainer', 'tel'),
          additionalEmails: getDynamicFieldValues('contactFieldsContainer', 'email')
        },
        ownershipType: ownershipSelect.value,
        admins: getDynamicFieldValues('adminFieldsContainer', 'email')
      },
      pharmacy: {
        name: document.getElementById('pharmacyName').value,
        licenseNumber: document.getElementById('license').value,
        address: document.getElementById('address').value,
        contactInfo: {
          email: pharmacyEmail.value,
          phones: getDynamicFieldValues('pharmacyContactInformation', 'tel'),
          additionalEmails: getDynamicFieldValues('pharmacyContactInformation', 'email')
        },
        workingHours: document.getElementById('workingHours').value,
        deliveryOptions: getDynamicFieldValues('deliveryFieldsContainer', 'text')
      }
    };

    console.log("✅ Pharmacy Data:", JSON.stringify(pharmacyData, null, 2));
    
    form.reset();
    clearDynamicFields();
    clearValidationStyles();
    
    alert("✅ Form submitted successfully! (Check console for data)");
  });

  // ========== وظائف مساعدة ==========
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
      'pharmacyContactInformation',
      'deliveryFieldsContainer'
    ];
    
    containers.forEach(id => {
      const container = document.getElementById(id);
      if (container) container.innerHTML = '';
    });
  }

  function clearValidationStyles() {
    form.querySelectorAll('.invalid').forEach(el => {
      el.classList.remove('invalid');
    });
    
    form.querySelectorAll('.error').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }
});
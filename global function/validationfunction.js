// ==================================
// Validation Functions
// ==================================
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

function setupSelectValidation() {
  const selectInputs = document.querySelectorAll('[data-select]');
  
  selectInputs.forEach((selectEl) => {
    const errorId = selectEl.dataset.error;
    const fieldName = selectEl.dataset.label || 'This field';
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













function validateFile(inputEl, errorEl, allowedTypes) {
    if (!inputEl || !errorEl) {
        console.error('File validation elements not found');
        return false;
    }

    const file = inputEl.files[0];
    if (!file) {
        return showError(inputEl, errorEl, 'Please select a file');
    }

    const fileExt = file.name.split('.').pop().toLowerCase();
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(fileExt)) {
        return showError(inputEl, errorEl, `Only ${allowedTypes.join(', ')} files are allowed`);
    }

    if (file.size > maxSize) {
        return showError(inputEl, errorEl, 'File size should not exceed 5MB');
    }

    hideError(inputEl, errorEl);
    return true;
}

function setupFileValidation() {
    const fileInputs = document.querySelectorAll('[data-file]');
    
    fileInputs.forEach(inputEl => {
        const errorId = inputEl.dataset.error;
        const errorEl = document.getElementById(errorId);
        const allowedTypes = inputEl.dataset.allowed.split(',').map(t => t.trim());

        if (!errorEl) {
            console.warn(`Error element with ID "${errorId}" not found`);
            return;
        }

        const validate = () => validateFile(inputEl, errorEl, allowedTypes);
        inputEl.addEventListener('change', validate);
        inputEl.addEventListener('blur', validate);
    });
}


function arrayToObject(arr) {
    return arr.reduce((obj, item, index) => {
        obj[`item${index + 1}`] = item;
        return obj;
    }, {});
}

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
      'centerContactInformation',
      'departmentFields',
      'staffRoleFields',
      'affiliatedDoctorsFields'
    ];
    containers.forEach(id => {
      const container = document.getElementById(id);
      if (container) container.innerHTML = '';
    });
}

function clearValidationStyles() {
    const form = document.getElementById('Application');
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
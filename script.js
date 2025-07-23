document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('Application');
  const addPhoneBtn = document.getElementById('addPhoneBtn');
  const optionalContainer = document.getElementById('optionalFieldsContainer');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const genderSelect = document.getElementById('gender');
  const genderError = document.getElementById('genderError');
  const consultationType = document.getElementById('consultationType');
  const consultationTypeError = document.getElementById('consultationTypeError');

  // Main fields with their names (used for validation)
  const fields = [
    { id: 'name', name: 'Full Name' },
    { id: 'phone', name: 'Phone Number' },
    { id: 'bio', name: 'Short Biography' },
    { id: 'license', name: 'License Number' },
    { id: 'certificate', name: 'Registry Certificate' },
    { id: 'specialization', name: 'Specialization' },
    { id: 'experience', name: 'Years of Experience' },
    { id: 'languages', name: 'Spoken Languages' },
    { id: 'schedule', name: 'Schedule' },
    { id: 'fee', name: 'Consultation Fee' },
    { id: 'birthDate', name: 'Date of Birth' },
  ];

  // Load saved data from localStorage (if available)
  const savedData = JSON.parse(localStorage.getItem('doctorFormData')) || {};
  for (const [key, value] of Object.entries(savedData)) {
    const field = document.getElementById(key);
    if (field) field.value = value;
  }

  // Save data to localStorage on input
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', () => {
      const currentData = JSON.parse(localStorage.getItem('doctorFormData')) || {};
      currentData[input.id] = input.value;
      localStorage.setItem('doctorFormData', JSON.stringify(currentData));
    });
  });

  // Clear localStorage on form submission
  form.addEventListener('submit', () => {
    localStorage.removeItem('doctorFormData');
  });

  // Validate normal input fields
  function validateField(input, errorEl, fieldName = 'This field') {
    const value = input.value.trim();
    if (!value) {
      showError(input, errorEl, `${fieldName} cannot be empty`);
      return false;
    }
    hideError(input, errorEl);
    input.style.backgroundColor = '#e0f7fa';
    input.style.borderColor = '#4caf50';
    return true;
  }

  // Validate email format
  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) return showError(emailInput, emailError, 'Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return showError(emailInput, emailError, 'Invalid email format');
    hideError(emailInput, emailError);
    return true;
  }

  // Validate select (dropdown) inputs
  function validateSelect(select, errorEl, fieldName = 'This field') {
    if (!select.value) {
      showError(select, errorEl, `Please select ${fieldName}`);
      return false;
    }
    hideError(select, errorEl);
    return true;
  }

  // Show error message
  function showError(input, errorEl, message) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    input.classList.add('invalid');
    return false;
  }

  // Hide error message
  function hideError(input, errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
    input.classList.remove('invalid');
  }

  // Support adding multiple phone numbers
  let phoneCounter = 1;
  addPhoneBtn.addEventListener('click', () => {
    phoneCounter++;
    const phoneWrapper = document.createElement('div');
    phoneWrapper.classList.add('phone-entry');
    phoneWrapper.innerHTML = `
      <label for="phone${phoneCounter}">Phone Number ${phoneCounter}</label>
      <input type="tel" id="phone${phoneCounter}" name="phone" placeholder="+249 000 000 000" />
      <span class="error" id="phoneError${phoneCounter}"></span>
    `;
    optionalContainer.appendChild(phoneWrapper);
  });

  // Trigger validation on blur and input
  fields.forEach(({ id, name }) => {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(id + 'Error');
    if (input && errorEl) {
      input.addEventListener('blur', () => validateField(input, errorEl, name));
      input.addEventListener('input', () => validateField(input, errorEl, name));
    }
  });

  emailInput.addEventListener('blur', validateEmail);
  emailInput.addEventListener('input', validateEmail);
  genderSelect.addEventListener('change', () => validateSelect(genderSelect, genderError, 'Gender'));
  consultationType.addEventListener('change', () => validateSelect(consultationType, consultationTypeError, 'Consultation Type'));

  // Handle form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    const phones = Array.from(document.querySelectorAll('input[name="phone"]'))
      .map(input => input.value.trim())
      .filter(value => value); // Ignore empty inputs

    const doctorData = {
      fullName: document.getElementById('name').value,
      gender: genderSelect.value,
      dateOfBirth: document.getElementById('birthDate').value,
      address: "", // Optional: can be added later
      contactInformation: {
        email: emailInput.value,
        phones
      },
      shortBiography: document.getElementById('bio').value.trim(),
      medicalLicenseNumber: document.getElementById('license').value.trim(),
      registryCertificate: document.getElementById('certificate').value.trim(),
      specialization: document.getElementById('specialization').value.trim(),
      yearsOfExperience: document.getElementById('experience').value,
      spokenLanguages: document.getElementById('languages').value.trim(),
      consultationType: consultationType.value,
      schedule: document.getElementById('schedule').value.trim(),
      consultationFee: document.getElementById('fee').value
    };

    const jsonData = {
      doctor: doctorData
    };

    console.log("✅ User Data:", JSON.stringify(jsonData, null, 2));

    localStorage.removeItem('doctorFormData');
    form.reset();

    fields.forEach(({id}) => {
      const field = document.getElementById(id);
      if (field) {
        field.style.backgroundColor = '';
        field.style.borderColor = '';
        field.classList.remove('invalid');
      }
    });

    emailInput.style.backgroundColor = '';
    emailInput.style.borderColor = '';
    emailInput.classList.remove('invalid');

    genderSelect.classList.remove('invalid');
    consultationType.classList.remove('invalid');
    genderError.textContent = '';
    consultationTypeError.textContent = '';
    emailError.textContent = '';

    alert("Data saved successfully! (Check the console)");
  });
});

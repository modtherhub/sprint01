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

  // الحقول الأساسية مع أسمائها بالعربية لأغراض التحقق
  const fields = [
    { id: 'name', name: 'الاسم' },
    { id: 'phone', name: 'رقم الهاتف' },
    { id: 'bio', name: 'السيرة الذاتية' },
    { id: 'license', name: 'رقم الترخيص' },
    { id: 'certificate', name: 'شهادة التسجيل' },
    { id: 'specialization', name: 'التخصص' },
    { id: 'experience', name: 'سنوات الخبرة' },
    { id: 'languages', name: 'اللغات المتحدث بها' },
    { id: 'schedule', name: 'الجدول الزمني' },
    { id: 'fee', name: 'رسوم الاستشارة' },
    { id: 'birthDate', name: 'تاريخ الميلاد' },
  ];

  // 🟢 إعادة تحميل البيانات من التخزين المحلي إن وُجدت
  const savedData = JSON.parse(localStorage.getItem('doctorFormData')) || {};
  for (const [key, value] of Object.entries(savedData)) {
    const field = document.getElementById(key);
    if (field) field.value = value;
  }

  // 🟡 حفظ البيانات إلى localStorage عند الكتابة
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', () => {
      const currentData = JSON.parse(localStorage.getItem('doctorFormData')) || {};
      currentData[input.id] = input.value;
      localStorage.setItem('doctorFormData', JSON.stringify(currentData));
    });
  });

  // 🧹 حذف البيانات عند إرسال الفورم
  form.addEventListener('submit', () => {
    localStorage.removeItem('doctorFormData');
  });

  // ✅ التحقق من الحقول العادية
  function validateField(input, errorEl, fieldName = 'هذا الحقل') {
    const value = input.value.trim();
    if (!value) {
      showError(input, errorEl, `${fieldName} لا يمكن أن يكون فارغًا`);
      return false;
    }
    hideError(input, errorEl);
    input.style.backgroundColor = '#e0f7fa';
    input.style.borderColor = '#4caf50';
    return true;
  }

  // ✅ التحقق من البريد الإلكتروني
  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) return showError(emailInput, emailError, 'لا يمكن أن يكون هذا الحقل فارغًا');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return showError(emailInput, emailError, 'البريد الإلكتروني غير صالح');
    hideError(emailInput, emailError);
    return true;
  }

  // ✅ التحقق من القوائم المنسدلة
  function validateSelect(select, errorEl, fieldName = 'هذا الحقل') {
    if (!select.value) {
      showError(select, errorEl, `يرجى اختيار ${fieldName}`);
      return false;
    }
    hideError(select, errorEl);
    return true;
  }

  // ❌ إظهار رسالة الخطأ
  function showError(input, errorEl, message) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    input.classList.add('invalid');
    return false;
  }

  // ✅ إخفاء رسالة الخطأ
  function hideError(input, errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
    input.classList.remove('invalid');
  }

  // 📱 دعم إضافة أكثر من رقم هاتف
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

  // ⚙️ تفعيل التحقق عند الكتابة أو فقدان التركيز
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
  genderSelect.addEventListener('change', () => validateSelect(genderSelect, genderError, 'الجنس'));
  consultationType.addEventListener('change', () => validateSelect(consultationType, consultationTypeError, 'نوع الاستشارة'));

  // 📤 معالجة إرسال البيانات
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // إيقاف الإرسال التلقائي

    const phones = Array.from(document.querySelectorAll('input[name="phone"]'))
      .map(input => input.value.trim())
      .filter(value => value); // تجاهل الفارغ

    const doctorData = {
      fullName: document.getElementById('name').value,
      gender: genderSelect.value,
      dateOfBirth: document.getElementById('birthDate').value,
      address: "", // يمكن إضافته لاحقًا
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

    alert("✅ تم حفظ البيانات! (انظر الكونسول)");
  });
});
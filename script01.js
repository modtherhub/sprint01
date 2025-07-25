


form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent actual form submission
    let isValid = true;

    // 1. تحقق من الحقول الأساسية (الموجودة ضمن fields)
    fields.forEach(({ id, name }) => {
      const input = document.getElementById(id);
      const errorEl = document.getElementById(id + 'Error');
      if (input && errorEl) {
        isValid = validateField(input, errorEl, name) && isValid;
      }
    });

    // 2. تحقق من كل حقول البريد الإلكتروني الديناميكية
    document.querySelectorAll('[data-email]').forEach(inputEl => {
        const errorId = inputEl.dataset.error;
        const errorEl = document.getElementById(errorId);
        if (inputEl && errorEl) {
            isValid = validateEmail(inputEl, errorEl) && isValid;
        }
    });

    // 3. تحقق من كل حقول select الديناميكية
    document.querySelectorAll('[data-select]').forEach(selectEl => {
        const errorId = selectEl.dataset.error;
        const fieldName = selectEl.dataset.label || 'This field';
        const errorEl = document.getElementById(errorId);
        if (selectEl && errorEl) {
            isValid = validateSelect(selectEl, errorEl, fieldName) && isValid;
        }
    });

    // إذا لم يكن التحقق صحيحاً، أبلغ المستخدم ومرر إليه أول خطأ
    if (!isValid) {
        // ابحث عن أول عنصر عليه خطأ ومرر إليه
        const firstError = document.querySelector('.invalid');
        if (firstError) {
            firstError.scrollIntoView({behavior: 'smooth', block: 'center'});
            firstError.focus();
        }
        alert("⚠️ يوجد أخطاء في تعبئة البيانات — يرجى مراجعة الحقول باللون الأحمر.");
        return;
    }

    // ـــــ بعد التحقق، تكمل الإجراءات كالمعتاد ــــ
    // جهّز بيانات العيادة (مثال توضيحي):
    const centerData = {
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
        name: document.getElementById('centerName')?.value || '',
        licenseNumber: document.getElementById('license')?.value || '',
        address: document.getElementById('centerAddress')?.value || '',
        contactInfo: {
            email: clinicEmail?.value || '',
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
        },
       /*  facilityAccreditationDoc: document.getElementById('facilityAccreditationDoc')?.files[0]?.name || '',
        safetyAndQuslityCertificate: document.getElementById('safetyAndQuslityCertificate')?.files[0]?.name || ''
  */   }
}; // اجمع بياناتك هنا حسب الحاجة
    
    console.log("✅ Clinic Data:", JSON.stringify(centerData, null, 2));
    form.reset();
    clearDynamicFields();
    clearValidationStyles();
    alert("✅ تم إرسال النموذج بنجاح! (راجع الكونسول)");
});
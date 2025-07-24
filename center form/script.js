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

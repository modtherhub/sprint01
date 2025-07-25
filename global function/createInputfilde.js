function createInputField(containerId, type, labelText, placeholder, isRequired, counter) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const fieldId = `${type}${counter}`;
  const fieldWrapper = document.createElement('div');
  fieldWrapper.classList.add('field-entry'); 
  
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
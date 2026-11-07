export function validateFields(event) {
  const fields = document.querySelectorAll(".fields input, .fields textarea");
  for (const field of fields) {
    field.setCustomValidity(
      field.required && field.type !== "checkbox" && !field.value.trim()
        ? "Preencha este campo para continuar."
        : ""
    );
    if (!field.checkValidity()) {
      event.preventDefault();
      field.reportValidity();
      return;
    }
  }
}

import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateValidator(control: AbstractControl): ValidationErrors | null {
  const today = new Date();
  const selectedDate = new Date(control.value);

  // Ensure the selected date is not in the past
  if (selectedDate < today) {
    return { pastDate: true };
  }

  // Ensure the selected date is a weekday (Monday to Friday)
  const dayOfWeek = selectedDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { weekend: true };
  }

  return null; // If validation passes, return null
}

import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateValidator(control: AbstractControl): ValidationErrors | null {
  const today = new Date();


  const selectedDate = new Date(control.value);

  if (isNaN(selectedDate.getTime())) {
    return { invalidDate: 'La date est invalide.' };
  }


  if (selectedDate >= today) {
    return { invalidDate: 'La date ne peut pas être dans le futur.' };
  }

  return null; 
}

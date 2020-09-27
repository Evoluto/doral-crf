import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function toDecimalPoint(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) return null;
    const decimalPart = value.split('.')[1];

    if (!decimalPart) return null;

    if (decimalPart.length > 2) {
      return { 'TDPErr': true }
    }

  }

}

import {Injectable} from '@angular/core';
import {FormFieldConstants} from '../constants/constants';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormFieldsValidatingStatusService {

  formFieldConstants: typeof FormFieldConstants = FormFieldConstants;

  constructor() {
  }

  public static getErrorMessage(form: FormGroup, field: FormFieldConstants) {
    switch (field) {
      case FormFieldConstants.EMAIL:
        return form.controls.email.hasError('required') ? 'You must enter a valid Email' :
          form.controls.email.hasError('email') ? 'Not a valid email' : 'Your Email';

      case FormFieldConstants.PASSWORD:
        return form.controls.password.hasError('required') ? 'You must enter a valid password' :
          form.controls.password.hasError('minlength') ? 'Password is should be at least 8 characters' : 'Your Password';

    }
  }
}

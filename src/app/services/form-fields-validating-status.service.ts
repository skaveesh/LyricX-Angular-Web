import {Injectable} from '@angular/core';
import {LoginFieldsValidatingStatus} from '../constants/constants';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormFieldsValidatingStatusService {

  constructor() {
  }

  public static getErrorMessage(form: FormGroup, field: LoginFieldsValidatingStatus) {
    switch (field) {
      case LoginFieldsValidatingStatus.EMAIL:
        return form.controls.email.hasError('required') ? 'You must enter a valid Email' :
          form.controls.email.hasError('email') ? 'Not a valid email' : 'Your Email';

      case LoginFieldsValidatingStatus.PASSWORD:
        return form.controls.password.hasError('required') ? 'You must enter a valid password' :
          form.controls.password.hasError('minlength') ? 'Password is should be at least 8 characters' : 'Your Password';

    }
  }
}

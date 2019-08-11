import {Injectable} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {Constants} from '../constants/constants';
import FormFieldConstants = Constants.FormFieldConstants;

@Injectable({
  providedIn: 'root'
})
export class FormFieldsValidatingStatusService {

  constructor() {
  }

  public static getErrorMessage(formAbstractController: AbstractControl, field: FormFieldConstants) {
    switch (field) {

      case FormFieldConstants.NAME:
        return formAbstractController.hasError('required') ? 'You must enter your name' :
          formAbstractController.hasError('minlength') ? 'Should be at least 3 characters' :
            formAbstractController.hasError('pattern') ? 'Should only contains letters' : 'Your Name';

      case FormFieldConstants.EMAIL:
        return formAbstractController.hasError('required') ? 'You must enter a valid Email' :
          formAbstractController.hasError('email') ? 'Not a valid email' : 'Your Email';

      case FormFieldConstants.PASSWORD:
        return formAbstractController.hasError('required') ? 'You must enter a valid password' :
          formAbstractController.hasError('minlength') ? 'Password is should be at least 8 characters long' : 'Your Password';

    }
  }
}

import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {DefaultSnackBarComponent} from '../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormFieldsValidatingStatusService} from '../../../../services/form-fields-validating-status.service';
import {Constants} from '../../../../constants/constants';

@Component({
  selector: 'app-my-profile-tab',
  templateUrl: './my-profile-tab.component.html',
  styleUrls: ['./my-profile-tab.component.css']
})
export class MyProfileTabComponent implements OnInit {

  public constants = Constants;

  public FormFieldsValidatingStatusService = FormFieldsValidatingStatusService;

  nameChangingForm: FormGroup;

  constructor(public afAuth: AngularFireAuth, private defaultSnackBar: DefaultSnackBarComponent, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.nameChangingForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-z]+$/i)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-z]+$/i)]]
    });
  }

  private changePassword() {
    // this.afAuth.auth.sendPasswordResetEmail("skaveesh@gmail.com");
    this.defaultSnackBar.openSnackBar('Password reset'); // E-Mail has been sent your inbox.
  }

  private changeUserName() {
    this.afAuth.auth.currentUser.updateProfile({
      displayName: this.nameChangingForm.controls.firstName.value + ' ' + this.nameChangingForm.controls.lastName.value
    }).then(() => {
      this.defaultSnackBar.openSnackBar('Name has been changed.');
    }).catch((error) => {
      this.defaultSnackBar.openSnackBar('Something went wrong. ' + error.toString());
    });
  }

}

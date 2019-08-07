import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {DefaultSnackBarComponent} from '../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {User} from 'firebase';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginFieldsValidatingStatus} from '../../../../constants/constants';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  nameChangingForm : FormGroup;

  constructor(public afAuth: AngularFireAuth, private defaultSnackBar: DefaultSnackBarComponent, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.nameChangingForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  private changePassword() {
    // this.afAuth.auth.sendPasswordResetEmail("skaveesh@gmail.com");
    this.defaultSnackBar.openSnackBar('Password reset E-Mail has been sent your inbox.');
  }

  private changeUserName(name: string) {
    this.afAuth.auth.currentUser.updateProfile({
      displayName: name
    }).then(() => {
      this.defaultSnackBar.openSnackBar('Name has been changed.');
    }).catch((error) => {
      this.defaultSnackBar.openSnackBar('Something went wrong. ' + error.toString());
    });
  }

  //todo
  // getErrorMessage(field: NameChangingFieldsValidatingStatus) {
  //   switch (field) {
  //     case LoginFieldsValidatingStatus.EMAIL:
  //       return this.loginForm.controls.email.hasError('required') ? 'You must enter a valid Email' :
  //         this.loginForm.controls.email.hasError('email') ? 'Not a valid email' : 'Your Email';
  //
  //     case LoginFieldsValidatingStatus.PASSWORD:
  //       return this.loginForm.controls.password.hasError('required') ? 'You must enter a valid password' :
  //         this.loginForm.controls.password.hasError('minlength') ? 'Password is should be at least 8 characters' : 'Your Password';
  //
  //   }
  // }

}

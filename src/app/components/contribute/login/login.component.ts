import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {LoadingStatusService} from '../../../services/loading-status.service';
import {FormFieldsValidatingStatusService} from '../../../services/form-fields-validating-status.service';
import {Constants} from '../../../constants/constants';
import {Router} from '@angular/router';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public constants = Constants;

  public FormFieldsValidatingStatusService = FormFieldsValidatingStatusService;

  loginForm: FormGroup;
  loginFormSubmitted = false;

  hidePasswordStatus = true;
  token: string;

  constructor(public afAuth: AngularFireAuth, private formBuilder: FormBuilder, private router: Router, private loadingStatus: LoadingStatusService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  createAnAccount() {
    this.loadingStatus.startLoading();

    setTimeout(() => {
      this.loadingStatus.stopLoading();
    }, 5000);
  }

  onSubmit() {
    this.loginFormSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.login();
  }

  login() {

    this.loadingStatus.startLoading();

    this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
      .then((res) => {
        console.log(res.additionalUserInfo);
        console.log(res.credential);
        console.log(res.operationType);
        this.token = res.user.refreshToken;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {

        const redirectTo = sessionStorage.getItem(Constants.Session.AFTER_LOGIN_PATH_KEY);
        sessionStorage.removeItem(Constants.Session.AFTER_LOGIN_PATH_KEY);

        if (isNotNullOrUndefined(redirectTo) && redirectTo.length !== 0) {
          this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + redirectTo);
        } else {
          this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.CONTRIBUTE);
        }

        this.loadingStatus.stopLoading();
      });
  }

}

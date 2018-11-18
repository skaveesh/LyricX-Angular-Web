import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.css']
})
export class ContributeComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth) { }

  email: string;
  password: string;
  token: string;
  forceToken: string;
  emailVerifyText = 'Verify your email';
  ngOnInit() {
  }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then((res) => {
        console.log(res.additionalUserInfo);
        console.log(res.credential);
        console.log(res.operationType);
        this.token = res.user.refreshToken;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  refreshToken(forceRefresh: boolean) {
    this.afAuth.auth.currentUser.getIdToken(forceRefresh).then((res) => {
      this.forceToken = res;
    }).catch((error) => {
      console.log(error);
    });
  }

  sendEmailConfirmation() {
    this.afAuth.auth.currentUser.sendEmailVerification().then((res) => {
      this.emailVerifyText = 'Verification E-Mail sent to your inbox.';
    }).catch((error) => {
      console.log(error);
      this.emailVerifyText = 'Verify your email';
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}

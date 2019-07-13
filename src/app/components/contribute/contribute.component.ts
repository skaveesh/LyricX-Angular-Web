import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {LoadingStatusService} from '../../services/loading-status.service';

@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.css']
})
export class ContributeComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private loadingStatus:LoadingStatusService) {
  }

  token: string;
  forceToken: string;
  emailVerifyText = 'Verify your email';

  ngOnInit() {
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

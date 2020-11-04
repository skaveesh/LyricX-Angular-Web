import {AfterViewInit, Component} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {LoadingStatusService} from '../../services/loading-status.service';
import {Router} from '@angular/router';
import {Constants} from '../../constants/constants';

@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.css']
})
export class ContributeComponent implements AfterViewInit {

  constructor(public afAuth: AngularFireAuth, private router: Router, private loadingStatus: LoadingStatusService) {
    loadingStatus.startLoading();
  }

  token: string;
  forceToken: string;
  emailVerifyText = 'Verify your email';

  ngAfterViewInit() {
    this.afAuth.user.subscribe(()=>{
      this.loadingStatus.stopLoading();
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
    this.router.navigateByUrl(Constants.FORWARD_SLASH + Constants.Routes.LOGIN );
  }
}

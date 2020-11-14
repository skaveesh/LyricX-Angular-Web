import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Constants} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class UserAuthorizationService {

  public token: string;
  public forceToken: string;
  public emailVerifyText = 'Verify your email';

  constructor(public afAuth: AngularFireAuth, private router: Router) { }

  public getUser(): Observable<firebase.User> {
    return this.afAuth.user;
  }

  getRefreshToken(forceRefresh: boolean) {
    this.afAuth.auth.currentUser.getIdToken(forceRefresh).then((res) => {
      this.forceToken = res;
      sessionStorage.setItem(Constants.Session.USER_TOKEN, res);
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

  signInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.LOGIN );
    sessionStorage.clear();
  }
}

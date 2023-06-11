import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {Constants} from '../../constants/constants';
import {first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAuthorizationService {

  public token: string;
  public forceToken: string;
  public emailVerifyText = 'Verify your email';
  public isLoggedOut = new BehaviorSubject<boolean>(null);

  constructor(public afAuth: AngularFireAuth, private router: Router) {
    this.getUser().pipe(first()).toPromise().then((res) => {
      if (res !== null) {
        this.getRefreshToken(true);
      } else {
        this.logout(false);
      }
    }).catch(error => {
      console.error('Error fetching the user.');
      this.logout(true);
    });
  }

  public getUser(): Observable<firebase.User> {
    return this.afAuth.user;
  }

  public getRefreshToken(forceRefresh: boolean): Promise<void> {
    return this.afAuth.auth.currentUser.getIdToken(forceRefresh).then((res) => {
      this.forceToken = res;
      sessionStorage.setItem(Constants.Session.USER_TOKEN, res);
      this.isLoggedOut.next(false);
    }).catch((error) => {
      this.isLoggedOut.next(true);
      console.error(error);
    });
  }

  sendEmailConfirmation() {
    this.afAuth.auth.currentUser.sendEmailVerification().then((res) => {
      this.emailVerifyText = 'Verification E-Mail sent to your inbox.';
    }).catch((error) => {
      console.error(error);
      this.emailVerifyText = 'Verify your email';
    });
  }

  signInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    const userCredential: Promise<firebase.auth.UserCredential> = this.afAuth.auth.signInWithEmailAndPassword(email, password);

    userCredential.then(() => this.isLoggedOut.next(false))
      .catch(() => this.isLoggedOut.next(true));

    return userCredential;
  }

  logout(navigateToLogin: boolean) {
    this.afAuth.auth.signOut().then((res) => {
      this.isLoggedOut.next(true);

      if (navigateToLogin) {
        this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.LOGIN );
      }

      sessionStorage.clear();
    }).catch((err) => {
      this.isLoggedOut.next(true);
      console.error(err);
    });
  }
}

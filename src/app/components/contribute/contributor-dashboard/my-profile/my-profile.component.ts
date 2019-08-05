import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {DefaultSnackBarComponent} from '../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {User} from 'firebase';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private defaultSnackBar: DefaultSnackBarComponent) {
  }

  ngOnInit() {
  }

  private changePassword() {
    // this.afAuth.auth.sendPasswordResetEmail("skaveesh@gmail.com");
    this.defaultSnackBar.openSnackBar('Password reset E-Mail has been sent your inbox.');
  }

  private changeUserName(name: String) {
    this.afAuth.auth.currentUser.updateProfile({
      displayName: 'John Doe'
    }).catch((error) => {
      this.defaultSnackBar.openSnackBar('Something went wrong. ' + error.toString());
    });
  }

}

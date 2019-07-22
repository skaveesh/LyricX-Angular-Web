import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatSnackBar} from '@angular/material';
import {DefaultSnackBarComponent} from '../../../popups-and-modals/default-snack-bar/default-snack-bar.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private defaultSnackBar : DefaultSnackBarComponent, private snackBar:MatSnackBar ) {
  }

  ngOnInit() {
  }

  private changePassword() {
    // this.afAuth.auth.sendPasswordResetEmail("skaveesh@gmail.com");
    // this.defaultSnackBar.openSnackBar("Password reset E-Mail has sent your inbox.");
    this.openSnackBar("Password reset E-Mail has sent your inbox.");
  }

  private openSnackBar(message: string){
    this.snackBar.openFromComponent(DefaultSnackBarComponent,{
      data: message,
      duration:3000
    });
  }

}

import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  private changePassword() {
    this.afAuth.auth.sendPasswordResetEmail("skaveesh@gmail.com");
    this.openSnackBar("Password reset E-Mail has sent your inbox.");
  }

  private openSnackBar(message: string){
    this.snackBar.open(message,null,{
      duration:3000
    });
  }

}

import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-default-snack-bar',
  templateUrl: './default-snack-bar.component.html',
  styleUrls: ['./default-snack-bar.component.css']
})
export class DefaultSnackBarComponent implements OnInit {

  private message : string;

  constructor() { }

  ngOnInit() {
  }

  // public openSnackBar(message : string){
  //   this.message = message;
  //   this.snackBar.openFromComponent(DefaultSnackBarComponent,{
  //     duration:3000
  //   });
  // }

}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material';
import {SnackbarData} from '../../../dto/snackbar';

@Component({
  selector: 'app-default-snack-bar',
  templateUrl: './default-snack-bar.component.html',
  styleUrls: ['./default-snack-bar.component.css']
})
export class DefaultSnackBarComponent implements OnInit {

  constructor(public snackBar: MatSnackBar, @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData) {
  }

  ngOnInit() {
  }

  public openSnackBar(message: string, isWarn: boolean = false) {

    const data: SnackbarData = {
      message: message,
      isWarn: isWarn
    };

    this.snackBar.openFromComponent(DefaultSnackBarComponent, {
      duration: 3000,
      data: data,
      panelClass: ['center-align-text', isWarn ? 'red-snackbar' : 'white-snackbar']
    });
  }

}

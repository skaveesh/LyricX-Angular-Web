import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-default-snack-bar',
  templateUrl: './default-snack-bar.component.html',
  styleUrls: ['./default-snack-bar.component.css']
})
export class DefaultSnackBarComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, @Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  ngOnInit() {
  }

  public openSnackBar(message: string) {
    this.snackBar.openFromComponent(DefaultSnackBarComponent, {
      duration: 3000,
      data: message
    });
  }

}

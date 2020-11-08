import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-contributor-dashboard',
  templateUrl: './contributor-dashboard.component.html',
  styleUrls: ['./contributor-dashboard.component.css']
})
export class ContributorDashboardComponent implements OnInit, AfterViewInit {
 tab: number;
  constructor() {
    this.tab = 0;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setInterval(() => {
      this.tab = 1;
    }, 1000);
  }

}

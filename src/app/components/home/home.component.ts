import {Component, OnInit} from '@angular/core';
import {LoadingStatusService} from '../../services/loadingstatus.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(private loadingStatus: LoadingStatusService) {
  }

  ngOnInit() {
  }

}


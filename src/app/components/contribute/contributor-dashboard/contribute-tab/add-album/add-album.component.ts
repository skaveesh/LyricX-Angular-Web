import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Constants} from '../../../../../constants/constants';

@Component({
  selector: 'app-add-album',
  templateUrl: './add-album.component.html',
  styleUrls: ['./add-album.component.css']
})
export class AddAlbumComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  backToContributor() {
    this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.CONTRIBUTE);
  }
}

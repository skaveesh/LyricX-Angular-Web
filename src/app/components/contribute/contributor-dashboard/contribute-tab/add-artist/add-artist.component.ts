import {Component, OnInit} from '@angular/core';
import {Constants} from '../../../../../constants/constants';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-artist',
  templateUrl: './add-artist.component.html',
  styleUrls: ['./add-artist.component.css']
})
export class AddArtistComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  backToContributor() {
    this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.CONTRIBUTE);
  }
}

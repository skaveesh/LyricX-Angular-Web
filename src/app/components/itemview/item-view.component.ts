import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ContributorUtilService} from '../../services/contributor-util.service';
import {SongAdapterService} from '../../services/rest/song-adapter.service';
import {Constants} from '../../constants/constants';
import {AlbumAdapterService} from '../../services/rest/album-adapter.service';
import {ArtistAdapterService} from '../../services/rest/artist-adapter.service';

@Component({
  selector: 'app-itemview',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {

  private _item: string;
  private _itemSurrogateKey: string;

  constructor(private router: Router, private route: ActivatedRoute, private contributorUtilService: ContributorUtilService,
              private songAdapterService: SongAdapterService, private albumAdapterService: AlbumAdapterService,
              private artistAdapterService: ArtistAdapterService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.route.params.subscribe(params => {
      this._item = params['item'];
      this._itemSurrogateKey = params['item-surrogate-key'];
    });
  }

  ngOnInit() {
    if (this._item === 'song') {
      this.songAdapterService.getSong(this._itemSurrogateKey, true).subscribe(res => {
        this.contributorUtilService.sendSongViewData(res.data);
      }, error => {
        this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.ERROR);
      });
    } else if (this._item === 'album') {
      this.albumAdapterService.getAlbum(this._itemSurrogateKey, true).subscribe(res => {
        this.contributorUtilService.sendAlbumViewData(res.data);
      }, error => {
        this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.ERROR);
      });
    } else if (this._item === 'artist') {
      this.artistAdapterService.getArtist(this._itemSurrogateKey, true).subscribe(res => {
        this.contributorUtilService.sendArtistViewData(res.data);
      }, error => {
        this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.ERROR);
      });
    } else {
      this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.ERROR);
    }
  }

  get item(): string {
    return this._item;
  }
}

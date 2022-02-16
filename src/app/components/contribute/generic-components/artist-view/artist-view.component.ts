import { Component } from '@angular/core';
import {ContributorUtilService} from '../../../../services/contributor-util.service';
import {filter, mergeMap, toArray} from 'rxjs/operators';
import {LoadingStatusService} from '../../../../services/loading-status.service';
import {DefaultSnackBarComponent} from '../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {ArtistResponseData} from '../../../../dto/artist';
import {UtilService} from '../../../../services/util.service';
import {GenreAdapterService} from '../../../../services/rest/genre-adapter.service';
import {Router} from '@angular/router';
import {AlbumAdapterService} from '../../../../services/rest/album-adapter.service';
import {forkJoin, from} from 'rxjs';
import {AlbumResponseData} from '../../../../dto/album';
import {Constants} from '../../../../constants/constants';

@Component({
  selector: 'app-artist-view',
  templateUrl: './artist-view.component.html',
  styleUrls: ['./artist-view.component.css']
})
export class ArtistViewComponent {

  private _artistResponseData: ArtistResponseData = null;
  private _genreNameListOfTheArtist: string[] = [];
  private _albumNameListOfTheArtist: AlbumResponseData[] = [];

  constructor(private router: Router, private contributorUtilService: ContributorUtilService, private genreAdapterService: GenreAdapterService,
              private albumAdapterService: AlbumAdapterService, private loadingStatusService: LoadingStatusService,
              private snackBarComponent: DefaultSnackBarComponent) {

    this.contributorUtilService.getArtistViewData$()
      .pipe(filter(res => res !== null))
      .subscribe((res) => {
        this._artistResponseData = res;
        this.initGenre(res.genreIdList);
        this.initAlbums(res.albumsSurrogateKeyList);
      }, () => {
        this.snackBarComponent.openSnackBar('Error while loading album data', true);
      });
  }

  private initGenre(genreIdList: number[]) {
    this.genreAdapterService.initializeGenre(genreIdList, this._genreNameListOfTheArtist);
  }

  private initAlbums(albumsSurrogateKeyList: string[]) {

    this._albumNameListOfTheArtist.splice(0);

    from(albumsSurrogateKeyList)
      .pipe(
        toArray(),
        mergeMap(project => {
          const observables = project.map(albumSurrogateKey => this.albumAdapterService.getAlbum(albumSurrogateKey, false));
          return forkJoin(observables);
        }),
      ).subscribe(res => {

      res.forEach(album => {
        this._albumNameListOfTheArtist.push(album.data);
      });
    });
  }

  get artistData(): ArtistResponseData {
    return this._artistResponseData;
  }

  get genreNameListOfTheArtist(): string[] {
    return this._genreNameListOfTheArtist;
  }

  get albumNameListOfTheArtist(): AlbumResponseData[] {
    return this._albumNameListOfTheArtist;
  }

  constructArtistImageUrl(imgUrl: string): string {
    return UtilService.constructArtistImageResourceUrl(imgUrl);
  }

  constructAlbumArtUrl(imgUrl: string): string {
    return UtilService.constructAlbumArtResourceUrl(imgUrl);
  }

  public navigateToAlbum ($event) {
    this.router.navigateByUrl( Constants.Route.ALBUM + Constants.Symbol.FORWARD_SLASH + $event.data);
  }

  public copyAlbumUrl ($event) {
    try {
      UtilService.copyToClipboard(location.origin + Constants.Symbol.FORWARD_SLASH + Constants.Route.ALBUM + Constants.Symbol.FORWARD_SLASH + $event.data);
      this.snackBarComponent.openSnackBar('Item copied');
    } catch (e) {
      this.snackBarComponent.openSnackBar('Error coping the item', true);
    }
  }

  private editArtist($event) {
    this.contributorUtilService.sendArtistEditData($event.data);
    this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.ADD_ARTIST);
  }

}

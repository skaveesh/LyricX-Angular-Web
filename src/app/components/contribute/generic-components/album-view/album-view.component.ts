import {Component} from '@angular/core';
import {AlbumResponseData} from '../../../../dto/album';
import {Router} from '@angular/router';
import {ContributorUtilService} from '../../../../services/contributor-util.service';
import {LoadingStatusService} from '../../../../services/loading-status.service';
import {DefaultSnackBarComponent} from '../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {filter, first, map, mergeMap} from 'rxjs/operators';
import {from} from 'rxjs';
import {UtilService} from '../../../../services/util.service';
import {Constants} from '../../../../constants/constants';
import {SongAdapterService} from '../../../../services/rest/song-adapter.service';
import {SongResponseData,  SongWithArtistList} from '../../../../dto/song';
import {ArtistAdapterService} from '../../../../services/rest/artist-adapter.service';
import {ArtistResponseData} from '../../../../dto/artist';

@Component({
  selector: 'app-album-view',
  templateUrl: './album-view.component.html',
  styleUrls: ['./album-view.component.css']
})
export class AlbumViewComponent {


  private _albumResponseData: AlbumResponseData = null;
  private _artistResponseData: ArtistResponseData = null;
  private _songWithArtistList: SongWithArtistList[] = [];

  constructor(private router: Router, private contributorUtilService: ContributorUtilService, private songAdapterService: SongAdapterService, private artistAdapterService: ArtistAdapterService,
              private loadingStatusService: LoadingStatusService, private snackBarComponent: DefaultSnackBarComponent) {

    this.contributorUtilService.getAlbumViewData$()
      .pipe(filter(res => res !== null))
      .subscribe(res => {
        this._albumResponseData = res;
        this.initArtist(res.artistSurrogateKey);
        this.initSongs(res.songsSurrogateKeys);
      }, () => {
        this.snackBarComponent.openSnackBar('Error while loading album data', true);
      });
  }

  private initArtist(artistSurrogateKey: string) {
    this.artistAdapterService.getArtist(artistSurrogateKey, false)
      .pipe(filter(res => res !== null), first())
      .subscribe(res => {
        this._artistResponseData = res.data;
      }, () => this.snackBarComponent.openSnackBar('Error while loading album data', true));
  }

  private initSongs(songSurrogateKeyList: string[]) {

    this._songWithArtistList.splice(0);

    from(songSurrogateKeyList).pipe(
      map(songSurrogateKey => {
        const songWithArtistList: SongWithArtistList = {} as SongWithArtistList;
        songWithArtistList.song = {} as SongResponseData;
        songWithArtistList.artistList = [] as ArtistResponseData[];
        songWithArtistList.song.surrogateKey = songSurrogateKey;
        return songWithArtistList;
      }),
      mergeMap(project => this.songAdapterService.getSong(project.song.surrogateKey, false)
        .pipe(
          map(song => {
            project.song = song.data;
            song.data.artistSurrogateKeyList.forEach(artistSurrogateKey => {
              const artistResponseData = {} as ArtistResponseData;
              artistResponseData.surrogateKey = artistSurrogateKey;
              this.artistAdapterService.getArtist(artistSurrogateKey, false)
                .subscribe(res => project.artistList.push(res.data));
            });

            return project;
          }))))
      .subscribe(songWithArtistListIncludedSongAndArtistList => {
        this._songWithArtistList.push(songWithArtistListIncludedSongAndArtistList);
      }, (error) => {
        console.error(error);
        this.snackBarComponent.openSnackBar('Error fetching data', true);
      }, () => this.loadingStatusService.stopLoading());
  }


  get albumData(): AlbumResponseData {
    return this._albumResponseData;
  }

  get artistResponseData(): ArtistResponseData {
    return this._artistResponseData;
  }

  get songWithArtistList(): SongWithArtistList[] {
    return this._songWithArtistList;
  }

  constructAlbumArtImageUrl(imgUrl: string): string {
    return UtilService.constructAlbumArtResourceUrl(imgUrl);
  }

  constructSongAlbumArtUrl(imgUrl: string): string {
    return UtilService.constructSongAlbumArtResourceUrl(imgUrl);
  }

  public navigateToSong ($event) {
    this.router.navigateByUrl( Constants.Route.SONG + Constants.Symbol.FORWARD_SLASH + $event.data);
  }

  public navigateToArtist ($event) {
    this.router.navigateByUrl( Constants.Route.ARTIST + Constants.Symbol.FORWARD_SLASH + $event.data);
  }

  public copySongUrl ($event) {
    try {
      UtilService.copyToClipboard(location.origin + Constants.Symbol.FORWARD_SLASH + Constants.Route.SONG + Constants.Symbol.FORWARD_SLASH + $event.data);
      this.snackBarComponent.openSnackBar('Item copied');
    } catch (e) {
      this.snackBarComponent.openSnackBar('Error coping the item', true);
    }
  }

  getArtistListAsACommaSeparatedList(mainArtistName, artistList: ArtistResponseData[]): string {

    let artistString = '';

    artistList.forEach((artist, index) => {
      artistString = artistString.concat(artist.name);
      if (index !== artistList.length - 1) {
        artistString = artistString.concat(', ');
      } else {
        artistString = 'Featuring ' + artistString;
      }
    });

    artistString = mainArtistName + ' ' + artistString;

    return artistString;
  }

}

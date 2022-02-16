import {AfterContentInit, Component} from '@angular/core';
import {SongSaveUpdateRequest, SongResponseData} from '../../../../dto/song';
import moment from 'moment';
import {GenreAdapterService} from '../../../../services/rest/genre-adapter.service';
import {filter, first, mergeMap, tap, toArray} from 'rxjs/operators';
import {AlbumAdapterService} from '../../../../services/rest/album-adapter.service';
import {AlbumResponseData} from '../../../../dto/album';
import {ArtistAdapterService} from '../../../../services/rest/artist-adapter.service';
import {UtilService} from '../../../../services/util.service';
import {DefaultSnackBarComponent} from '../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {ContributorAdapterService} from '../../../../services/rest/contributor-adapter.service';
import {ContributorResponseData} from '../../../../dto/contributor';
import {LoadingStatusService} from '../../../../services/loading-status.service';
import {SongAdapterService} from '../../../../services/rest/song-adapter.service';
import {ContributorUtilService} from '../../../../services/contributor-util.service';
import {forkJoin, from} from 'rxjs';
import {Constants} from '../../../../constants/constants';
import {Router} from '@angular/router';
import {ArtistSuggest} from '../../../../dto/artist';

@Component({
  selector: 'app-song-view-dashboard',
  templateUrl: './song-view-dashboard.component.html',
  styleUrls: ['./song-view-dashboard.component.css']
})
export class SongViewDashboardComponent implements AfterContentInit {

  private _genreNameListOfTheSong: string[] = [];
  private _album: AlbumResponseData = null;
  private _contributor: ContributorResponseData = null;
  private _artist: ArtistSuggest;
  private _featuringArtistList: ArtistSuggest[] = [];
  private _lyric: string;
  private _lyricWithoutChords: string;

  private _guitarChordToggle = false;

  private _displayPublishComponents = false;

  private _displayDiffComponent = false;

  private _songData: SongResponseData = null;

  private loadingStopCounter = 0;

  constructor(private genreAdapterService: GenreAdapterService, private albumAdapterService: AlbumAdapterService,
              private artistAdapterService: ArtistAdapterService, private contributorAdapterService: ContributorAdapterService,
              private songAdapter: SongAdapterService, private snackBarComponent: DefaultSnackBarComponent,
              private loadingStatusService: LoadingStatusService, private contributorUtilService: ContributorUtilService,
              private router: Router) {
  }

  ngAfterContentInit(): void {

    // only initialize this component after save song was called in previous component
    this.contributorUtilService.getSongViewData()
      .pipe(filter(res => res !== null), tap(() => this.loadingStatusService.startLoading()))
      .subscribe((res) => {
        this._songData = res;
        this.afterSaveSongInit();
      }, () => {
        this.snackBarComponent.openSnackBar('Error while loading song data', true);
      });

    // get contributor
    this.contributorAdapterService.requestContributorDetails()
      .subscribe((res) => {
        this._contributor = res;
      }, () => {
        console.error('Error occurred while fetching contributor details.');
      });
  }

  // only initialize this component after save song was called in previous component
  afterSaveSongInit(): void {
    this.genreAdapterService.getAllSelections().subscribe(() => this.init());
  }

  private init(): void {
    this.genreAdapterService.initializeGenre(this.songData.genreIdList, this._genreNameListOfTheSong);
    this.initializeAlbum();
    this.initializeLyricsView();
  }

  private initializeAlbum(): void {
    this.albumAdapterService.getAlbum(this._songData.albumSurrogateKey, false)
      .pipe(first())
      .subscribe(value => {
      this._album = value.data;
      this.initializeArtist();
      this.initializeFeaturingArtistList();
    }, error => {
      console.error(error);
      throw new Error('Error while fetching staticSelections');
    });
  }

  private initializeArtist(): void {
    this.artistAdapterService.getArtist(this._album.artistSurrogateKey, false)
      .pipe(first())
      .subscribe(artist => {
      this._artist = {
        surrogateKey: artist.data.surrogateKey,
        artistName: artist.data.name
      };
    }, error => {
      console.error(error);
      throw new Error('Error while fetching staticSelections');
    }, () => this.finishLoading());
  }

  private initializeFeaturingArtistList(): void {
    this._featuringArtistList.splice(0);

    from(this._songData.artistSurrogateKeyList)
      .pipe(
        toArray(),
        mergeMap(project => {
          const observables = project.map(artistSurrogateKey => this.artistAdapterService.getArtist(artistSurrogateKey, false)
            .pipe(first()));
          return forkJoin(observables);
        }),
      ).subscribe(res => {
      res.forEach(artist => {
        this._featuringArtistList.push({
          surrogateKey: artist.data.surrogateKey,
          artistName: artist.data.name
        });
      });
    }, error => {
      console.error(error);
      throw new Error('Error while fetching staticSelections');
    }, () => this.finishLoading());

  }

  formatDate(dateString: string): string {
    if (dateString === null || dateString.length === 0) {
      return null;
    }
    const date: Date = new Date(dateString);
    return moment(date.toISOString().substring(0, 10), 'YYYY-MM-DD').format('MMM Do YYYY');
  }

  private initializeLyricsView(): void {

    this._lyric = UtilService.base64DecodeUnicode(this._songData.lyrics);
    this._lyricWithoutChords = this._lyric;

    const guitarTableMatches = this._lyric.match(/\$[a-zA-Z0-9!\\\/|\-+,.?%~=@()*^&#\n\t ]+\$/g);

    if (guitarTableMatches !== null) {
      guitarTableMatches.forEach(x => {
        this._lyric = this._lyric.replace(x, '<span class=\"lyric-guitar-table-font-style lyric-guitar-table-font-size\">' + x.substring(1, x.length - 1) + '</span>');
        this._lyricWithoutChords = this._lyricWithoutChords.replace(x, '');
      });
    }

    const chordMatches = this._lyric.match(/`[a-zA-Z0-9!\\\/|\-+,.?%~=@()*^&#\n\t ]+`/g);

    if (chordMatches !== null) {
      chordMatches.forEach(x => {
        this._lyric = this._lyric.replace(x, '<span class=\"lyric-guitar-chord-font-style\">' + x.substring(1, x.length - 1) + '</span>');
        this._lyricWithoutChords = this._lyricWithoutChords.replace(x, '');
      });
    }

    // remove unwanted whitespaces
    this._lyricWithoutChords = this._lyricWithoutChords.match(/[ \S]+[\S]+[\S ]+/g).join('\n\n');
  }

  private finishLoading(): void {
    if (this._songData.artistSurrogateKeyList.length > 0) {
      if (this.loadingStopCounter === 1) {
        this.loadingStatusService.stopLoading();
        this.loadingStopCounter = 0;
      } else {
        this.loadingStopCounter++;
      }
    } else {
      this.loadingStatusService.stopLoading();
    }
  }

  get genreNameListOfTheSong(): string[] {
    return this._genreNameListOfTheSong;
  }

  get album(): AlbumResponseData {
    return this._album;
  }

  get contributor(): ContributorResponseData {
    return this._contributor;
  }

  get artist(): ArtistSuggest {
    return this._artist;
  }

  get featuringArtistList(): ArtistSuggest[] {
    return this._featuringArtistList;
  }

  get lyric(): string {
    return this._lyric;
  }

  get lyricWithoutChords(): string {
    return this._lyricWithoutChords;
  }

  get facebookLink(): string {
    return 'https://facebook';
  }

  get twitterLink(): string {
    return 'https://facebook';
  }

  get instagramLink(): string {
    return 'https://facebook';
  }

  get guitarChordToggle(): boolean {
    return this._guitarChordToggle;
  }

  set guitarChordToggle(value: boolean) {
    this._guitarChordToggle = value;
  }

  get displayPublishComponents(): boolean {
    return this._displayPublishComponents;
  }

  set displayPublishComponents(value: boolean) {
    this._displayPublishComponents = value;
  }

  get displayDiffComponent(): boolean {
    return this._displayDiffComponent;
  }

  set displayDiffComponent(value: boolean) {
    this._displayDiffComponent = value;
  }

  get songData(): SongResponseData {
    return this._songData;
  }

  set songData(value: SongResponseData) {
    this._songData = value;
  }

  openInNewTab(url: string): void {
    UtilService.openLinkInNewTab(url);
  }

  constructSongAlbumArtUrl(imgUrl: string): string {
    return UtilService.constructSongAlbumArtResourceUrl(imgUrl);
  }

  constructAlbumArtUrl(imgUrl: string): string {
    return UtilService.constructAlbumArtResourceUrl(imgUrl);
  }

  publishLater(): void {
    this.snackBarComponent.openSnackBar('Saved for Publishing Later');
    this.resetAndNavigateToContributorMainTab();
  }

  publishNow(): void {
    this.snackBarComponent.openSnackBar('Publishing Now');
    this.publishSong();
    this.resetAndNavigateToContributorMainTab();
  }

  submitForReview(): void {
    this.snackBarComponent.openSnackBar('Saved for Reviewing');
    this.resetAndNavigateToContributorMainTab();
  }

  private resetAndNavigateToContributorMainTab(): void {
    this.contributorUtilService.resetContributorFields(true);
    setTimeout(() => this.contributorUtilService.resetContributorFields(false), 500);
  }

  private publishSong() {
    const payload: SongSaveUpdateRequest = {
      surrogateKey: this._songData.surrogateKey,
      publishedState: true
    };

    this.songAdapter.saveSong(payload)
      .pipe(tap(() => this.loadingStatusService.startLoading()))
      .subscribe(() => {
      this.snackBarComponent.openSnackBar('Song Publishing Successful');
    }, error => {
      console.error(error);
      this.snackBarComponent.openSnackBar('Song Publishing Failed', true);
    }, () => this.loadingStatusService.stopLoading());
  }

  private editSong($event): void {
    this.songAdapter.songListToSongWithAlbumAndArtist([$event.data]).pipe(first())
      .subscribe(songWithAlbumArtistIncludedSongAndAlbumAndArtist => {
      this.contributorUtilService.sendContributorTabIndex(1, true);
      this.contributorUtilService.sendSongEditData(songWithAlbumArtistIncludedSongAndAlbumAndArtist[0]);
    },
      () => {},
      () => this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.CONTRIBUTE));
  }

  private isCurrentRouteSong(): boolean {
    return this.router.url.startsWith(Constants.Symbol.FORWARD_SLASH + Constants.Route.SONG + Constants.Symbol.FORWARD_SLASH);
  }

  public navigateToArtist ($event) {
    this.router.navigateByUrl( Constants.Route.ARTIST + Constants.Symbol.FORWARD_SLASH + $event.data);
  }

  public navigateToAlbum ($event) {
    this.router.navigateByUrl( Constants.Route.ALBUM + Constants.Symbol.FORWARD_SLASH + $event.data);
  }
}

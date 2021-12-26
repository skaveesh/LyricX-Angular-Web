import {Component, OnInit} from '@angular/core';
import {SongSaveUpdateRequest, SongResponseData} from '../../../../dto/song';
import moment from 'moment';
import {GenreAdapterService} from '../../../../services/rest/genre-adapter.service';
import {filter, first, mergeMap, take, tap, toArray} from 'rxjs/operators';
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

@Component({
  selector: 'app-song-view-dashboard',
  templateUrl: './song-view-dashboard.component.html',
  styleUrls: ['./song-view-dashboard.component.css']
})
export class SongViewDashboardComponent implements OnInit {

  private _genreNameListOfTheSong: string[] = [];
  private _album: AlbumResponseData = null;
  private _contributor: ContributorResponseData = null;
  private _artist: string;
  private _featuringArtistList: string[] = [];
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
              private loadingStatusService: LoadingStatusService, private contributorUtilService: ContributorUtilService) {
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

  ngOnInit() {
  }

  // only initialize this component after save song was called in previous component
  afterSaveSongInit(): void {
    this.genreAdapterService.getAllSelections();
    this.init();
  }

  private init(): void {
    this.initializeGenre();
    this.initializeAlbum();
    this.initializeLyricsView();
  }

  private initializeGenre(): void {
    this._genreNameListOfTheSong.splice(0);
    this.genreAdapterService.allSelections.pipe(
      take(this.genreAdapterService.allSelections.getValue().length <= 0 ? 2 : 1)
    ).subscribe(value => {

      const genreIdList = this._songData.genreIdList.map(String);

      if (value.length > 0) {
        value.forEach(genreItem => {
          genreIdList.forEach(genreIdItem => {
            if (genreItem.substring(genreItem.lastIndexOf('$') + 1) === genreIdItem) {
              this._genreNameListOfTheSong.push(genreItem.substring(0, genreItem.lastIndexOf('$')));
              genreIdList.splice(genreIdList.indexOf(genreIdItem), 1);
            }
          });
        });
      }
    }, error => {
      console.error(error);
      throw new Error('Error while fetching staticSelections');
    });
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
      .subscribe(value => {
      this._artist = value.data.name;
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
            .pipe(tap(() => console.log('start fetch artist list')), first()));

          return forkJoin(observables);
        }),
      ).subscribe(res => {
      res.forEach(artist => {
        this._featuringArtistList.push(artist.data.name);
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

  get artist(): string {
    return this._artist;
  }

  get featuringArtistList(): string[] {
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
    this.contributorUtilService.resetContributorFields();
  }

  private publishSong() {
    const payload: SongSaveUpdateRequest = {
      surrogateKey: this._songData.surrogateKey,
      publishedState: true
    };

    this.songAdapter.saveSong(payload).subscribe(() => {
      this.snackBarComponent.openSnackBar('Song Publishing Successful');
    }, error => {
      console.error(error);
      this.snackBarComponent.openSnackBar('Song Publishing Failed', true);
    });
  }
}

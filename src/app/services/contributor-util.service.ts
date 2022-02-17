import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SongResponseData, SongWithAlbumAndArtist} from '../dto/song';
import {SuggestedItem} from '../dto/item-suggest';
import {Constants} from '../constants/constants';
import {AlbumResponseData} from '../dto/album';
import {ArtistResponseData} from '../dto/artist';
import {share} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContributorUtilService {

  constructor() { }

  private static CONTRIBUTOR_RESET_STATUS = false;
  private static CONTRIBUTOR_SONG_EDIT_DATA = null;
  private static CONTRIBUTOR_SONG_VIEW_DATA = null;
  private static CONTRIBUTOR_ALBUM_VIEW_DATA = null;
  private static CONTRIBUTOR_ALBUM_EDIT_DATA = null;
  private static CONTRIBUTOR_ARTIST_VIEW_DATA = null;
  private static CONTRIBUTOR_ARTIST_EDIT_DATA = null;
  private static CONTRIBUTOR_TAB_INDEX = null;
  private static CONTRIBUTOR_STEPPER = null;

  private _resetStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(ContributorUtilService.CONTRIBUTOR_RESET_STATUS);
  private _songEditData$: BehaviorSubject<SongWithAlbumAndArtist> = new BehaviorSubject<SongWithAlbumAndArtist>(ContributorUtilService.CONTRIBUTOR_SONG_EDIT_DATA);
  private _songViewData$: BehaviorSubject<SongResponseData> = new BehaviorSubject<SongResponseData>(ContributorUtilService.CONTRIBUTOR_SONG_VIEW_DATA);
  private _albumViewData$: BehaviorSubject<AlbumResponseData> = new BehaviorSubject<AlbumResponseData>(ContributorUtilService.CONTRIBUTOR_ALBUM_VIEW_DATA);
  private _albumEditData$: BehaviorSubject<AlbumResponseData> = new BehaviorSubject<AlbumResponseData>(ContributorUtilService.CONTRIBUTOR_ALBUM_EDIT_DATA);
  private _artistViewData$: BehaviorSubject<ArtistResponseData> = new BehaviorSubject<ArtistResponseData>(ContributorUtilService.CONTRIBUTOR_ARTIST_VIEW_DATA);
  private _artistEditData$: BehaviorSubject<ArtistResponseData> = new BehaviorSubject<ArtistResponseData>(ContributorUtilService.CONTRIBUTOR_ARTIST_EDIT_DATA);
  private _contributorTabIndex$: BehaviorSubject<{contributorTabIndex: number, navigate: boolean}> = new BehaviorSubject<{contributorTabIndex: number, navigate: boolean}>(ContributorUtilService.CONTRIBUTOR_TAB_INDEX);
  private _contributorStepper$: BehaviorSubject<string> = new BehaviorSubject<string>(ContributorUtilService.CONTRIBUTOR_STEPPER);

  public static defaultSurrogateKeyNameSuggestedItem(surrogateKey: string, name: string): SuggestedItem {
    return {
      surrogateKey: surrogateKey,
      name: name + Constants.Symbol.DOLLAR_SIGN + surrogateKey
    };
  }

  resetContributorFields() {
    this._resetStatus$.next(true);
    setTimeout(() => this._resetStatus$.next(false), 500);
  }

  sendSongEditData(songWithAlbumAndArtist: SongWithAlbumAndArtist) {
    this._songEditData$.next(songWithAlbumAndArtist);
  }

  sendSongViewData(songResponseData: SongResponseData) {
    this._songViewData$.next(songResponseData);
  }

  sendAlbumViewData(albumResponseData: AlbumResponseData) {
    this._albumViewData$.next(albumResponseData);
  }

  sendAlbumEditData(albumResponseData: AlbumResponseData) {
    this._albumEditData$.next(albumResponseData);
  }

  sendArtistEditData(artistResponseData: ArtistResponseData) {
    this._artistEditData$.next(artistResponseData);
  }

  sendArtistViewData(artistResponseData: ArtistResponseData) {
    this._artistViewData$.next(artistResponseData);
  }

  sendContributorTabIndex(contributorTabIndex: number, navigate: boolean) {
    this._contributorTabIndex$.next({contributorTabIndex: contributorTabIndex, navigate: navigate});
  }

  /**
   * navigate in #contributorStepper
   * @param status 'next' for next step, 'previous' for previous step and 'reset' for initial position
   */
  sendContributorStepper(status: string) {
    this._contributorStepper$.next(status);
  }

  getContributorEditorFieldsResetStatus() {
    return this._resetStatus$.pipe(share());
  }

  getSongEditData() {
    return this._songEditData$;
  }

  getSongViewData() {
    return this._songViewData$;
  }

  getAlbumViewData$(): BehaviorSubject<AlbumResponseData> {
    return this._albumViewData$;
  }

  getAlbumEditData$(): BehaviorSubject<AlbumResponseData> {
    return this._albumEditData$;
  }

  getArtistEditData$(): BehaviorSubject<ArtistResponseData> {
    return this._artistEditData$;
  }

  getArtistViewData$(): BehaviorSubject<ArtistResponseData> {
    return this._artistViewData$;
  }

  getContributorTabIndex(): BehaviorSubject<{contributorTabIndex: number, navigate: boolean}> {
    return this._contributorTabIndex$;
  }

  getContributorStepper(): BehaviorSubject<string> {
    return this._contributorStepper$;
  }
}

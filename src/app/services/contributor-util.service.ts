import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SongResponseData, SongWithAlbumAndArtist} from '../dto/song';
import {SuggestedItem} from '../dto/item-suggest';
import {Constants} from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ContributorUtilService {

  constructor() { }

  private static CONTRIBUTOR_RESET_STATUS = false;
  private static CONTRIBUTOR_SONG_EDIT_DATA = null;
  private static CONTRIBUTOR_SONG_VIEW_DATA = null;
  private static CONTRIBUTOR_TAB_INDEX = null;
  private static CONTRIBUTOR_STEPPER = false;


  private _resetStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(ContributorUtilService.CONTRIBUTOR_RESET_STATUS);
  private _songEditData$: BehaviorSubject<SongWithAlbumAndArtist> = new BehaviorSubject<SongWithAlbumAndArtist>(ContributorUtilService.CONTRIBUTOR_SONG_EDIT_DATA);
  private _songViewData$: BehaviorSubject<SongResponseData> = new BehaviorSubject<SongResponseData>(ContributorUtilService.CONTRIBUTOR_SONG_VIEW_DATA);
  private _contributorTabIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(ContributorUtilService.CONTRIBUTOR_TAB_INDEX);
  private _contributorStepper$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(ContributorUtilService.CONTRIBUTOR_STEPPER);

  public static defaultSurrogateKeyNameSuggestedItem(surrogateKey: string, name: string): SuggestedItem {
    return {
      surrogateKey: surrogateKey,
      name: name + Constants.Symbol.DOLLAR_SIGN + surrogateKey
    };
  }

  resetContributorFields() {
    this._resetStatus$.next(true);
  }

  sendSongEditData(songWithAlbumAndArtist: SongWithAlbumAndArtist) {
    this._songEditData$.next(songWithAlbumAndArtist);
  }

  sendSongViewData(songResponseData: SongResponseData) {
    this._songViewData$.next(songResponseData);
  }

  sendContributorTabIndex(contributorTabIndex: number) {
    this._contributorTabIndex$.next(contributorTabIndex);
  }

  /**
   * navigate in #contributorStepper
   * @param stepPositionNext true for next step, false for previous step
   */
  sendContributorStepper(stepPositionNext: boolean) {
    this._contributorStepper$.next(stepPositionNext);
  }

  getResetStatus() {
    return this._resetStatus$;
  }

  getSongEditData() {
    return this._songEditData$;
  }

  getSongViewData() {
    return this._songViewData$;
  }

  getContributorTabIndex() {
    return this._contributorTabIndex$;
  }

  getContributorStepper() {
    return this._contributorStepper$;
  }
}

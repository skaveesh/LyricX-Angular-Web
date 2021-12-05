import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatAutocomplete, MatDialog} from '@angular/material';
import {GenreAdapterService} from '../../../../services/rest/genre-adapter.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {Constants} from '../../../../constants/constants';
import {ImageUploadData} from '../../../../dto/image-upload-data';
import {ImageUploadDialogFacade} from '../../../../classes/image-upload-dialog-facade';
import {DefaultSnackBarComponent} from '../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {LanguageAdapterService} from '../../../../services/rest/language-adapter.service';
import {StaticSelectionController} from '../../../../classes/static-selection-controller';
import {UtilService} from '../../../../services/util.service';
import {SongAdapterService} from '../../../../services/rest/song-adapter.service';
import {SongSaveUpdateRequest} from '../../../../dto/song';
import AppConstant = Constants.AppConstant;
import {Observable} from 'rxjs';
import {BasicHttpResponse} from '../../../../dto/base-http-response';

@Component({
  selector: 'app-song-add-update-dashboard',
  templateUrl: './song-add-update-dashboard.component.html',
  styleUrls: ['./song-add-update-dashboard.component.css']
})
export class SongAddUpdateDashboardComponent implements OnInit, AfterViewInit {

  public songAlbumArtUploadData: ImageUploadData = {
    croppedImageBase64: null,
    croppedImagePositions: null,
    originalImageBase64: null
  };

  private albumImageUploadDialogFacade: ImageUploadDialogFacade;

  songAddUpdateFormGroup: FormGroup;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  genreController: StaticSelectionController;
  public genreCtrl = new FormControl();

  languageController: StaticSelectionController;
  public languageCtrl = new FormControl();

  guitarKeys: String[] = ['Ab', 'A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#'];

  @ViewChild('genreInput', {static: false}) genreInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteGenre', {static: false}) matAutocompleteGenre: MatAutocomplete;

  @ViewChild('languageInput', {static: false}) languageInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteLanguage', {static: false}) matAutocompleteLanguage: MatAutocomplete;

  @ViewChild('lyricsTextArea', {static: false}) matLyricsTextArea: ElementRef<HTMLElement>;
  private matLyricsTextAreaInitialized = false;

  // parent: contributeTabComponent
  @Output() contributeTabComponent$HasSongAddingRequestCompleted = new EventEmitter<boolean>();

  public lyricsCtrl = new FormControl('', Validators.compose([Validators.minLength(50), Validators.required]));
  lyric: string;
  lyricWithoutChords: string;

  public surrogateKey: string = null;

  constructor(private _formBuilder: FormBuilder, private genreAdapter: GenreAdapterService, private languageAdapter: LanguageAdapterService, private songAdapter: SongAdapterService, private defaultSnackBar: DefaultSnackBarComponent, public dialog: MatDialog) {

    this.albumImageUploadDialogFacade = new ImageUploadDialogFacade(this.dialog);
  }

  ngOnInit() {
    this.songAddUpdateFormGroup = this._formBuilder.group({
      songNameCtrl: ['', Validators.required],
      guitarKeyCtrl: ['', Validators.required],
      songBeatCtrl: '',
      songKeywordsCtrl: ['', Validators.required],
      songYouTubeLinkCtrl: ['', Validators.required],
      songSpotifyLinkCtrl: '',
      songDeezerLinkCtrl: '',
      songAppleMusicLinkCtrl: '',
      songExplicitCtrl: false
    });

    this.genreController = new StaticSelectionController(this.genreAdapter, this.genreCtrl, true);
    this.languageController = new StaticSelectionController(this.languageAdapter, this.languageCtrl, false);
  }

  ngAfterViewInit(): void {
    this.genreController.setMatAutoComplete(this.matAutocompleteGenre);
    this.genreController.setStaticSelectionInput(this.genreInput);
    this.languageController.setMatAutoComplete(this.matAutocompleteLanguage);
    this.languageController.setStaticSelectionInput(this.languageInput);
    this.initializeLyricsTextArea();
  }

  private initializeLyricsTextArea() {
    this.lyricsCtrl.setValue(sessionStorage.getItem(Constants.Session.SONG_LYRIC));
    const event = new KeyboardEvent('keyup', { key: 'Enter' });
    this.matLyricsTextArea.nativeElement.dispatchEvent(event);
  }

  getAlbumImage(): string | ArrayBuffer {
    if (isNotNullOrUndefined(this.songAlbumArtUploadData.croppedImageBase64) && this.songAlbumArtUploadData.croppedImageBase64.toString().length > 0) {
      return this.songAlbumArtUploadData.croppedImageBase64;
    }

    return Constants.Asset.ALBUM_IMAGE;
  }

  openAlbumImageUploadDialog() {
    this.albumImageUploadDialogFacade.openImageSelectingDialog(AppConstant.ALBUM, this.songAlbumArtUploadData.croppedImageBase64,
      this.songAlbumArtUploadData.originalImageBase64, this.songAlbumArtUploadData.croppedImagePositions)
      .subscribe(result => {this.songAlbumArtUploadData = result;
      });
  }

  autoGeneratePreview(e) {

    if (e.target.value === null || this.lyricsCtrl.value === null) {
      return;
    }

    e.target.style.height = '0px';
    e.target.style.height = (e.target.scrollHeight + 25) + 'px';

    this.lyric = this.lyricsCtrl.value;

    const guitarTableMatches = this.lyric.match(/\$[a-zA-Z0-9!\\\/|\-+,.?%~=@()*^&#\n\t ]+\$/g);

    if (guitarTableMatches !== null) {
      guitarTableMatches.forEach(x => {
        this.lyric = this.lyric.replace(x, '<span class=\"lyric-guitar-table-font-style\">' + x.substring(1, x.length - 1) + '</span>');
      });
    }

    const chordMatches = this.lyric.match(/`[a-zA-Z0-9!\\\/|\-+,.?%~=@()*^&#\n\t ]+`/g);

    if (chordMatches !== null) {
      chordMatches.forEach(x => {
        this.lyric = this.lyric.replace(x, '<span class=\"lyric-guitar-chord-font-style\">  ' + x.substring(1, x.length - 1) + '  </span>');
      });
    }

    sessionStorage.setItem(Constants.Session.SONG_LYRIC, this.lyricsCtrl.value);
  }

  public destroyAlbumImageUploadData(): void {
    this.songAlbumArtUploadData.croppedImageBase64 = null;
    this.songAlbumArtUploadData.originalImageBase64 = null;
    this.songAlbumArtUploadData.croppedImagePositions = null;
  }

  public isSongFormValid(): boolean {

    const isValid: boolean = this.songAddUpdateFormGroup.valid && this.lyricsCtrl.valid && this.languageCtrl.value.length === 1
      && this.genreCtrl.value.length > 0;

    if (!isValid) {
      this.defaultSnackBar.openSnackBar('Please fill the required fields.', true);
      return isValid;
    }

    return isValid;
  }

  public saveSong(albumCtrl: FormControl, artistCtrl: FormControl, callbackIfSaveComplete: any): Observable<BasicHttpResponse> {

    this.contributeTabComponent$HasSongAddingRequestCompleted.emit(false);

    if (!this.isSongFormValid() || albumCtrl.value.length === 0) {
      this.defaultSnackBar.openSnackBar('Provided inputs are invalid. Please check again', true);
      return;
    }

    let image = null;
    if (this.songAlbumArtUploadData.croppedImageBase64 != null) {
      image = UtilService.base64URItoBlob(this.songAlbumArtUploadData.croppedImageBase64.toString());
    }

    const payload: SongSaveUpdateRequest = {
      surrogateKey: this.surrogateKey,
      name: this.songAddUpdateFormGroup.controls.songNameCtrl.value,
      albumSurrogateKey: albumCtrl.value[0],
      guitarKey: this.songAddUpdateFormGroup.controls.guitarKeyCtrl.value,
      beat: this.songAddUpdateFormGroup.controls.songBeatCtrl.value,
      languageCode: this.languageCtrl.value[0],
      keywords: this.songAddUpdateFormGroup.controls.songKeywordsCtrl.value,
      lyrics: UtilService.base64EncodeUnicode(this.lyricsCtrl.value),
      youTubeLink: this.songAddUpdateFormGroup.controls.songYouTubeLinkCtrl.value,
      spotifyLink: this.songAddUpdateFormGroup.controls.songSpotifyLinkCtrl.value,
      deezerLink: this.songAddUpdateFormGroup.controls.songDeezerLinkCtrl.value,
      appleMusicLink: this.songAddUpdateFormGroup.controls.songAppleMusicLinkCtrl.value,
      isExplicit: this.songAddUpdateFormGroup.controls.songExplicitCtrl.value,
      artistSurrogateKeyList: artistCtrl.value,
      genreIdList: this.genreCtrl.value.map(Number),
      publishedState: false
    };

    const saveSongObservable: Observable<BasicHttpResponse> = this.songAdapter.saveSong(payload, image);

    saveSongObservable.subscribe(response => {
      this.surrogateKey = (<SongSaveUpdateRequest>response.data).surrogateKey;
      this.defaultSnackBar.openSnackBar('Song Saving Successful', false);
      this.destroyAlbumImageUploadData();
      sessionStorage.removeItem(Constants.Session.SONG_LYRIC);
      this.contributeTabComponent$HasSongAddingRequestCompleted.emit(true);
      callbackIfSaveComplete();
    }, error => {
      console.error(error);
      this.defaultSnackBar.openSnackBar('Song Saving Failed', true);
    });

    return saveSongObservable;
  }

  public resetLyricsFieldHeight(): void {
    this.matLyricsTextArea.nativeElement.style.height = '25px';
  }

  get guitarKeyAbstractCtrl() {
    return this.songAddUpdateFormGroup.get( 'guitarKeyCtrl' );
  }

}

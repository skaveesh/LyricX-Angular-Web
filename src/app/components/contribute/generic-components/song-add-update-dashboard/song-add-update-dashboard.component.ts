import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
import {SongSaveRequest} from '../../../../dto/song';
import AppConstant = Constants.AppConstant;

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

  @Input() songAddingDashboardFormGroup: FormGroup;

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

  public lyricsCtrl = new FormControl('', Validators.compose([Validators.minLength(10), Validators.required]));
  lyric: string;
  lyricWithoutChords: string;

  public surrogateKey: string = null;

  constructor(private _formBuilder: FormBuilder, private genreAdapter: GenreAdapterService, private languageAdapter: LanguageAdapterService, public dialog: MatDialog) {

    this.albumImageUploadDialogFacade = new ImageUploadDialogFacade(this.dialog);
  }

  ngOnInit() {
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

    return Constants.Assert.ALBUM_IMAGE;
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

  // TODO change this to submit a song
  // public submitAlbum(): void {
  //   const albumName = this.albumAddingFormGroup.get('albumNameCtrl');
  //   const artistName = this.albumAddingFormGroup.get('artistCtrl');
  //   const year = this.albumAddingFormGroup.get('albumYearCtrl');
  //
  //   if (albumName.valid && artistName.valid && year.valid && isNotNullOrUndefined(this.albumImageUploadData.croppedImageBase64) &&
  //     this.albumImageUploadData.croppedImageBase64.toString().length > 0) {
  //
  //     const image = UtilService.base64URItoBlob(this.albumImageUploadData.croppedImageBase64.toString());
  //
  //     const payload: AlbumCreateRequest = {
  //       name: albumName.value,
  //       artistSurrogateKey: artistName.value.substring(artistName.value.lastIndexOf(Constants.Symbol.DOLLAR_SIGN) + 1),
  //       year: new Date(year.value).getFullYear()
  //     };
  //
  //     if (this.albumAdapter.createAlbum(UtilService.dataToBlob(payload), image)) {
  //       this.destroyInputs();
  //     }
  //
  //   } else {
  //     if (!albumName.valid) {
  //       this.defaultSnackBar.openSnackBar('Album name is invalid', true);
  //     } else if (!artistName.valid) {
  //       this.defaultSnackBar.openSnackBar('Artist name is invalid', true);
  //     } else if (!year.valid) {
  //       this.defaultSnackBar.openSnackBar('Year is invalid', true);
  //     } else if (!isNotNullOrUndefined(this.albumImageUploadData.croppedImageBase64)) {
  //       this.defaultSnackBar.openSnackBar('Please upload a Album image', true);
  //     }
  //   }
  // }
  //
  // public destroyInputs(): void {
  //   this.suggestionUserInterfaceArtist.chipSelectedItems.splice(0);
  //   this.yearPickerComponent.writeValue(null);
  //   this.albumAddingFormGroup.reset();
  //   this.albumImageUploadData.croppedImageBase64 = null;
  //   this.albumImageUploadData.originalImageBase64 = null;
  //   this.albumImageUploadData.croppedImagePositions = null;
  // }

  public destroyAlbumImageUploadData(): void {
    this.songAlbumArtUploadData.croppedImageBase64 = null;
    this.songAlbumArtUploadData.originalImageBase64 = null;
    this.songAlbumArtUploadData.croppedImagePositions = null;
  }

  public isSongFormValid(): boolean {
    return this.songAddingDashboardFormGroup.valid && this.lyricsCtrl.valid && this.languageCtrl.value.length === 1
      && this.genreCtrl.value.length > 0;
  }

  public saveSong(): void {

  }

  get guitarKeyAbstractCtrl() { return this.songAddingDashboardFormGroup.get( 'guitarKeyCtrl' ); }
}

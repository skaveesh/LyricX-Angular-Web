import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatAutocomplete, MatDialog} from '@angular/material';
import {GenreAdapterService} from '../../../../../services/rest/genre-adapter.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {Constants} from '../../../../../constants/constants';
import {ImageUploadData} from '../../../../../dto/image-upload-data';
import AppConstant = Constants.AppConstant;
import {ImageUploadDialogFacade} from '../../../../../classes/image-upload-dialog-facade';
import {UtilService} from '../../../../../services/util.service';
import {AlbumCreateRequest} from '../../../../../dto/album';
import {DefaultSnackBarComponent} from '../../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {LanguageAdapterService} from '../../../../../services/rest/language-adapter.service';
import {StaticSelectionController} from '../../../../../classes/static-selection-controller';

@Component({
  selector: 'app-song-adding-dashboard',
  templateUrl: './song-adding-dashboard.component.html',
  styleUrls: ['./song-adding-dashboard.component.css']
})
export class SongAddingDashboardComponent implements OnInit, AfterViewInit {

  private albumImageUploadData: ImageUploadData = {
    croppedImageBase64: null,
    croppedImagePositions: null,
    originalImageBase64: null
  };

  private albumImageUploadDialogFacade: ImageUploadDialogFacade;

  @Input() songAddingDashboardFormGroup: FormGroup;

  songNameCtrl = new FormControl();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  genreController: StaticSelectionController;
  genreCtrl = new FormControl();

  languageController: StaticSelectionController;
  languageCtrl = new FormControl();

  @ViewChild('genreInput', {static: false}) genreInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteGenre', {static: false}) matAutocompleteGenre: MatAutocomplete;

  @ViewChild('languageInput', {static: false}) languageInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteLanguage', {static: false}) matAutocompleteLanguage: MatAutocomplete;

  constructor(private _formBuilder: FormBuilder, private genreAdapter: GenreAdapterService, private languageAdapter: LanguageAdapterService, public dialog: MatDialog,
              private defaultSnackBar: DefaultSnackBarComponent) {

    this.albumImageUploadDialogFacade = new ImageUploadDialogFacade(this.dialog);

    this.genreController = new StaticSelectionController(this.genreAdapter, this.genreCtrl, true);
    this.languageController = new StaticSelectionController(this.languageAdapter, this.languageCtrl, false);
  }

  ngOnInit() {
    this.songAddingDashboardFormGroup = this._formBuilder.group({
      songNameCtrl: ['', Validators.required],
      genreCtrl: '',
      languageCtrl: ''
    });

  }

  ngAfterViewInit(): void {
    this.genreController.setMatAutoComplete(this.matAutocompleteGenre);
    this.genreController.setStaticSelectionInput(this.genreInput);
    this.languageController.setMatAutoComplete(this.matAutocompleteLanguage);
    this.languageController.setStaticSelectionInput(this.languageInput);
  }

  getAlbumImage(): string | ArrayBuffer {
    if (isNotNullOrUndefined(this.albumImageUploadData.croppedImageBase64) && this.albumImageUploadData.croppedImageBase64.toString().length > 0) {
      return this.albumImageUploadData.croppedImageBase64;
    }

    return Constants.Assert.ALBUM_IMAGE;
  }

  openAlbumImageUploadDialog() {
    this.albumImageUploadDialogFacade.openImageSelectingDialog(AppConstant.ALBUM, this.albumImageUploadData.croppedImageBase64,
      this.albumImageUploadData.originalImageBase64, this.albumImageUploadData.croppedImagePositions)
      .subscribe(result => {this.albumImageUploadData = result;
      });
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

  private destroyAlbumImageUploadData(): void {
    this.albumImageUploadData.croppedImageBase64 = null;
    this.albumImageUploadData.originalImageBase64 = null;
    this.albumImageUploadData.croppedImagePositions = null;
  }
}

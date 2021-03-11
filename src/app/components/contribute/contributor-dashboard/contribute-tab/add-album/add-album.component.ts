import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Constants} from '../../../../../constants/constants';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SuggestionUserInterface} from '../../../../../classes/suggestion-user-interface';
import {MatAutocomplete, MatDialog} from '@angular/material';
import {SuggestionService} from '../../../../../services/suggestion.service';
import {SuggestedItem} from '../../../../../dto/item-suggest';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {ImageUploadDialogComponent} from '../../../../popups-and-modals/image-upload-dialog/image-upload-dialog.component';
import {DialogData} from '../../../../../dto/dialog-data';
import {ArtistSuggest} from '../../../../../dto/artist';
import {CropperPosition} from 'ngx-image-cropper';
import moment from 'moment';
import {UtilService} from '../../../../../services/util.service';
import {AlbumCreateRequest} from '../../../../../dto/album';
import {AlbumAdapterService} from '../../../../../services/rest/album-adapter.service';
import {DefaultSnackBarComponent} from '../../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {YearPickerComponent} from '../../../../popups-and-modals/multidatepicker/year-picker-component/year-picker.component';

@Component({
  selector: 'app-add-album',
  templateUrl: './add-album.component.html',
  styleUrls: ['./add-album.component.css']
})
export class AddAlbumComponent implements OnInit, AfterViewInit {
  private albumCroppedImageBase64: string;
  private albumOriginalImageBase64: string;
  private albumCroppedImagePositions: CropperPosition;

  currentYear: number;
  // albumYearCtrl: Date;

  albumAddingFormGroup: FormGroup;

  artistCtrl = new FormControl();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  suggestionUserInterfaceArtist: SuggestionUserInterface;

  @ViewChild('artistInput', {static: false}) artistInput: ElementRef<HTMLInputElement>;

  @ViewChild('yearInput', {static: false}) yearPickerComponent: YearPickerComponent;

  @ViewChild('autoCompleteArtist', {static: false}) matAutocompleteArtist: MatAutocomplete;

  constructor(private router: Router, private _formBuilder: FormBuilder, private albumAdapter: AlbumAdapterService,
              private suggestionService: SuggestionService, public dialog: MatDialog, private defaultSnackBar: DefaultSnackBarComponent) {

    this.suggestionUserInterfaceArtist = new SuggestionUserInterface(this.suggestionService, this.artistCtrl, false,
      res => this.suggestionService.getArtistSuggestion(res));

    // + 1 because sometimes needs to add up coming albums
    this.currentYear = moment().year() + 1;
  }

  ngAfterViewInit() {
    this.suggestionUserInterfaceArtist.setMatAutoComplete(this.matAutocompleteArtist);
    this.suggestionUserInterfaceArtist.setItemInput(this.artistInput);
  }

  ngOnInit(): void {
    this.albumAddingFormGroup = this._formBuilder.group({
      albumNameCtrl: '',
      artistCtrl: '',
      albumYearCtrl: ''
    });

    this.suggestionService.getArtistSuggestions().subscribe((artistSuggestArray: ArtistSuggest[]) => {

      if (artistSuggestArray != null) {
        const itemSuggestArray = artistSuggestArray.map(function (artistItem) {
          const item: SuggestedItem = {
            surrogateKey: artistItem.surrogateKey,
            name: artistItem.artistName
          };
          return item;
        });

        this.suggestionUserInterfaceArtist.pushDataToAllItems(itemSuggestArray);
      }
    });
  }

  backToContributor() {
    this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.CONTRIBUTE);
  }

  getAlbumImage(): string {
    if (isNotNullOrUndefined(this.albumCroppedImageBase64) && this.albumCroppedImageBase64.length > 0) {
      return this.albumCroppedImageBase64;
    }

    return Constants.Assert.ALBUM_IMAGE;
  }

  openDialog(): void {

    const dataObj = isNotNullOrUndefined(this.albumCroppedImageBase64) ?
      {injectedTitle: Constants.AppConstant.ALBUM, originalImageBase64: this.albumOriginalImageBase64, cropperPositions: this.albumCroppedImagePositions} :
      {injectedTitle: Constants.AppConstant.ALBUM};

    const dialogRef = this.dialog.open(ImageUploadDialogComponent, {
      disableClose: true,
      maxWidth: '90vw',
      data: dataObj
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (isNotNullOrUndefined(result)) {
        if (isNotNullOrUndefined(result.originalImageBase64)) {
          this.albumOriginalImageBase64 = result.originalImageBase64;
        }

        if (isNotNullOrUndefined(result.croppedImageBase64)) {
          this.albumCroppedImageBase64 = result.croppedImageBase64;
        }

        if (isNotNullOrUndefined(result.cropperPositions)) {
          this.albumCroppedImagePositions = result.cropperPositions;
        }
      }
    });
  }

  public submitAlbum(): void {
    const albumName = this.albumAddingFormGroup.get('albumNameCtrl');
    const artistName = this.albumAddingFormGroup.get('artistCtrl');
    const year = this.albumAddingFormGroup.get('albumYearCtrl');

    if (albumName.valid && artistName.valid && year.valid
      && isNotNullOrUndefined(this.albumCroppedImageBase64) && this.albumCroppedImageBase64.length > 0) {
      const image = UtilService.base64URItoBlob(this.albumCroppedImageBase64);

      const payload: AlbumCreateRequest = {
        name: albumName.value,
        artistSurrogateKey: artistName.value.substring(artistName.value.lastIndexOf(Constants.Symbol.DOLLAR_SIGN) + 1),
        year: new Date(year.value).getFullYear()
      };

      this.albumAdapter.createAlbum(UtilService.dataToBlob(payload), image);

      this.destroyInputs(year);

    } else {
      if (!albumName.valid) {
        this.defaultSnackBar.openSnackBar('Album name is invalid', true);
      } else if (!artistName.valid) {
        this.defaultSnackBar.openSnackBar('Artist name is invalid', true);
      } else if (!year.valid) {
        this.defaultSnackBar.openSnackBar('Year is invalid', true);
      } else if (!isNotNullOrUndefined(this.albumCroppedImageBase64)) {
        this.defaultSnackBar.openSnackBar('Please upload a Album image', true);
      }
    }
  }

  public destroyInputs(y: AbstractControl): void {
    this.suggestionUserInterfaceArtist.chipSelectedItems.splice(0);
    this.yearPickerComponent.writeValue(null);
    this.albumAddingFormGroup.reset();
    this.albumCroppedImageBase64 = null;
    this.albumOriginalImageBase64 = null;
    this.albumCroppedImagePositions = null;
  }
}

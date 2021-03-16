import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Constants} from '../../../../../constants/constants';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SuggestionUserInterface} from '../../../../../classes/suggestion-user-interface';
import {MatAutocomplete, MatDialog} from '@angular/material';
import {SuggestionService} from '../../../../../services/suggestion.service';
import {SuggestedItem} from '../../../../../dto/item-suggest';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {ArtistSuggest} from '../../../../../dto/artist';
import moment from 'moment';
import {UtilService} from '../../../../../services/util.service';
import {AlbumCreateRequest} from '../../../../../dto/album';
import {AlbumAdapterService} from '../../../../../services/rest/album-adapter.service';
import {DefaultSnackBarComponent} from '../../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {YearPickerComponent} from '../../../../popups-and-modals/multidatepicker/year-picker-component/year-picker.component';
import {ImageUploadData} from '../../../../../dto/image-upload-data';
import {ImageUploadDialogFacade} from '../../../../../classes/image-upload-dialog-facade';
import AppConstant = Constants.AppConstant;

@Component({
  selector: 'app-add-album',
  templateUrl: './add-album.component.html',
  styleUrls: ['./add-album.component.css']
})
export class AddAlbumComponent implements OnInit, AfterViewInit {

  private albumImageUploadData: ImageUploadData = {
    croppedImageBase64: null,
    croppedImagePositions: null,
    originalImageBase64: null
  };

  private albumImageUploadDialogFacade: ImageUploadDialogFacade;

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

    this.albumImageUploadDialogFacade = new ImageUploadDialogFacade(this.dialog);

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

  public submitAlbum(): void {
    const albumName = this.albumAddingFormGroup.get('albumNameCtrl');
    const artistName = this.albumAddingFormGroup.get('artistCtrl');
    const year = this.albumAddingFormGroup.get('albumYearCtrl');

    if (albumName.valid && artistName.valid && year.valid && isNotNullOrUndefined(this.albumImageUploadData.croppedImageBase64) &&
      this.albumImageUploadData.croppedImageBase64.toString().length > 0) {

      const image = UtilService.base64URItoBlob(this.albumImageUploadData.croppedImageBase64.toString());

      const payload: AlbumCreateRequest = {
        name: albumName.value,
        artistSurrogateKey: artistName.value.substring(artistName.value.lastIndexOf(Constants.Symbol.DOLLAR_SIGN) + 1),
        year: new Date(year.value).getFullYear()
      };

      if (this.albumAdapter.createAlbum(UtilService.dataToBlob(payload), image)) {
        this.destroyInputs();
      }

    } else {
      if (!albumName.valid) {
        this.defaultSnackBar.openSnackBar('Album name is invalid', true);
      } else if (!artistName.valid) {
        this.defaultSnackBar.openSnackBar('Artist name is invalid', true);
      } else if (!year.valid) {
        this.defaultSnackBar.openSnackBar('Year is invalid', true);
      } else if (!isNotNullOrUndefined(this.albumImageUploadData.croppedImageBase64)) {
        this.defaultSnackBar.openSnackBar('Please upload a Album image', true);
      }
    }
  }

  public destroyInputs(): void {
    this.suggestionUserInterfaceArtist.chipSelectedItems.splice(0);
    this.yearPickerComponent.writeValue(null);
    this.albumAddingFormGroup.reset();
    this.albumImageUploadData.croppedImageBase64 = null;
    this.albumImageUploadData.originalImageBase64 = null;
    this.albumImageUploadData.croppedImagePositions = null;
  }
}

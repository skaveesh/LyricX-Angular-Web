import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Constants} from '../../../../../constants/constants';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatDialog} from '@angular/material';
import {GenreAdapterService} from '../../../../../services/rest/genre-adapter.service';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {DefaultSnackBarComponent} from '../../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {UtilService} from '../../../../../services/util.service';
import {ArtistAdapterService} from '../../../../../services/rest/artist-adapter.service';
import {ArtistResponseData, ArtistSaveRequest} from '../../../../../dto/artist';
import {ImageUploadDialogFacade} from '../../../../../classes/image-upload-dialog-facade';
import {ImageUploadData} from '../../../../../dto/image-upload-data';
import AppConstant = Constants.AppConstant;
import {StaticSelectionController} from '../../../../../classes/static-selection-controller';
import {ContributorUtilService} from '../../../../../services/contributor-util.service';
import {filter, map} from 'rxjs/operators';
import {ResourceUrl} from '../../../../../constants/resource-url';

@Component({
  selector: 'app-add-artist',
  templateUrl: './add-artist.component.html',
  styleUrls: ['./add-artist.component.css']
})
export class AddArtistComponent implements OnInit, AfterViewInit {

  private artistImageUploadData: ImageUploadData = {
    croppedImageBase64: null,
    croppedImagePositions: null,
    originalImageBase64: null
  };

  private artistImageUploadDialogFacade: ImageUploadDialogFacade;

  artistAddingFormGroup: FormGroup;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  genreController: StaticSelectionController;
  genreCtrl = new FormControl();

  @ViewChild('genreInput', {static: false}) genreInput: ElementRef<HTMLInputElement>;

  @ViewChild('autoCompleteGenre', {static: false}) matAutocomplete: MatAutocomplete;

  @ViewChild('artistImage', {static: false}) artistImage: ElementRef<HTMLInputElement>;

  private surrogateKey: string = null;

  constructor(private router: Router, private _formBuilder: FormBuilder, private genreAdapter: GenreAdapterService,
              private artistAdapter: ArtistAdapterService, private contributorUtilService: ContributorUtilService,
              public dialog: MatDialog, private defaultSnackBar: DefaultSnackBarComponent) {

    this.artistImageUploadDialogFacade = new ImageUploadDialogFacade(this.dialog);

    this.genreController = new StaticSelectionController(this.genreAdapter, this.genreCtrl, true);
  }

  ngOnInit() {
    this.artistAddingFormGroup = this._formBuilder.group({
      artistNameCtrl: ['', Validators.required],
      genreCtrl: ''
    });
  }

  ngAfterViewInit(): void {
    this.genreController.setMatAutoComplete(this.matAutocomplete);
    this.genreController.setStaticSelectionInput(this.genreInput);

    setTimeout(() => this.contributorUtilService.getArtistEditData$()
      .pipe(filter(res => res !== null))
      .subscribe(res => this.autoFillArtistEditFields(res)), 500);
  }

  backToContributor() {
    this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.CONTRIBUTE);
  }

  getArtistImage(): string | ArrayBuffer {
    if (isNotNullOrUndefined(this.artistImageUploadData.croppedImageBase64) &&
      this.artistImageUploadData.croppedImageBase64.toString().length > 0) {
      return this.artistImageUploadData.croppedImageBase64;
    }

    return Constants.Asset.ARTIST_IMAGE;
  }

  openArtistImageUploadDialog() {
    this.artistImageUploadDialogFacade.openImageSelectingDialog(AppConstant.ARTIST, this.artistImageUploadData.croppedImageBase64,
      this.artistImageUploadData.originalImageBase64, this.artistImageUploadData.croppedImagePositions)
      .subscribe(result => this.artistImageUploadData = result);
  }

  public submitArtist(): void {
    const artistName = this.artistAddingFormGroup.get('artistNameCtrl');

    if (artistName.valid && this.genreController.staticSelection.length > 0) {

      const payload: ArtistSaveRequest = {
        surrogateKey: this.surrogateKey,
        name: artistName.value,
        genreIdList: this.genreCtrl.value
      };

      let image = null;

      if (this.artistImageUploadData.croppedImageBase64 !== null) {
        image = UtilService.base64URItoBlob(this.artistImageUploadData.croppedImageBase64.toString());
      }

      if (this.surrogateKey === null && this.artistImageUploadData.croppedImageBase64 === null) {
        this.defaultSnackBar.openSnackBar('Please upload a Artist image', true);
      }

      this.artistAdapter.saveArtist(payload, image).subscribe(response => {
        this.defaultSnackBar.openSnackBar('Artist saving successful');
        this.destroyInputs();
      }, error => {
        console.error(error);
        this.defaultSnackBar.openSnackBar('Artist saving failed', true);
      });

    } else {
      if (!artistName.valid) {
        this.defaultSnackBar.openSnackBar('Artist name is invalid', true);
      } else if (this.genreController.staticSelection.length === 0) {
        this.defaultSnackBar.openSnackBar('Genres cannot be empty', true);
      }
    }
  }

  private destroyInputs(): void {
    this.artistAddingFormGroup.reset();
    this.genreController.staticSelection.splice(0);
    this.artistImageUploadData.croppedImageBase64 = null;
    this.artistImageUploadData.originalImageBase64 = null;
    this.artistImageUploadData.croppedImagePositions = null;
    this.artistImage.nativeElement.src = Constants.Asset.ARTIST_IMAGE;
  }

  private autoFillArtistEditFields(artistResponseData: ArtistResponseData) {
    this.surrogateKey = artistResponseData.surrogateKey;
    this.artistAddingFormGroup.controls.artistNameCtrl.setValue(artistResponseData.name);

    UtilService.getBase64FromUrl(ResourceUrl.ImageResource.ARTIST_IMAGE_BASE_URL + artistResponseData.imgUrl).then(res => this.artistImage.nativeElement.src = res.toString());

this.genreAdapter.getAllSelections()
  .pipe(map(genre => {

    const genreList: string[] = [];

    genre.forEach(x => {
      artistResponseData.genreIdList.forEach(y => {
        if (x.substring(x.lastIndexOf(Constants.Symbol.DOLLAR_SIGN) + 1) === y.toString()) {
          genreList.push(x);
        }
      });
    });

    return genreList;
  }))
  .subscribe(genre => {
    this.genreController.staticSelection.push(...genre);
    this.genreCtrl.setValue(artistResponseData.genreIdList);
  });


  }
}

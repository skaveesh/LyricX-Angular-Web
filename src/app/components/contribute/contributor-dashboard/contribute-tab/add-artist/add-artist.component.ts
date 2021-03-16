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
import {ArtistCreateRequest} from '../../../../../dto/artist';
import {GenreController} from '../../../../../classes/genre-controller';
import {ImageUploadDialogFacade} from '../../../../../classes/image-upload-dialog-facade';
import {ImageUploadData} from '../../../../../dto/image-upload-data';
import AppConstant = Constants.AppConstant;

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

  genreController: GenreController;
  genreCtrl = new FormControl();

  @ViewChild('genreInput', {static: false}) genreInput: ElementRef<HTMLInputElement>;

  @ViewChild('autoCompleteGenre', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private router: Router, private _formBuilder: FormBuilder, private genreAdapter: GenreAdapterService,
              private artistAdapter: ArtistAdapterService, public dialog: MatDialog, private defaultSnackBar: DefaultSnackBarComponent) {

    this.artistImageUploadDialogFacade = new ImageUploadDialogFacade(this.dialog);

    this.genreController = new GenreController(this.genreAdapter, this.genreCtrl);
  }

  ngOnInit() {
    this.artistAddingFormGroup = this._formBuilder.group({
      artistNameCtrl: ['', Validators.required],
      genreCtrl: ''
    });
  }

  ngAfterViewInit(): void {
    this.genreController.setMatAutoComplete(this.matAutocomplete);
    this.genreController.setGenreInput(this.genreInput);
  }

  backToContributor() {
    this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.CONTRIBUTE);
  }

  getArtistImage(): string | ArrayBuffer {
    if (isNotNullOrUndefined(this.artistImageUploadData.croppedImageBase64) && this.artistImageUploadData.croppedImageBase64.toString().length > 0) {
      return this.artistImageUploadData.croppedImageBase64;
    }

    return Constants.Assert.ARTIST_IMAGE;
  }

  openArtistImageUploadDialog() {
    this.artistImageUploadDialogFacade.openDialog(AppConstant.ARTIST, this.artistImageUploadData.croppedImageBase64,
      this.artistImageUploadData.originalImageBase64, this.artistImageUploadData.croppedImagePositions)
      .subscribe(result => this.artistImageUploadData = result);
  }

  public submitArtist(): void {
    const artistName = this.artistAddingFormGroup.get('artistNameCtrl');

    if (artistName.valid && this.genreController.genre.length > 0
      && isNotNullOrUndefined(this.artistImageUploadData.croppedImageBase64) && this.artistImageUploadData.croppedImageBase64.toString().length > 0) {
      const image = UtilService.base64URItoBlob(this.artistImageUploadData.croppedImageBase64.toString());

      const payload: ArtistCreateRequest = {
        name: artistName.value,
        genreIdList: UtilService.extractIdsFromChipListArray(this.genreController.genre)
      };

      if (this.artistAdapter.createArtist(UtilService.dataToBlob(payload), image)) {
        this.destroyInputs();
      }

    } else {
      if (!artistName.valid) {
        this.defaultSnackBar.openSnackBar('Artist name is invalid', true);
      } else if (this.genreController.genre.length === 0) {
        this.defaultSnackBar.openSnackBar('Genres cannot be empty', true);
      } else if (!isNotNullOrUndefined(this.artistImageUploadData.croppedImageBase64)) {
        this.defaultSnackBar.openSnackBar('Please upload a Artist image', true);
      }
    }
  }

  private destroyInputs(): void {
    this.artistAddingFormGroup.reset();
    this.genreController.genre.splice(0);
    this.artistImageUploadData.croppedImageBase64 = null;
    this.artistImageUploadData.originalImageBase64 = null;
    this.artistImageUploadData.croppedImagePositions = null;
  }
}

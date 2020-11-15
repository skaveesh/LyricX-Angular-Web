import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Constants} from '../../../../../constants/constants';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog} from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith, take} from 'rxjs/operators';
import {GenreAdapterService} from '../../../../../services/rest/genre-adapter.service';
import {DefaultDialogComponent} from '../../../../popups-and-modals/default-dialog/default-dialog.component';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {CropperPosition} from 'ngx-image-cropper';
import {DialogData} from '../../../../../dto/dialog-data';

@Component({
  selector: 'app-add-artist',
  templateUrl: './add-artist.component.html',
  styleUrls: ['./add-artist.component.css']
})
export class AddArtistComponent implements OnInit {
  private artistCroppedImageBase64: string;
  private artistOriginalImageBase64: string;
  private artistCroppedImagePositions: CropperPosition;

  artistAddingFormGroup: FormGroup;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  genreCtrl = new FormControl();
  filteredGenre: Observable<string[]>;
  genre: string[] = [];
  displayedGenre: string[] = [];

  @ViewChild('genreInput', {static: false}) genreInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteGenre', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private router: Router, private _formBuilder: FormBuilder, private genreAdapter: GenreAdapterService, public dialog: MatDialog) {
    this.genreAdapter.getAllGenres();
  }

  ngOnInit() {
    this.artistAddingFormGroup = this._formBuilder.group({
      artistNameCtrl: '',
      genreCtrl: ''
    });

    this.genreAdapter.allGenre.pipe(
      take(this.genreAdapter.allGenre.getValue().length <= 0 ? 2 : 1)
    ).subscribe(value => {
      this.displayedGenre.push(...value);
      this.pipeOnValueChanges();
    }, e => console.log('error'));
  }

  add(event: MatChipInputEvent): void {
    // Add genre only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add genre
      if ((value || '').trim()) {
        this.genre.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.genreCtrl.setValue(null);
    }
  }

  onKey(event: KeyboardEvent): void {
    const value = this.genreInput.nativeElement.value;

    this.displayedGenre = [];
    this.genreAdapter.allGenre.getValue().forEach((x) => {
      if (x.toLowerCase().includes(value.toLowerCase())) {
        this.displayedGenre.push(x);
      }
    });

    this.pipeOnValueChanges();
  }

  remove(genre: string): void {
    const index = this.genre.indexOf(genre);

    if (index >= 0) {
      this.genre.splice(index, 1);
    }
  }

  private pipeOnValueChanges() {
    this.filteredGenre = this.genreCtrl.valueChanges.pipe(
      startWith(null),
      map((genre: string | null) => genre ? this._filter(genre) : this.displayedGenre.slice()));
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    const index = this.genre.indexOf(event.option.value);

    if (index < 0) {
      this.genre.push(event.option.value);
    }

    this.genreInput.nativeElement.value = '';
    this.genreCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.displayedGenre.filter(genre => genre.toLowerCase().indexOf(filterValue) === 0);
  }

  backToContributor() {
    this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.CONTRIBUTE);
  }

  getArtistImage(): string {
    if (isNotNullOrUndefined(this.artistCroppedImageBase64) && this.artistCroppedImageBase64.length > 0) {
      return this.artistCroppedImageBase64;
    }

    return Constants.Assert.ARTIST_IMAGE;
  }

  openDialog(): void {

    const dataObj = isNotNullOrUndefined(this.artistCroppedImageBase64) ?
      {injectedTitle: Constants.AppConstant.ARTIST, originalImageBase64: this.artistOriginalImageBase64, cropperPositions: this.artistCroppedImagePositions} :
        {injectedTitle: Constants.AppConstant.ARTIST};

    const dialogRef = this.dialog.open(DefaultDialogComponent, {
      disableClose: true,
      maxWidth: '90vw',
      data: dataObj
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (isNotNullOrUndefined(result)) {
        if (isNotNullOrUndefined(result.originalImageBase64)) {
          this.artistOriginalImageBase64 = result.originalImageBase64;
        }

        if (isNotNullOrUndefined(result.croppedImageBase64)) {
          this.artistCroppedImageBase64 = result.croppedImageBase64;
        }

        if (isNotNullOrUndefined(result.cropperPositions)) {
          this.artistCroppedImagePositions = result.cropperPositions;
        }
      }
    });
  }
}

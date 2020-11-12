import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Constants} from '../../../../../constants/constants';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-add-artist',
  templateUrl: './add-artist.component.html',
  styleUrls: ['./add-artist.component.css']
})
export class AddArtistComponent implements OnInit {

  artistAddingFormGroup: FormGroup;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  genreCtrl = new FormControl();
  filteredGenre: Observable<String[]>;
  genre: string[] = [];
  allGenre: string[] = ['Apple$1', 'Lemon$2', 'Lime$3', 'Orange$4', 'Strawberry$5', 'aa$6', 'ba$7', 'ac$8', 'da$9', 'ae$10', 'af$11', 'ag$12', 'ah$13', 'ia$14', 'ja$15'];
  displayedGenre: string[] = [];

  @ViewChild('genreInput', {static: false}) genreInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteGenre', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private router: Router, private _formBuilder: FormBuilder) {
    this.displayedGenre.push(...this.allGenre);
    this.pipeOnValueChanges();
  }

  ngOnInit() {
    this.artistAddingFormGroup = this._formBuilder.group({
      artistNameCtrl: '',
      genreCtrl: ''
    });
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
    this.allGenre.forEach((x) => {
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

  private pipeOnValueChanges(){
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
}

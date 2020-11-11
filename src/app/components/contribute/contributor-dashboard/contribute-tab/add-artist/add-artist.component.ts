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
  filteredGenre: Observable<string[]>;
  genre: string[] = [];
  displayedGenre: string[] = [];
  allGenre: string[] = ['Apple$1', 'Lemon$2', 'Lime$3', 'Orange$4', 'Strawberry$5', 'a$6', 'b$7', 'c$8','d$9','e$10','f$11','g$12','h$13','i$14','j$15'];

  @ViewChild('genreInput', {static: false}) genreInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteGenre', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private router: Router, private _formBuilder: FormBuilder) {
    this.filteredGenre = this.genreCtrl.valueChanges.pipe(
      startWith(null),
      map((genre: string | null) => genre ? this._filter(genre) : this.displayedGenre.slice()));
  }

  ngOnInit() {
    this.artistAddingFormGroup = this._formBuilder.group({
      artistNameCtrl: '',
      genreCtrl: ''
    });

    this.fillDisplayedGenresWithGenresFromAllGenres();
  }

  private fillDisplayedGenresWithGenresFromAllGenres() {
    let count = 0;
    while (this.displayedGenre.length < 5) {
      this.displayedGenre.push(this.allGenre[count]);
      this.allGenre.splice(0, 1, this.allGenre[count]);
      count++;
    }
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.genre.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      console.log(input);
      const index = this.allGenre.indexOf(value);
      if (index !== -1) {
        this.allGenre.splice(index, 1, this.allGenre[index]);
      }

      this.fillDisplayedGenresWithGenresFromAllGenres();

      this.genreCtrl.setValue(null);
    }
  }

  remove(genre: string): void {
    const index = this.genre.indexOf(genre);

    if (index >= 0) {
      this.genre.splice(index, 1);
    }

    this.allGenre.push(genre);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.genre.push(event.option.viewValue);
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

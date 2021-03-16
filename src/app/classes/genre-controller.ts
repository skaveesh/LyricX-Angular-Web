import {map, startWith, take} from 'rxjs/operators';
import {GenreAdapterService} from '../services/rest/genre-adapter.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {ElementRef} from '@angular/core';

export class GenreController {

  private genreInput: ElementRef<HTMLInputElement>;
  private genreAdapterService: GenreAdapterService;

  public filteredGenre: Observable<string[]>;
  public genre: string[] = [];
  private displayedGenre: string[] = [];

  private genreCtrl: FormControl;
  private matAutocomplete: MatAutocomplete;

  constructor(genreAdapterService: GenreAdapterService, genreCtrl: FormControl) {
    this.genreAdapterService = genreAdapterService;
    this.genreCtrl = genreCtrl;
    this.genreAdapterService.getAllGenres();
    this.init();
  }

  public setMatAutoComplete(matAutocomplete: MatAutocomplete) {
    this.matAutocomplete = matAutocomplete;
  }

  public setGenreInput(genreInput: ElementRef<HTMLInputElement>) {
    this.genreInput = genreInput;
  }

  private init(): void {
    this.genreAdapterService.allGenre.pipe(
      take(this.genreAdapterService.allGenre.getValue().length <= 0 ? 2 : 1)
    ).subscribe(value => {
      this.displayedGenre.push(...value);
      this.pipeOnValueChanges();
    }, e => {
      throw new Error('Error while fetching genres');
    });
  }

  public add(event: MatChipInputEvent): void {
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

  public onKey(event: KeyboardEvent): void {
    const value = this.genreInput.nativeElement.value;

    this.displayedGenre = [];
    this.genreAdapterService.allGenre.getValue().forEach((x) => {
      if (x.toLowerCase().includes(value.toLowerCase())) {
        this.displayedGenre.push(x);
      }
    });

    this.pipeOnValueChanges();
  }

  public remove(genre: string): void {
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

  public selected(event: MatAutocompleteSelectedEvent): void {

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

}

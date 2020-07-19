import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Constants} from '../constants/constants';
import AlbumSuggestion = Constants.AlbumSuggest;
import AlbumSuggestType = Constants.AlbumSuggestedItem;
import {ElementRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SuggestionService} from '../services/suggestion.service';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

export class SuggestionUserInterface {

  filteredFruits: Observable<String[]>;
  fruitInput: ElementRef<HTMLInputElement>;
  fruitCtrl = new FormControl();
  chipSelectedFruits: AlbumSuggestType[] = [];

  private suggestionService: SuggestionService;
  private matAutocomplete : MatAutocomplete;
  private allowFreeTextAddFruit = false;
  private inputAlbumNameModify: string = '';
  private allFruits: AlbumSuggestType[] = null;

  constructor(suggestionService: SuggestionService){
    this.suggestionService = suggestionService;

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(<string>null),
      map(fruitName => this.filterOnValueChange(fruitName))
    );
  }

  setFruitInput(fruitInput: ElementRef<HTMLInputElement>){
    this.fruitInput = fruitInput;
  }

  setMatAutoComplete(matAutocomplete : MatAutocomplete){
    this.matAutocomplete = matAutocomplete;
  }

  addFruit(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (this.matAutocomplete.isOpen) {
      return;
    }

    if ((value || '').trim()) {
      this.selectFruitByName(value.trim());
    }

    this.resetInputs();
  }

  remove(fruit: AlbumSuggestType): void {
    const index = this.chipSelectedFruits.indexOf(fruit);
    //add to the drop down list after removing from the input field

    if (index >= 0) {
      this.chipSelectedFruits.splice(index, 1);
      this.resetInputs();
    }
  }

  fruitSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectFruitByName(event.option.value);
    this.resetInputs();
  }

  private resetInputs() {
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  filterOnValueChange(albumName: string | null): String[] {
    let result: String[] = [];

    if (this.allFruits !== null) {
      let allFruitLessSelected = this.allFruits.filter(fruit => this.chipSelectedFruits.indexOf(fruit) < 0);

      if (albumName) {
        result = this.filterFruit(allFruitLessSelected, albumName);
      } else {
        result = allFruitLessSelected.map(fruit => fruit.albumName);
      }
    }
    return result;
  }

  private filterFruit(fruitList: AlbumSuggestType[], fruitName: String): String[] {
    let filteredFruitList: AlbumSuggestType[] = [];
    const filterValue = fruitName.toLowerCase();
    let fruitMatchingFruitName = fruitList.filter(fruit => fruit.albumName.toLowerCase().indexOf(filterValue) === 0);

    if (fruitMatchingFruitName.length || this.allowFreeTextAddFruit) {
      filteredFruitList = fruitMatchingFruitName;
    } else {
      filteredFruitList = fruitList;
    }

    return filteredFruitList.map(fruit => fruit.albumName);
  }

  private selectFruitByName(fruitName) {

    if (this.allFruits !== null) {
      let foundFruit = this.allFruits.filter(fruit => fruit.albumName == fruitName);

      //only allow of adding one chip this.chipSelectedFruits.length === 0
      if (foundFruit.length && this.chipSelectedFruits.length === 0) {
        this.chipSelectedFruits.push(foundFruit[0]);
      } else {
        //only when allowFreeTextAddFruit is true
      }
    }
  }

  onKey(event: KeyboardEvent) {

    if (this.inputAlbumNameModify.localeCompare(this.fruitInput.nativeElement.value) !== 0 && this.chipSelectedFruits.length === 0) {
      this.inputAlbumNameModify = this.fruitInput.nativeElement.value;

      let x: AlbumSuggestion = {
        albumName: this.fruitInput.nativeElement.value
      };
      this.suggestionService.getAlbumSuggestion(x);
    }
  }

  getSelectedValue() {
    //TODO should remove later
    this.chipSelectedFruits.forEach(x => console.log(x));
  }

  pushDataFromSuggestionService(data : AlbumSuggestType[]){
    this.allFruits = [];

    if (data !== null) {
      data.forEach(y => {
        let a = <AlbumSuggestType>{
          surrogateKey: y.surrogateKey,
          albumName: y.albumName + '$' + y.surrogateKey
        };

        this.allFruits.push(a);
      });
    }
  }
}

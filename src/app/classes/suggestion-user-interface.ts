import {Observable} from 'rxjs';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Constants} from '../constants/constants';
import AlbumSuggestion = Constants.AlbumSuggest;
import AlbumSuggestType = Constants.AlbumSuggestedItem;
import {ElementRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SuggestionService} from '../services/suggestion.service';

export class SuggestionUserInterface {

  fruitInput: ElementRef<HTMLInputElement>;
  fruitCtrl = new FormControl();
  private suggestionService: SuggestionService;


  private matAutocomplete : MatAutocomplete;
  chipSelectedFruits: AlbumSuggestType[] = [];
  allFruits: AlbumSuggestType[] = null;

  private allowFreeTextAddFruit = false;
  private inputAlbumNameModify: string = '';

  constructor(suggestionService: SuggestionService){
    this.suggestionService = suggestionService;
  }

  setFruitInput(fruitInput: ElementRef<HTMLInputElement>){
    this.fruitInput = fruitInput;
  }

  setMatAutoComplete(matAutocomplete : MatAutocomplete){
    this.matAutocomplete = matAutocomplete;
  }

  addFruit(event: MatChipInputEvent): void {
    if (this.matAutocomplete.isOpen) {
      return;
    }

    const input = event.input;
    const value = event.value;
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
}

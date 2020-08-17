import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Constants} from '../constants/constants';
import {ElementRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SuggestionService} from '../services/suggestion.service';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import ItemSuggestion = Constants.ItemSuggest;
import ItemSuggestType = Constants.SuggestedItem;

export class SuggestionUserInterface {

  filteredItems: Observable<String[]>;
  itemInput: ElementRef<HTMLInputElement>;
  itemCtrl = new FormControl();
  chipSelectedItems: ItemSuggestType[] = [];

  private suggestionService: SuggestionService;
  private matAutocomplete: MatAutocomplete;
  private allowFreeTextAddItem = false;
  private inputItemNameModify: string = '';
  private allItems: ItemSuggestType[] = null;
  readonly multiChipsSupport: boolean;

  private readonly callback: any; //saves a function call to a service

  constructor(suggestionService: SuggestionService, multiChipsSupport: boolean, callback: any) {
    this.suggestionService = suggestionService;
    this.multiChipsSupport = multiChipsSupport;
    this.callback = callback;

    this.filteredItems = this.itemCtrl.valueChanges.pipe(
      startWith(<string>null),
      map(itemName => this.filterOnValueChange(itemName))
    );
  }

  setItemInput(itemInput: ElementRef<HTMLInputElement>) {
    this.itemInput = itemInput;
  }

  setMatAutoComplete(matAutocomplete: MatAutocomplete) {
    this.matAutocomplete = matAutocomplete;
  }

  addItem(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (this.matAutocomplete.isOpen) {
      return;
    }

    if ((value || '').trim()) {
      this.selectItemByName(value.trim());
    }

    this.resetInputs();
  }

  remove(item: ItemSuggestType): void {
    const index = this.chipSelectedItems.indexOf(item);
    //add to the drop down list after removing from the input field

    if (index >= 0) {
      this.chipSelectedItems.splice(index, 1);
      this.resetInputs();
    }
  }

  itemSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectItemByName(event.option.value);
    this.resetInputs();
  }

  private resetInputs() {
    this.itemInput.nativeElement.value = '';
    this.itemCtrl.setValue(null);
  }

  private filterOnValueChange(itemName: string | null): String[] {
    let result: String[] = [];

    if (this.allItems !== null) {
      let allItemLessSelected = this.allItems.filter(item => this.chipSelectedItems.indexOf(item) < 0);

      if (itemName) {
        result = this.filterItem(allItemLessSelected, itemName);
      } else {
        result = allItemLessSelected.map(item => item.name);
      }
    }
    return result;
  }

  private filterItem(itemList: ItemSuggestType[], itemName: String): String[] {
    let filteredItemList: ItemSuggestType[] = [];
    const filterValue = itemName.toLowerCase();
    let itemMatchingItemName = itemList.filter(item => item.name.toLowerCase().indexOf(filterValue) === 0);

    if (itemMatchingItemName.length || this.allowFreeTextAddItem) {
      filteredItemList = itemMatchingItemName;
    } else {
      filteredItemList = itemList;
    }

    return filteredItemList.map(item => item.name);
  }

  private selectItemByName(itemName) {

    if (this.allItems !== null) {
      let foundItem = this.allItems.filter(item => item.name == itemName);

      //only allow of adding one chip this.chipSelectedItems.length === 0
      if ((() => {
        if (this.multiChipsSupport) {
          return foundItem.length;
        } else {
          return foundItem.length && this.chipSelectedItems.length === 0;
        }
      })()) {

        //only allows to add the same item to the list once
        for (let i = 0; i < this.chipSelectedItems.length || this.chipSelectedItems.length === 0; i++) {

          if (this.chipSelectedItems.length === 0) {
            this.chipSelectedItems.push(foundItem[0]);
            break;
          }

          if (this.chipSelectedItems[i].name === foundItem[0].name) {
            break;
          }

          if (i == this.chipSelectedItems.length - 1) {
            this.chipSelectedItems.push(foundItem[0]);
          }
        }

      } else {
        //only when allowFreeTextAddItem is true
      }
    }
  }

  onKey(event: KeyboardEvent) {
    if (((): boolean => {
      if (this.multiChipsSupport) {
        return this.inputItemNameModify.localeCompare(this.itemInput.nativeElement.value) !== 0;
      } else {
        return this.inputItemNameModify.localeCompare(this.itemInput.nativeElement.value) !== 0 && this.chipSelectedItems.length === 0;
      }
    })()) {

      this.inputItemNameModify = this.itemInput.nativeElement.value;

      let itemSuggest: ItemSuggestion = {
        name: this.itemInput.nativeElement.value
      };

      //function to execute on the service - passed through constructor
      this.callback(itemSuggest);
    }
  }

  getSelectedValue() {
    //TODO should remove later
    this.chipSelectedItems.forEach(x => console.log(x));
  }

  public pushDataToAllItems(data: ItemSuggestType[]) {
    this.allItems = [];

    if (data !== null) {
      data.forEach(item => {
        let itemSuggestType = <ItemSuggestType>{
          surrogateKey: item.surrogateKey,
          name: item.name + Constants.DOLLAR_SIGN + item.surrogateKey
        };
        this.allItems.push(itemSuggestType);
      });
    }
  }
}

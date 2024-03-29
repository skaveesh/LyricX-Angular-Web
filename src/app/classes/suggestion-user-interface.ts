import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Constants} from '../constants/constants';
import {ElementRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SuggestionService} from '../services/suggestion.service';
import {Observable} from 'rxjs';
import {of} from 'rxjs';
import {ItemSuggest, SuggestedItem} from '../dto/item-suggest';
// import {map, startWith} from 'rxjs/operators';

export class SuggestionUserInterface {

  filteredItems: Observable<String[]>;
  itemInput: ElementRef<HTMLInputElement>;
  itemCtrl: FormControl;
  chipSelectedItems: SuggestedItem[] = [];

  private suggestionService: SuggestionService;
  private matAutocomplete: MatAutocomplete;
  private allowFreeTextAddItem = false;
  private inputItemNameModify = '';
  private allItems: SuggestedItem[] = null;
  readonly multiChipsSupport: boolean;

  private readonly callback: any; // saves a function call to a service

  constructor(suggestionService: SuggestionService, itemCtrl: FormControl, multiChipsSupport: boolean, callback: any) {
    this.suggestionService = suggestionService;
    this.itemCtrl = itemCtrl;
    this.multiChipsSupport = multiChipsSupport;
    this.callback = callback;

     /** this will list items whenever HTML DOM is modified
     this.filteredItems = this.itemCtrl.valueChanges.pipe(
       startWith(<string>null),
       map(itemName => this.filterOnValueChange(itemName))
     );*/
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

  remove(item: SuggestedItem): void {
    const index = this.chipSelectedItems.indexOf(item);
    // add to the drop down list after removing from the input field

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

    // Do not reset FormControl input as we are setting it to the array of items selected
    // this.itemCtrl.setValue(null);
    this.setFormControlValue();
  }

  private filterOnValueChange(itemName: string | null): String[] {
    let result: String[] = [];

    if (this.allItems !== null) {
      const allItemLessSelected = this.allItems.filter(item => this.chipSelectedItems.indexOf(item) < 0);

       /** this will filter suggested list from the API
       if (itemName) {
         result = this.filterItem(allItemLessSelected, itemName);
       } else {
        result = allItemLessSelected.map(item => item.name);
       }*/

      result = allItemLessSelected.map(item => item.name);

    }
    return result;
  }

  /**
   * This will filter the suggested list from the API
   * @param itemList the item list
   * @param itemName the item name
   */
  private filterItem(itemList: SuggestedItem[], itemName: String): String[] {
    let filteredItemList: SuggestedItem[] = [];
    const filterValue = itemName.toLowerCase();
    const itemMatchingItemName = itemList.filter(item => item.name.toLowerCase().indexOf(filterValue) === 0);

    if (itemMatchingItemName.length || this.allowFreeTextAddItem) {
      filteredItemList = itemMatchingItemName;
    } else {
      filteredItemList = itemList;
    }

    return filteredItemList.map(item => item.name);
  }

  private selectItemByName(itemName) {

    if (this.allItems !== null) {
      const foundItem = this.allItems.filter(item => item.name === itemName);

      // only allow of adding one chip this.chipSelectedItems.length === 0
      if ((() => {
        if (this.multiChipsSupport) {
          return foundItem.length;
        } else {
          return foundItem.length && this.chipSelectedItems.length === 0;
        }
      })()) {

        // only allows to add the same item to the list once
        for (let i = 0; i < this.chipSelectedItems.length || this.chipSelectedItems.length === 0; i++) {

          if (this.chipSelectedItems.length === 0) {
            this.chipSelectedItems.push(foundItem[0]);
            break;
          }

          if (this.chipSelectedItems[i].name === foundItem[0].name) {
            break;
          }

          if (i === this.chipSelectedItems.length - 1) {
            this.chipSelectedItems.push(foundItem[0]);
          }
        }

      } else {
        // only when allowFreeTextAddItem is true
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

      const itemSuggest: ItemSuggest = {
        name: this.itemInput.nativeElement.value
      };

      // function to execute on the service - passed through constructor
      this.callback(itemSuggest);
    }
  }

  getSelectedValue() {
    // TODO should remove later
    this.chipSelectedItems.forEach(x => console.log(x));
  }

  public pushDataToAllItems(data: SuggestedItem[]) {
    this.allItems = [];

    if (data !== null) {
      data.forEach(item => {
        const itemSuggestType = <SuggestedItem>{
          surrogateKey: item.surrogateKey,
          name: item.name + Constants.Symbol.DOLLAR_SIGN + item.surrogateKey
        };
        this.allItems.push(itemSuggestType);
      });
    }

    // filter items when item list is updated
    this.filteredItems = of(this.filterOnValueChange(this.itemCtrl.value));
  }

  /**
   * when form input change it's values set the value for FormControl
   */
  private setFormControlValue(): void {
    const arrayOfChipSelectedItems = this.chipSelectedItems.map(chipItem => chipItem.surrogateKey);
    this.itemCtrl.setValue(arrayOfChipSelectedItems);
  }
}

import {map, startWith, take, takeUntil, tap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {ElementRef} from '@angular/core';
import {StaticSelectionAdapter} from '../services/rest/static-selection-adapter';
import {Constants} from '../constants/constants';

export class StaticSelectionController {

  private staticSelectionInput: ElementRef<HTMLInputElement>;
  private staticSelectionAdapterService: StaticSelectionAdapter;

  public filteredStaticSelection: Observable<string[]>;
  public staticSelection: string[] = [];
  private displayedStaticSelection: string[] = [];
  readonly multiChipsSupport: boolean;

  private staticSelectionCtrl: FormControl;
  private matAutocomplete: MatAutocomplete;

  constructor(staticSelectionAdapterService: StaticSelectionAdapter, staticSelectionCtrl: FormControl, multiChipsSupport: boolean) {
    this.staticSelectionAdapterService = staticSelectionAdapterService;
    this.staticSelectionCtrl = staticSelectionCtrl;
    this.multiChipsSupport = multiChipsSupport;
    this.staticSelectionAdapterService.getAllSelections().subscribe(() => this.init());
  }

  public setMatAutoComplete(matAutocomplete: MatAutocomplete) {
    this.matAutocomplete = matAutocomplete;
  }

  public setStaticSelectionInput(staticSelectionInput: ElementRef<HTMLInputElement>) {
    this.staticSelectionInput = staticSelectionInput;
  }

  private init(): void {
    this.staticSelectionAdapterService.allSelections.pipe(
      take(this.staticSelectionAdapterService.allSelections.getValue().length <= 0 ? 2 : 1)
    ).subscribe(value => {
      this.displayedStaticSelection.push(...value);
      this.pipeOnValueChanges();
    }, e => {
      throw new Error('Error while fetching staticSelections');
    });
  }

  public add(event: MatChipInputEvent): void {
    // Add staticSelection only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add staticSelection
      // Since staticSelection is pre defined set of values and
      // It's disabled to add custom values this part is commented
      // if ((value || '').trim()) {
      //   this.staticSelection.push(value.trim());
      // }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.staticSelectionCtrl.setValue(null);
    }

    this.resetInput();
  }

  public onKey(event: KeyboardEvent): void {

    if (!this.multiChipsSupport && this.staticSelection.length > 0) {
      return;
    }

    const value = this.staticSelectionInput.nativeElement.value;

    this.displayedStaticSelection = [];
    this.staticSelectionAdapterService.allSelections.getValue().forEach((item) => {
      if (item.toLowerCase().includes(value.toLowerCase())) {
        this.displayedStaticSelection.push(item);
      }
    });

    this.pipeOnValueChanges();
  }

  public remove(staticSelection: string): void {
    const index = this.staticSelection.indexOf(staticSelection);

    if (index >= 0) {
      this.staticSelection.splice(index, 1);
      this.resetInput();
    }
  }

  private pipeOnValueChanges() {
    const stopSignal$ = new Subject();
    this.filteredStaticSelection = this.staticSelectionCtrl.valueChanges.pipe(
      tap(value => {
        if (value instanceof Array) {
          stopSignal$.next();
        }
      }),
      startWith(null),
      map((staticSelection: string | null) => staticSelection ? this._filter(staticSelection) : this.displayedStaticSelection.slice()),
      takeUntil(stopSignal$));
  }

  public selected(event: MatAutocompleteSelectedEvent): void {

    const index = this.staticSelection.indexOf(event.option.value);

    if (((): boolean => {
      if (this.multiChipsSupport) {
        return index < 0;
      } else {
        return index < 0 && this.staticSelection.length === 0;
      }
    })()) {
      this.staticSelection.push(event.option.value);
    }

    this.resetInput();
  }

  private resetInput(): void {
    this.staticSelectionInput.nativeElement.value = '';

    // Do not reset FormControl input as we are setting it to the array of items selected
    // this.staticSelectionCtrl.setValue(null);
    this.setFormControlValue();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.displayedStaticSelection.filter(staticSelection => staticSelection.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   * when form input change it's values set the value for FormControl
   */
  private setFormControlValue(): void {
    const arrayOfChipSelectedItems = this.staticSelection.map(item => item.substring(item.lastIndexOf(Constants.Symbol.DOLLAR_SIGN) + 1));
    this.staticSelectionCtrl.setValue(arrayOfChipSelectedItems);
  }

  public getChipValueByItemCode(itemCode: string): string {
    const result = this.displayedStaticSelection.find(item => item.substring(item.lastIndexOf(Constants.Symbol.DOLLAR_SIGN) + 1) === itemCode);
    return result ? result : null;
  }
}

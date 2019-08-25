import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-contribute-tab',
  templateUrl: './contribute-tab.component.html',
  styleUrls: ['./contribute-tab.component.css']
})
export class ContributeTabComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private formBuilder: FormBuilder) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(<string>null),
      map((fruit: string | null) => {

        //remove from the drop down list after inserting into the input field
        this.allFruits = this.allFruits.filter(fruit => !this.fruits.includes(fruit));

        if (fruit) {
          return this._filter(fruit);
        } else {
          return this.allFruits.slice();
        }

      }));
  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  add(event: MatChipInputEvent, formControl : FormControl): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        if (this.allFruits.includes(value)) {
          this.fruits.push(value.trim());
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      formControl.setValue(null);
    }


  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);
    //add to the drop down list after removing from the input field
    this.allFruits.push(fruit);
    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

}

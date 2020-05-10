import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {SuggestionService} from '../../../../services/suggestion.service';
import {Constants} from '../../../../constants/constants';
import AlbumSuggestion = Constants.AlbumSuggest;
import AlbumSuggestType = Constants.AlbumSuggestedItem;

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
  filteredFruits: Observable<String[]>;
  chipSelectedFruits: AlbumSuggestType[] = [];
  allFruits: AlbumSuggestType[] = null;
  private allowFreeTextAddFruit = false;
  private inputAlbumNameModify: string = '';

  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private _formBuilder: FormBuilder, private suggestionService: SuggestionService) {
  }


  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(<string>null),
      map(fruitName => this.filterOnValueChange(fruitName))
    );

    this.suggestionService.getAlbumSuggestions().subscribe((x: AlbumSuggestType[]) => {

      this.allFruits = [];

      if (x !== null) {
        x.forEach(y => {
          let a = <AlbumSuggestType>{
            surrogateKey: y.surrogateKey,
            albumName: y.albumName + '$' + y.surrogateKey
          };

          this.allFruits.push(a);
        });
      }

    });
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

  private filterOnValueChange(albumName: string | null): String[] {
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

  getSelectedValue() {
    //TODO should remove later
     this.chipSelectedFruits.forEach(x => console.log(x));
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

}



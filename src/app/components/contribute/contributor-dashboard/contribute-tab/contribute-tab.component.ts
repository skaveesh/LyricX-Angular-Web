import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';
import {SuggestionService} from '../../../../services/suggestion.service';
import {Constants} from '../../../../constants/constants';
import AlbumSuggestType = Constants.AlbumSuggestedItem;
import {SuggestionUserInterface} from '../../../../classes/suggestion-user-interface';

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

  filteredFruits: Observable<String[]>;

 private suggestionUserInterfaceAlbum : SuggestionUserInterface;

  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private _formBuilder: FormBuilder, private suggestionService: SuggestionService) {
    this.suggestionUserInterfaceAlbum = new SuggestionUserInterface(this.suggestionService);
  }

  ngAfterViewInit() {
      this.suggestionUserInterfaceAlbum.setMatAutoComplete(this.matAutocomplete);
      this.suggestionUserInterfaceAlbum.setFruitInput(this.fruitInput);
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.filteredFruits = this.suggestionUserInterfaceAlbum.fruitCtrl.valueChanges.pipe(
      startWith(<string>null),
      map(fruitName => this.suggestionUserInterfaceAlbum.filterOnValueChange(fruitName))
    );

    this.suggestionService.getAlbumSuggestions().subscribe((x: AlbumSuggestType[]) => {

      this.suggestionUserInterfaceAlbum.allFruits = [];

      if (x !== null) {
        x.forEach(y => {
          let a = <AlbumSuggestType>{
            surrogateKey: y.surrogateKey,
            albumName: y.albumName + '$' + y.surrogateKey
          };

          this.suggestionUserInterfaceAlbum.allFruits.push(a);
        });
      }
    });

  }

}



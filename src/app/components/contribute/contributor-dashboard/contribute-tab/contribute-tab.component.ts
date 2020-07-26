import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {SuggestionService} from '../../../../services/suggestion.service';
import {Constants} from '../../../../constants/constants';
import {SuggestionUserInterface} from '../../../../classes/suggestion-user-interface';
import AlbumSuggestType = Constants.AlbumSuggest;
import ItemSuggestType = Constants.SuggestedItem;

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

  private suggestionUserInterfaceAlbum: SuggestionUserInterface;

  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private _formBuilder: FormBuilder, private suggestionService: SuggestionService) {
    this.suggestionUserInterfaceAlbum = new SuggestionUserInterface(this.suggestionService,
      (res) => this.suggestionService.getAlbumSuggestion(res));
  }

  ngAfterViewInit() {
    this.suggestionUserInterfaceAlbum.setMatAutoComplete(this.matAutocomplete);
    this.suggestionUserInterfaceAlbum.setItemInput(this.fruitInput);
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.suggestionService.getAlbumSuggestions().subscribe((albumSuggestArray: AlbumSuggestType[]) => {

      if (albumSuggestArray != null) {
        let itemSuggestArray = albumSuggestArray.map(function (albumItem) {
          let item: ItemSuggestType = {
            surrogateKey: albumItem.surrogateKey,
            name: albumItem.albumName
          };
          return item;
        });

        this.suggestionUserInterfaceAlbum.pushDataToAllItems(itemSuggestArray);
      }
    });
  }
}



import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {SuggestionService} from '../../../../services/suggestion.service';
import {Constants} from '../../../../constants/constants';
import {SuggestionUserInterface} from '../../../../classes/suggestion-user-interface';
import {FormControl} from '@angular/forms';
import AlbumSuggestType = Constants.AlbumSuggest;
import ArtistSuggestType = Constants.ArtistSuggest;
import ItemSuggestType = Constants.SuggestedItem;

@Component({
  selector: 'app-contribute-tab',
  templateUrl: './contribute-tab.component.html',
  styleUrls: ['./contribute-tab.component.css']
})
export class ContributeTabComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  albumCtrl = new FormControl();
  artistCtrl = new FormControl();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  private suggestionUserInterfaceAlbum: SuggestionUserInterface;
  private suggestionUserInterfaceArtist: SuggestionUserInterface;

  @ViewChild('albumInput', {static: false}) albumInput: ElementRef<HTMLInputElement>;
  @ViewChild('artistInput', {static: false}) artistInput: ElementRef<HTMLInputElement>;

  @ViewChild('autoCompleteAlbum', {static: false}) matAutocompleteAlbum: MatAutocomplete;
  @ViewChild('autoCompleteArtist', {static: false}) matAutocompleteArtist: MatAutocomplete;

  constructor(private _formBuilder: FormBuilder, private suggestionService: SuggestionService) {
    this.suggestionUserInterfaceAlbum = new SuggestionUserInterface(this.suggestionService, this.albumCtrl,false,
      res => this.suggestionService.getAlbumSuggestion(res));

    this.suggestionUserInterfaceArtist = new SuggestionUserInterface(this.suggestionService, this.artistCtrl,true,
      res => this.suggestionService.getArtistSuggestion(res));
  }

  ngAfterViewInit() {
    this.suggestionUserInterfaceAlbum.setMatAutoComplete(this.matAutocompleteAlbum);
    this.suggestionUserInterfaceAlbum.setItemInput(this.albumInput);

    this.suggestionUserInterfaceArtist.setMatAutoComplete(this.matAutocompleteArtist);
    this.suggestionUserInterfaceArtist.setItemInput(this.artistInput);
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      albumCtrl: ['', Validators.required],
      artistCtrl: ''
    });
    this.secondFormGroup = this._formBuilder.group({
      thirdCtrl: ''
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

    this.suggestionService.getArtistSuggestions().subscribe((artistSuggestArray: ArtistSuggestType[]) => {

      if (artistSuggestArray != null) {
        let itemSuggestArray = artistSuggestArray.map(function (artistItem) {
          let item: ItemSuggestType = {
            surrogateKey: artistItem.surrogateKey,
            name: artistItem.artistName
          };
          return item;
        });

        this.suggestionUserInterfaceArtist.pushDataToAllItems(itemSuggestArray);
      }
    });
  }
}



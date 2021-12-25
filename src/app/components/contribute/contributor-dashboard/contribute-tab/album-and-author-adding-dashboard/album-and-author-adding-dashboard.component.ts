import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {SuggestionUserInterface} from '../../../../../classes/suggestion-user-interface';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {SuggestionService} from '../../../../../services/suggestion.service';
import {AlbumResponseData, AlbumSuggest} from '../../../../../dto/album';
import {ArtistResponseData, ArtistSuggest} from '../../../../../dto/artist';
import {SuggestedItem} from '../../../../../dto/item-suggest';
import {AlbumAdapterService} from '../../../../../services/rest/album-adapter.service';
import {ContributorUtilService} from '../../../../../services/contributor-util.service';
import {filter, mergeMap, toArray} from 'rxjs/operators';
import {SongResponseData, SongWithAlbumAndArtist} from '../../../../../dto/song';
import {forkJoin, from} from 'rxjs';
import {LoadingStatusService} from '../../../../../services/loading-status.service';
import {DefaultSnackBarComponent} from '../../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {ArtistAdapterService} from '../../../../../services/rest/artist-adapter.service';

@Component({
  selector: 'app-album-and-author-adding-dashboard',
  templateUrl: './album-and-author-adding-dashboard.component.html',
  styleUrls: ['./album-and-author-adding-dashboard.component.css']
})
export class AlbumAndAuthorAddingDashboardComponent implements OnInit, AfterViewInit {

  public albumCtrl = new FormControl();
  public artistCtrl = new FormControl();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  suggestionUserInterfaceAlbum: SuggestionUserInterface;
  suggestionUserInterfaceArtist: SuggestionUserInterface;

  @ViewChild('albumInput', {static: false}) albumInput: ElementRef<HTMLInputElement>;
  @ViewChild('artistInput', {static: false}) artistInput: ElementRef<HTMLInputElement>;

  @ViewChild('autoCompleteAlbum', {static: false}) matAutocompleteAlbum: MatAutocomplete;
  @ViewChild('autoCompleteArtist', {static: false}) matAutocompleteArtist: MatAutocomplete;

  constructor(private suggestionService: SuggestionService, private albumAdapterService: AlbumAdapterService,
              private artistAdapterService: ArtistAdapterService, private contributorUtilService: ContributorUtilService,
              private loadingStatusService: LoadingStatusService, private defaultSnackBar: DefaultSnackBarComponent) {
    this.suggestionUserInterfaceAlbum = new SuggestionUserInterface(this.suggestionService, this.albumCtrl, false,
      res => this.suggestionService.getAlbumSuggestion(res));

    this.suggestionUserInterfaceArtist = new SuggestionUserInterface(this.suggestionService, this.artistCtrl, true,
      res => this.suggestionService.getArtistSuggestion(res));
  }

  ngAfterViewInit() {
    this.suggestionUserInterfaceAlbum.setMatAutoComplete(this.matAutocompleteAlbum);
    this.suggestionUserInterfaceAlbum.setItemInput(this.albumInput);

    this.suggestionUserInterfaceArtist.setMatAutoComplete(this.matAutocompleteArtist);
    this.suggestionUserInterfaceArtist.setItemInput(this.artistInput);

    this.contributorUtilService.getSongEditData()
      .pipe(filter(res => res !== null))
      .subscribe(res => this.autoFillContributorEditFields(res));
  }

  ngOnInit(): void {

    this.suggestionService.getAlbumSuggestions().subscribe((albumSuggestArray: AlbumSuggest[]) => {

      if (albumSuggestArray != null) {
        const itemSuggestArray = albumSuggestArray.map(function (albumItem) {
          const item: SuggestedItem = {
            surrogateKey: albumItem.surrogateKey,
            name: albumItem.albumName
          };
          return item;
        });

        this.suggestionUserInterfaceAlbum.pushDataToAllItems(itemSuggestArray);
      }
    });

    this.suggestionService.getArtistSuggestions().subscribe((artistSuggestArray: ArtistSuggest[]) => {

      if (artistSuggestArray != null) {
        const itemSuggestArray = artistSuggestArray.map(function (artistItem) {
          const item: SuggestedItem = {
            surrogateKey: artistItem.surrogateKey,
            name: artistItem.artistName
          };
          return item;
        });

        this.suggestionUserInterfaceArtist.pushDataToAllItems(itemSuggestArray);
      }
    });
  }

  // TODO remove this later
  filll() {

    const cx: SongWithAlbumAndArtist = new class implements SongWithAlbumAndArtist {
      album: AlbumResponseData;
      artist: ArtistResponseData;
      song: SongResponseData;
    };

    this.autoFillContributorEditFields(cx);
  }

  autoFillContributorEditFields(songWithAlbumAndArtist: SongWithAlbumAndArtist) {

    this.loadingStatusService.startLoading();

    this.albumAdapterService.getAlbum(songWithAlbumAndArtist.album.surrogateKey, false).subscribe(res => {
        const albumChipSelectedItems: any[] = [];

        const item = ContributorUtilService.defaultSurrogateKeyNameSuggestedItem(res.data.surrogateKey, res.data.name);

        albumChipSelectedItems.push(item);
        this.suggestionUserInterfaceAlbum.chipSelectedItems.push(item);
        const arrayOfChipSelectedItems = albumChipSelectedItems.map(chipItem => chipItem.surrogateKey);
        this.albumCtrl.setValue(arrayOfChipSelectedItems);
      }, () => this.defaultSnackBar.openSnackBar('Error fetching song details.', true),
      () => {
        this.loadingStatusService.stopLoading();
        // sending two events
        this.contributorUtilService.sendContributorStepper(true);
        this.contributorUtilService.sendContributorStepper(true);
      });

    const artistChipSelectedItems: any[] = [];

    from(songWithAlbumAndArtist.song.artistSurrogateKeyList)
      .pipe(
        toArray(),
        mergeMap(project => {
          const observables = project.map(artistSurrogateKey => this.artistAdapterService.getArtist(artistSurrogateKey, false));
          return forkJoin(observables);
        }),
      ).subscribe(res => {

      res.forEach(artist => {
        const item = ContributorUtilService.defaultSurrogateKeyNameSuggestedItem(artist.data.surrogateKey, artist.data.name);

        artistChipSelectedItems.push(item);
        this.suggestionUserInterfaceArtist.chipSelectedItems.push(item);
        const arrayOfChipSelectedItems = artistChipSelectedItems.map(chipItem => chipItem.surrogateKey);
        this.artistCtrl.setValue(arrayOfChipSelectedItems);
      });
    });

  }

}

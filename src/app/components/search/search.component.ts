import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, take} from 'rxjs/operators';
import {SongAdapterService} from '../../services/rest/song-adapter.service';
import {AlbumAdapterService} from '../../services/rest/album-adapter.service';
import {ArtistAdapterService} from '../../services/rest/artist-adapter.service';
import {SongResponseData} from '../../dto/song';
import {AlbumResponseData} from '../../dto/album';
import {ArtistResponseData} from '../../dto/artist';
import {DefaultSnackBarComponent} from '../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {Constants} from '../../constants/constants';
import {UtilService} from '../../services/util.service';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterViewInit {

  // MatPaginator Inputs
  totalSongElements = 0;
  totalAlbumElements = 0;
  totalArtistElements = 0;
  songPageSize = 0;
  albumPageSize = 0;
  artistPageSize = 0;
  pageSizeOptions: number[] = [5, 10, 25];

  private _songResponseData: SongResponseData[] = null;
  private _albumResponseData: AlbumResponseData[] = null;
  private _artistResponseData: ArtistResponseData[] = null;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private songAdapterService: SongAdapterService, private albumAdapterService: AlbumAdapterService,
              private artistAdapterService: ArtistAdapterService, private snackBarComponent: DefaultSnackBarComponent) {
  }

  private _query = null;

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((res) => {
      this._query = res.get('query');

      this.searchSongs(this._query, 0, 5);
      this.searchAlbums(this._query, 0, 5);
      this.searchArtists(this._query, 0, 5);
    });
  }

  ngAfterViewInit(): void {
  }

  searchSongs(query: string, pageNumber: number, pageSize: number) {
    this.songAdapterService.searchSong(this._query, pageNumber, pageSize)
      .pipe(
        filter(res => res !== null), take(1))
      .subscribe(res => {

        if (this._songResponseData !== null) {
          this._songResponseData.splice(0);
        }
        this._songResponseData = res.data.songList;
        this.totalSongElements = res.data.totalElements;

      }, () => {
        this.snackBarComponent.openSnackBar('Error while loading search results: songs', true);
      });
  }

  searchAlbums(query: string, pageNumber: number, pageSize: number) {
    this.albumAdapterService.searchAlbum(this._query, pageNumber, pageSize)
      .pipe(
        filter(res => res !== null), take(1))
      .subscribe(res => {

        if (this._albumResponseData !== null) {
          this._albumResponseData.splice(0);
        }
        this._albumResponseData = res.data.albumList;
        this.totalAlbumElements = res.data.totalElements;

      }, () => {
        this.snackBarComponent.openSnackBar('Error while loading search results: albums', true);
      });
  }

  searchArtists(query: string, pageNumber: number, pageSize: number) {
    this.artistAdapterService.searchAlbum(this._query, pageNumber, pageSize)
      .pipe(
        filter(res => res !== null), take(1))
      .subscribe(res => {

        if (this._artistResponseData !== null) {
          this._artistResponseData.splice(0);
        }
        this._artistResponseData = res.data.artistList;
        this.totalArtistElements = res.data.totalElements;

      }, () => {
        this.snackBarComponent.openSnackBar('Error while loading search results: artists', true);
      });
  }

  public navigateToSong ($event) {
    this.router.navigateByUrl( Constants.Route.SONG + Constants.Symbol.FORWARD_SLASH + $event.data);
  }

  public navigateToAlbum ($event) {
    this.router.navigateByUrl( Constants.Route.ALBUM + Constants.Symbol.FORWARD_SLASH + $event.data);
  }

  public navigateToArtist ($event) {
    this.router.navigateByUrl( Constants.Route.ARTIST + Constants.Symbol.FORWARD_SLASH + $event.data);
  }

  gotoSongPage(pageEvent: PageEvent) {
    this.searchSongs(this._query, pageEvent.pageIndex, pageEvent.pageSize);
  }

  gotoAlbumPage(pageEvent: PageEvent) {
    this.searchAlbums(this._query, pageEvent.pageIndex, pageEvent.pageSize);
  }

  gotoArtistPage(pageEvent: PageEvent) {
    this.searchArtists(this._query, pageEvent.pageIndex, pageEvent.pageSize);
  }

  constructSongAlbumArtUrl(imgUrl: string): string {
    return UtilService.constructSongAlbumArtResourceUrl(imgUrl);
  }

  constructAlbumArtImageUrl(imgUrl: string): string {
    return UtilService.constructAlbumArtResourceUrl(imgUrl);
  }

  constructArtistImageUrl(imgUrl: string): string {
    return UtilService.constructArtistImageResourceUrl(imgUrl);
  }

  get query(): any {
    return this._query;
  }

  get songList(): SongResponseData[] {
    return this._songResponseData;
  }

  get albumList(): AlbumResponseData[] {
    return this._albumResponseData;
  }

  get artistList(): ArtistResponseData[] {
    return this._artistResponseData;
  }
}

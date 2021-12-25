import {AfterViewInit, Component} from '@angular/core';
import {ContributorAdapterService} from '../../../../services/rest/contributor-adapter.service';
import {MyContributionMetadataResponse} from '../../../../dto/contributor';
import {DefaultSnackBarComponent} from '../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {LoadingStatusService} from '../../../../services/loading-status.service';
import {filter, first, take, tap} from 'rxjs/operators';
import {SongWithAlbumAndArtist} from '../../../../dto/song';
import {AlbumAdapterService} from '../../../../services/rest/album-adapter.service';
import {ArtistAdapterService} from '../../../../services/rest/artist-adapter.service';
import {UtilService} from '../../../../services/util.service';
import {PageEvent} from '@angular/material';
import {ContributorUtilService} from '../../../../services/contributor-util.service';

@Component({
  selector: 'app-my-contribution-tab',
  templateUrl: './my-contribution-tab.component.html',
  styleUrls: ['./my-contribution-tab.component.css']
})
export class MyContributionTabComponent implements AfterViewInit {

  private _contributionsResponse: MyContributionMetadataResponse = null;

  private _songWithAlbumAndArtist: SongWithAlbumAndArtist[] = [];

  // MatPaginator Inputs
  length = 0;
  pageSize = 0;
  pageSizeOptions: number[] = [5, 10, 25];

  constructor(private contributorAdapterService: ContributorAdapterService, private albumAdapterService: AlbumAdapterService,
              private artistAdapterService: ArtistAdapterService, private snackBarComponent: DefaultSnackBarComponent,
              private loadingStatusService: LoadingStatusService, private contributorUtilService: ContributorUtilService) {
  }

  ngAfterViewInit() {
    this.getMyContributions(0, 5);
  }

  private getMyContributions(pageNumber: number, pageSize: number) {

    this.contributorUtilService.getContributorTabIndex()
      .pipe(filter(value => value === 2), first())
      .subscribe(() => {

      this.contributorAdapterService.requestMyContributions(pageNumber, pageSize)
      .pipe(
        filter(res => res !== null), take(1),
        tap(() =>  this.loadingStatusService.startLoading()))
      .subscribe(res => {

        this._contributionsResponse = res;
        this.length = res.totalElements;

          this._contributionsResponse.songList.forEach(song => {
            const songWithAlbumArtist: SongWithAlbumAndArtist = {} as SongWithAlbumAndArtist;
            songWithAlbumArtist.song = song;

            this.albumAdapterService.getAlbum(song.albumSurrogateKey, false)
              .pipe(filter(album => album !== null), take(1))
              .subscribe(album => {
                songWithAlbumArtist.album = album.data;

                this.artistAdapterService.getArtist(album.data.artistSurrogateKey, false)
                  .pipe(filter(artist => artist !== null), take(1))
                  .subscribe(artist => {
                    songWithAlbumArtist.artist = artist.data;

                    this._songWithAlbumAndArtist.push(songWithAlbumArtist);
                  });
              });
          });

      }, error => {
        console.error('Error while loading contributions', error);
        this.snackBarComponent.openSnackBar('Error while loading contributions', true);
      }, () => this.loadingStatusService.stopLoading());

      });

  }

  constructSongAlbumArtUrl(imgUrl: string): string {
    return UtilService.constructSongAlbumArtResourceUrl(imgUrl);
  }

  get contributionsResponse(): MyContributionMetadataResponse {
    return this._contributionsResponse;
  }

  get songWithAlbumAndArtist(): SongWithAlbumAndArtist[] {
    return this._songWithAlbumAndArtist;
  }

  gotoPage(pageEvent: PageEvent) {
    this._songWithAlbumAndArtist.splice(0);
    this.getMyContributions(pageEvent.pageIndex, pageEvent.pageSize);
  }

  private editSong(songSurrogateKey: string): void {
    this.contributorUtilService.resetContributorFields();
    const songWithAlbumAndArtist: SongWithAlbumAndArtist = this._songWithAlbumAndArtist.find(song => song.song.surrogateKey === songSurrogateKey);
    setTimeout(() => this.contributorUtilService.sendSongEditData(songWithAlbumAndArtist), 500);
  }
}

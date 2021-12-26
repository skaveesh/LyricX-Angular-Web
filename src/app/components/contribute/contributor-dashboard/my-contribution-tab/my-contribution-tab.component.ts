import {AfterViewInit, Component} from '@angular/core';
import {ContributorAdapterService} from '../../../../services/rest/contributor-adapter.service';
import {MyContributionMetadataResponse} from '../../../../dto/contributor';
import {DefaultSnackBarComponent} from '../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {LoadingStatusService} from '../../../../services/loading-status.service';
import {filter, first, map, mergeMap, take, tap} from 'rxjs/operators';
import {SongWithAlbumAndArtist} from '../../../../dto/song';
import {AlbumAdapterService} from '../../../../services/rest/album-adapter.service';
import {ArtistAdapterService} from '../../../../services/rest/artist-adapter.service';
import {UtilService} from '../../../../services/util.service';
import {PageEvent} from '@angular/material';
import {ContributorUtilService} from '../../../../services/contributor-util.service';
import {from} from 'rxjs';

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
      .pipe(filter(value => value === 2), first(), tap(() => this.loadingStatusService.startLoading()))
      .subscribe(() => {

        this.contributorAdapterService.requestMyContributions(pageNumber, pageSize)
          .pipe(
            filter(res => res !== null), take(1))
          .subscribe(res => {

            this._contributionsResponse = res;
            this.length = res.totalElements;

            from(this._contributionsResponse.songList).pipe(
              map(song => {
                const songWithAlbumArtist: SongWithAlbumAndArtist = {} as SongWithAlbumAndArtist;
                songWithAlbumArtist.song = song;
                return songWithAlbumArtist;
              }),
              mergeMap(songWithAlbumArtistIncludedSong => this.albumAdapterService.getAlbum(songWithAlbumArtistIncludedSong.song.albumSurrogateKey, false)
                .pipe(filter(album => album !== null), take(1),
                  map(album => {
                    songWithAlbumArtistIncludedSong.album = album.data;
                    return songWithAlbumArtistIncludedSong;
                  }),
                  mergeMap(songWithAlbumArtistIncludedSongAndAlbum => this.artistAdapterService.getArtist(songWithAlbumArtistIncludedSongAndAlbum.album.artistSurrogateKey, false)
                    .pipe(filter(artist => artist !== null), take(1),
                      map(artist => {
                        songWithAlbumArtistIncludedSongAndAlbum.artist = artist.data;
                        return songWithAlbumArtistIncludedSongAndAlbum;
                      }))))))
              .subscribe(songWithAlbumArtistIncludedSongAndAlbumAndArtist => {
                this._songWithAlbumAndArtist.push(songWithAlbumArtistIncludedSongAndAlbumAndArtist);
              }, (error) => {
                console.error(error);
                this.snackBarComponent.openSnackBar('Error fetching data', true);
              }, () => this.loadingStatusService.stopLoading());

          }, () => {
            this.snackBarComponent.openSnackBar('Error while loading contributions', true);
          });
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

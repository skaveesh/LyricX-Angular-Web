import { Component, OnInit } from '@angular/core';
import {ContributorUtilService} from '../../../../services/contributor-util.service';
import {filter, first, tap} from 'rxjs/operators';
import {LoadingStatusService} from '../../../../services/loading-status.service';
import {DefaultSnackBarComponent} from '../../../popups-and-modals/default-snack-bar/default-snack-bar.component';
import {ArtistResponseData} from '../../../../dto/artist';
import {UtilService} from '../../../../services/util.service';
import {GenreAdapterService} from '../../../../services/rest/genre-adapter.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-artist-view',
  templateUrl: './artist-view.component.html',
  styleUrls: ['./artist-view.component.css']
})
export class ArtistViewComponent implements OnInit {

  private _artistResponseData: ArtistResponseData = null;
  private _genreNameListOfTheArtist: string[] = [];

  constructor(private router: Router, private contributorUtilService: ContributorUtilService, private genreAdapterService: GenreAdapterService,
              private loadingStatusService: LoadingStatusService, private snackBarComponent: DefaultSnackBarComponent) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit() {
    this.contributorUtilService.getArtistViewData$()
      .pipe(filter(res => res !== null), first(), tap(() => this.loadingStatusService.startLoading()))
      .subscribe((res) => {
        this._artistResponseData = res;
        this.initGenre(res.genreIdList);
      }, () => {
        this.snackBarComponent.openSnackBar('Error while loading album data', true);
      }, () => this.loadingStatusService.stopLoading());
  }

  private initGenre(genreIdList: number[]) {
    this.genreAdapterService.initializeGenre(genreIdList, this._genreNameListOfTheArtist);
  }

  get artistData(): ArtistResponseData {
    return this._artistResponseData;
  }

  get genreNameListOfTheArtist(): string[] {
    return this._genreNameListOfTheArtist;
  }

  constructArtistImageUrl(imgUrl: string): string {
    return UtilService.constructArtistImageResourceUrl(imgUrl);
  }
}

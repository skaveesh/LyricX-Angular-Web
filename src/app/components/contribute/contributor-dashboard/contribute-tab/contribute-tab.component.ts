import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AlbumAndAuthorAddingDashboardComponent} from './album-and-author-adding-dashboard/album-and-author-adding-dashboard.component';
import {Router} from '@angular/router';
import {Constants} from '../../../../constants/constants';
import {SongAddUpdateDashboardComponent} from '../../generic-components/song-add-update-dashboard/song-add-update-dashboard.component';
import {MatHorizontalStepper, MatStepper} from '@angular/material';
import {ViewportScroller} from '@angular/common';
import {SongViewDashboardComponent} from '../../generic-components/song-view-dashboard/song-view-dashboard.component';

@Component({
  selector: 'app-contribute-tab',
  templateUrl: './contribute-tab.component.html',
  styleUrls: ['./contribute-tab.component.css']
})
export class ContributeTabComponent implements OnInit, AfterViewInit {

  @ViewChild(AlbumAndAuthorAddingDashboardComponent, {static: false}) albumAndAuthorAddingDashboardComponent: AlbumAndAuthorAddingDashboardComponent;
  @ViewChild(SongAddUpdateDashboardComponent, {static: false}) songAddingDashboardComponent: SongAddUpdateDashboardComponent;
  @ViewChild(SongViewDashboardComponent, {static: false}) songViewDashboardComponent: SongViewDashboardComponent;

  private _hasSongAddingRequestCompleted = false;

  constructor(private _formBuilder: FormBuilder, private cdr: ChangeDetectorRef, private router: Router, private viewportScroller: ViewportScroller) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  isAlbumArtistInputsInvalid(): boolean {
    return this.albumAndAuthorAddingDashboardComponent === undefined ||
      this.albumAndAuthorAddingDashboardComponent.suggestionUserInterfaceAlbum === undefined ||
      this.albumAndAuthorAddingDashboardComponent.suggestionUserInterfaceAlbum.chipSelectedItems.length !== 1;
  }

  getMandatoryInputNames(): string {
    if (this.albumAndAuthorAddingDashboardComponent === undefined ||
      this.albumAndAuthorAddingDashboardComponent.albumInput === undefined) {
      return null;
    } else {
      return this.albumAndAuthorAddingDashboardComponent.albumInput.nativeElement.name;
    }
  }

  navigateToAlbumCreation() {
    this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.ADD_ALBUM);
  }

  navigateToArtistCreation() {
    this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.ADD_ARTIST);
  }

  delegateSaveSong(matStepper: MatStepper) {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.songAddingDashboardComponent.saveSong(this.albumAndAuthorAddingDashboardComponent.albumCtrl,
      this.albumAndAuthorAddingDashboardComponent.artistCtrl, () => {
        // adding timeout to propagate the changes
        setTimeout(() => {
            matStepper.next();
            document.getElementsByTagName('mat-drawer-content')[0].scrollTo({top: 0, behavior: 'smooth'});
          }, 500);
      }).subscribe(res => {
      setTimeout(() => {
        // adding timeout to propagate the changes
        this.songViewDashboardComponent.songDataBehaviourSubject.next(res);
        }, 500);
    });
  }

  get hasSongAddingRequestCompleted(): boolean {
    return this._hasSongAddingRequestCompleted;
  }

  set hasSongAddingRequestCompleted(value: boolean) {
    this._hasSongAddingRequestCompleted = value;
  }

  private resetEveryFieldOnContributorTabAndStepper(): void {

    this.albumAndAuthorAddingDashboardComponent.artistCtrl.reset();
    this.albumAndAuthorAddingDashboardComponent.albumCtrl.reset();
    this.albumAndAuthorAddingDashboardComponent.suggestionUserInterfaceArtist.chipSelectedItems.splice(0);
    this.albumAndAuthorAddingDashboardComponent.suggestionUserInterfaceAlbum.chipSelectedItems.splice(0);

    this.songAddingDashboardComponent.genreCtrl.reset();
    this.songAddingDashboardComponent.languageCtrl.reset();
    this.songAddingDashboardComponent.lyricsCtrl.reset();
    this.songAddingDashboardComponent.songAddUpdateFormGroup.reset();
    this.songAddingDashboardComponent.genreController.staticSelection.splice(0);
    this.songAddingDashboardComponent.languageController.staticSelection.splice(0);
    this.songAddingDashboardComponent.songAlbumArtUploadData.originalImageBase64 = null;
    this.songAddingDashboardComponent.songAlbumArtUploadData.croppedImageBase64 = null;
    this.songAddingDashboardComponent.songAlbumArtUploadData.croppedImagePositions = null;
    this.songAddingDashboardComponent.resetLyricsFieldHeight();

    this.songViewDashboardComponent.guitarChordToggle = false;
    this.songViewDashboardComponent.displayPublishComponents = false;
    this.songViewDashboardComponent.displayDiffComponent = false;
    this.songViewDashboardComponent.songData = null;

  }

  resetStepper(contributorStepper: MatHorizontalStepper) {
    contributorStepper.reset();
    this.resetEveryFieldOnContributorTabAndStepper();
  }
}

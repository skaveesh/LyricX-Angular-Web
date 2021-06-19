import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlbumAndAuthorAddingDashboardComponent} from './album-and-author-adding-dashboard/album-and-author-adding-dashboard.component';
import {Router} from '@angular/router';
import {Constants} from '../../../../constants/constants';
import {SongAddUpdateDashboardComponent} from '../../generic-components/song-add-update-dashboard/song-add-update-dashboard.component';
import {UtilService} from '../../../../services/util.service';
import {SongSaveRequest} from '../../../../dto/song';
import {SongAdapterService} from '../../../../services/rest/song-adapter.service';
import {DefaultSnackBarComponent} from '../../../popups-and-modals/default-snack-bar/default-snack-bar.component';

@Component({
  selector: 'app-contribute-tab',
  templateUrl: './contribute-tab.component.html',
  styleUrls: ['./contribute-tab.component.css']
})
export class ContributeTabComponent implements OnInit, AfterViewInit {

  @ViewChild(AlbumAndAuthorAddingDashboardComponent, {static: false}) albumAndAuthorAddingDashboardComponent: AlbumAndAuthorAddingDashboardComponent;
  @ViewChild(SongAddUpdateDashboardComponent, {static: false}) songAddingDashboardComponent: SongAddUpdateDashboardComponent;

  // albumArtistAddingFormGroup: FormGroup;
  songAddingFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder, private cdr: ChangeDetectorRef, private router: Router,
              private songAdapter: SongAdapterService, private defaultSnackBar: DefaultSnackBarComponent) {
  }

  ngOnInit(): void {
    this.songAddingFormGroup = this._formBuilder.group({
      songNameCtrl: ['', Validators.required],
      guitarKeyCtrl: ['', Validators.required],
      songBeatCtrl: '',
      songKeywordsCtrl: ['', Validators.required],
      songYouTubeLinkCtrl: ['', Validators.required],
      songSpotifyLinkCtrl: '',
      songDeezerLinkCtrl: '',
      songAppleMusicLinkCtrl: '',
      songExplicitCtrl: false
    });
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

  saveSong() {

    if (!this.songAddingDashboardComponent.isSongFormValid() || this.albumAndAuthorAddingDashboardComponent.albumCtrl.value.length === 0) {
      this.defaultSnackBar.openSnackBar('Provided inputs are invalid. Please check again', true);
      return;
    }

    let isAlbumArtAvailable = false;
    let image = null;
    if (this.songAddingDashboardComponent.songAlbumArtUploadData.croppedImageBase64 != null) {
      image = UtilService.base64URItoBlob(this.songAddingDashboardComponent.songAlbumArtUploadData.croppedImageBase64.toString());
      isAlbumArtAvailable = true;
    }

    const payload: SongSaveRequest = {
      surrogateKey: this.songAddingDashboardComponent.surrogateKey,
      name: this.songAddingFormGroup.controls.songNameCtrl.value,
      albumSurrogateKey: this.albumAndAuthorAddingDashboardComponent.albumCtrl.value[0],
      guitarKey: this.songAddingFormGroup.controls.guitarKeyCtrl.value,
      beat: this.songAddingFormGroup.controls.songBeatCtrl.value,
      languageCode: this.songAddingDashboardComponent.languageCtrl.value[0],
      keywords: this.songAddingFormGroup.controls.songKeywordsCtrl.value,
      lyrics: UtilService.base64EncodeUnicode(this.songAddingDashboardComponent.lyricsCtrl.value),
      youTubeLink: this.songAddingFormGroup.controls.songYouTubeLinkCtrl.value,
      spotifyLink: this.songAddingFormGroup.controls.songSpotifyLinkCtrl.value,
      deezerLink: this.songAddingFormGroup.controls.songDeezerLinkCtrl.value,
      appleMusicLink: this.songAddingFormGroup.controls.songAppleMusicCtrl.value,
      isExplicit: this.songAddingFormGroup.controls.songExplicitCtrl.value,
      artistSurrogateKeyList: this.albumAndAuthorAddingDashboardComponent.artistCtrl.value,
      genreIdList: this.songAddingDashboardComponent.genreCtrl.value.map(Number),
    };

    this.songAdapter.saveSong(payload, image, isAlbumArtAvailable).subscribe(response => {
      this.songAddingDashboardComponent.surrogateKey = (<SongSaveRequest>response.data).surrogateKey;
      this.defaultSnackBar.openSnackBar('Song Saving Successful', false);
      this.songAddingDashboardComponent.destroyAlbumImageUploadData();
    }, error => {
      console.error(error);
      this.defaultSnackBar.openSnackBar('Song Saving Failed', true);
    });
  }
}

import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AlbumAndAuthorAddingDashboardComponent} from './album-and-author-adding-dashboard/album-and-author-adding-dashboard.component';
import {Router} from '@angular/router';
import {Constants} from '../../../../constants/constants';

@Component({
  selector: 'app-contribute-tab',
  templateUrl: './contribute-tab.component.html',
  styleUrls: ['./contribute-tab.component.css']
})
export class ContributeTabComponent implements OnInit, AfterViewInit {

  @ViewChild(AlbumAndAuthorAddingDashboardComponent, {static: false}) albumAndAuthorAddingDashboardComponent: AlbumAndAuthorAddingDashboardComponent;

  albumArtistAddingFormGroup: FormGroup;
  songAddingFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder, private cdr: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit(): void {
    this.albumArtistAddingFormGroup = this._formBuilder.group({
      albumCtrl: '',
      artistCtrl: ''
    });

    this.songAddingFormGroup = this._formBuilder.group({
      songNameCtrl: ''
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

  navigateToAlbumCreation(){
    this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.ADD_ALBUM);
  }

  navigateToArtistCreation(){
    this.router.navigateByUrl(Constants.Symbol.FORWARD_SLASH + Constants.Route.ADD_ARTIST);
  }
}
